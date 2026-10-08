const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
// Uses an existing local Playwright cache; does not modify app dependencies.
const playwrightPath = process.env.GNG_QA_PLAYWRIGHT || 'C:/Users/shsf0/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright';
const { chromium } = require(playwrightPath);

(async () => {
  const qa = __dirname;
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const checks = [], errors = [], external = [];
  const check = (name, pass, details) => {
    checks.push({ name, pass, ...(details === undefined ? {} : { details }) });
    if (!pass) throw new Error(name + ': ' + JSON.stringify(details));
  };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/^https?:/.test(request.url())) external.push(request.url()); });
    await page.goto(pathToFileURL(path.resolve(qa, '../gng-fit-service-plan.html')).href);
    check('page title', /GNG Fit/.test(await page.title()));
    const broken = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => !document.querySelector(h)));
    check('internal anchors', broken.length === 0, broken);
    await page.screenshot({ path: path.join(qa, 'desktop-overview.png') });
    for (const [problem, core] of Object.entries({ facility: 'Smart FM', access: 'SSiN', monitor: 'SSoN', space: 'SpaceOps', safety: 'Golden Bridge', logistics: 'Logistics DX', unknown: '제품 추천 보류' })) {
      await page.selectOption('#problem', problem);
      await page.selectOption('#goal', problem === 'safety' ? 'safety' : 'work');
      await page.locator('#diagnosis button[type=submit]').click();
      const text = await page.locator('#result').innerText();
      check('recommendation ' + problem, text.includes(core), core);
      if (problem === 'safety') check('safety review boundary', text.includes('현장 실증 우선 검토'));
    }
    await page.selectOption('#problem', 'facility');
    await page.selectOption('#goal', 'energy');
    await page.locator('#diagnosis button[type=submit]').click();
    check('energy priority changes primary product', (await page.locator('#result .card').first().innerText()).includes('SSAx'));
    check('energy price factors', (await page.locator('#result').innerText()).includes('계측 포인트·대상 설비'));
    await page.selectOption('#problem', 'access');
    await page.locator('#diagnosis button[type=submit]').click();
    check('conflicting problem and goal defer product selection', (await page.locator('#result .card').first().innerText()).includes('제품 추천 보류'));
    await page.selectOption('#problem', 'facility');
    await page.selectOption('#system', 'unknown');
    check('changed answers invalidate stale results', await page.locator('#result').isHidden());
    await page.locator('#diagnosis button[type=submit]').click();
    check('unknown environment shows follow-up', (await page.locator('#result').innerText()).includes('정보 보완 필요'));
    await page.selectOption('#site', 'office');
    await page.selectOption('#problem', 'logistics');
    await page.selectOption('#goal', 'throughput');
    await page.locator('#diagnosis button[type=submit]').click();
    check('unusual site-problem combination', (await page.locator('#result').innerText()).includes('자동화 장비 추천은 보류'));
    await page.locator('#diagnosis button[type=reset]').click();
    check('reset clears results', await page.locator('#result').isHidden());
    await page.selectOption('#scale', 'multi');
    await page.selectOption('#system', 'connected');
    await page.selectOption('#timing', 'planned');
    await page.locator('#diagnosis button[type=submit]').click();
    const text = await page.locator('#result').innerText();
    check('scale system timeline reflected', text.includes('대표 사업장') && text.includes('API·데이터 품질') && text.includes('예산 일정'));
    const downloadEvent = page.waitForEvent('download');
    await page.click('#save-result');
    const download = await downloadEvent;
    const body = fs.readFileSync(await download.path(), 'utf8');
    check('download contains selected context', body.includes('Smart FM') && body.includes('여러 사업장') && body.includes('예산·사업 일정'));
    check('no unexpected network calls', external.length === 0, external);
    await page.locator('#demo').screenshot({ path: path.join(qa, 'desktop-diagnosis.png'), style: '.topbar{visibility:hidden}' });
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      const overflow = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
      check('no page overflow at ' + width, overflow.document <= overflow.viewport, overflow);
      await page.locator('#demo').screenshot({ path: path.join(qa, 'mobile-' + width + '-diagnosis.png'), style: '.topbar{visibility:hidden}' });
    }
    check('no browser script errors', errors.length === 0, errors);
    console.log(JSON.stringify({ passed: checks.length, qa }, null, 2));
  } finally {
    fs.writeFileSync(path.join(qa, 'validation.json'), JSON.stringify({ date: '2026-10-01', artifact: 'gng-fit-service-plan.html', browser: 'Microsoft Edge via Playwright', scope: 'Local file rendering, recommendation branches and download. No external inquiry, production or field verification.', checks, errors, externalRequests: external }, null, 2));
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
