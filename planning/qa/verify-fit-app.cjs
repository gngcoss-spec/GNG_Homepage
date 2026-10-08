const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.GNG_QA_PLAYWRIGHT || 'playwright');

const baseUrl = process.env.GNG_FIT_URL || 'http://127.0.0.1:4176';
const output = path.join(__dirname, 'fit-app');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const checks = [], errors = [];
  let responseMode = 'failure', posts = 0, lastPayload = '', releaseResponse;
  // All EmailJS requests are intercepted; this verifier never sends a real message.
  await context.route('https://api.emailjs.com/**', async route => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST,OPTIONS', 'access-control-allow-headers': '*' } });
      return;
    }
    posts += 1;
    lastPayload = route.request().postDataBuffer()?.toString('utf8') || '';
    if (responseMode === 'deferred') await new Promise(resolve => { releaseResponse = resolve; });
    await route.fulfill({ status: responseMode === 'failure' ? 503 : 200, contentType: 'text/plain', body: responseMode === 'failure' ? 'Test failure' : 'OK', headers: { 'access-control-allow-origin': '*' } });
  });
  const check = (name, passed) => { checks.push({ name, passed }); assert.ok(passed, name); };
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const form = page.locator('#fit-form');
  const captureSection = async (selector, filename) => {
    const captureStyle = await page.addStyleTag({ content: 'header,header *,.scroll-progress{visibility:hidden!important}' });
    await page.locator(selector).screenshot({ path: path.join(output, filename) });
    await captureStyle.evaluate(element => element.remove());
  };
  const next = () => form.getByRole('button', { name: '다음', exact: true }).click();
  const build = () => form.getByRole('button', { name: '맞춤 검토안 보기', exact: true }).click();
  const diagnose = async ({ problem = 'facility', goal = 'work', site = 'building', scale = 'zone', system = 'manual', timing = 'explore' } = {}) => {
    await form.getByRole('button', { name: '선택 초기화' }).click();
    await page.selectOption('#fit-site', site);
    await page.selectOption('#fit-problem', problem);
    await next();
    await page.selectOption('#fit-scale', scale);
    await page.selectOption('#fit-system', system);
    await next();
    await page.selectOption('#fit-goal', goal);
    await page.selectOption('#fit-timing', timing);
    await build();
    await page.locator('#fit-result').waitFor();
  };
  try {
    await page.goto(baseUrl + '/#fit');
    await form.waitFor();
    await page.waitForTimeout(1100); // Initial hash reposition after font/poster layout settles.
    check('direct fit entry and heading', await page.locator('#fit-site').isVisible());
    await next();
    check('missing response focuses first field', await page.locator('#fit-site').evaluate(el => el === document.activeElement));
    check('missing response prevents advancement', await page.locator('#fit-answer-error').isVisible());
    await page.locator('#needs').getByRole('button', { name: /점검·민원·설비 운영/ }).click();
    check('problem card presets diagnosis', await page.inputValue('#fit-problem') === 'facility');
    await page.selectOption('#fit-site', 'factory');
    await next();
    await page.selectOption('#fit-scale', 'multi');
    await page.selectOption('#fit-system', 'separate');
    await form.getByRole('button', { name: '이전', exact: true }).click();
    check('previous step retains answers', await page.inputValue('#fit-site') === 'factory' && await page.inputValue('#fit-problem') === 'facility');
    await next();
    check('forward navigation retains answers', await page.inputValue('#fit-scale') === 'multi' && await page.inputValue('#fit-system') === 'separate');
    await next();
    await page.selectOption('#fit-goal', 'work');
    await page.selectOption('#fit-timing', 'planned');
    await build();
    let resultText = await page.locator('#fit-result').innerText();
    check('facility recommendation includes relevant scope', resultText.includes('Smart FM') && resultText.includes('대표 사업장') && resultText.includes('예산 일정'));
    check('result receives keyboard focus', await page.locator('#fit-result').evaluate(el => el === document.activeElement));
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: '검토안 저장 (.txt)', exact: true }).click();
    const download = await downloadPromise;
    const downloadText = fs.readFileSync(await download.path(), 'utf8');
    check('download contains answers and recommendation', downloadText.includes('Smart FM') && downloadText.includes('여러 사업장') && downloadText.includes('제조·산업 현장'));
    check('diagnosis does not send email', posts === 0);

    const draft = '추가 요청: 야간 점검 업무도 함께 확인해 주세요.';
    await page.fill('#contact-message', draft);
    await page.getByRole('button', { name: '이 검토안으로 상담 준비', exact: true }).click();
    check('contact attachment is visible', await page.locator('#contact-fit-summary').isVisible());
    check('contact preserves existing draft', await page.inputValue('#contact-message') === draft);
    let outgoing = await page.locator('#contact input[name=message]').inputValue();
    check('existing email message receives both draft and diagnosis', outgoing.includes(draft) && outgoing.includes('Smart FM') && outgoing.includes('제조·산업 현장'));
    check('contact preparation is not a submission', posts === 0);
    await page.fill('#contact-name', '로컬 검증');
    await page.fill('#contact-email', 'local-test@example.invalid');
    await page.locator('#contact button[type=submit]').click();
    check('consent prevents submission', posts === 0 && !await page.isChecked('#contact-privacy-consent'));
    await page.check('#contact-privacy-consent');
    await page.locator('#contact button[type=submit]').click();
    await page.getByText('문의 전송에 실패했습니다.', { exact: false }).waitFor();
    check('mock failure preserves draft and diagnosis', await page.inputValue('#contact-message') === draft && await page.locator('#contact-fit-summary').isVisible());
    check('mock outgoing message includes both contexts', lastPayload.includes(draft) && lastPayload.includes('Smart FM') && lastPayload.includes('GNG Fit'));
    await page.click('#contact-remove-fit');
    check('remove attachment preserves draft and resets consent', await page.inputValue('#contact-message') === draft && !await page.isChecked('#contact-privacy-consent') && await page.locator('#contact-fit-summary').count() === 0);
    check('removed diagnosis is absent from outgoing message', !(await page.locator('#contact input[name=message]').inputValue()).includes('GNG Fit'));

    await page.getByRole('button', { name: '이 검토안으로 상담 준비', exact: true }).click();
    await page.check('#contact-privacy-consent');
    await form.getByRole('button', { name: '선택 초기화' }).click();
    await page.locator('#contact-fit-summary').waitFor({ state: 'detached' });
    check('diagnosis reset invalidates previous attachment and consent', !await page.isChecked('#contact-privacy-consent') && await page.inputValue('#contact-message') === draft);
    await diagnose({ problem: 'space', goal: 'throughput', site: 'office' });
    await page.getByRole('button', { name: '이 검토안으로 상담 준비', exact: true }).click();
    outgoing = await page.locator('#contact input[name=message]').inputValue();
    check('new diagnosis replaces old attachment', outgoing.includes('SpaceOps') && !outgoing.includes('Smart FM') && outgoing.includes(draft));
    check('replaced attachment requires fresh consent', !await page.isChecked('#contact-privacy-consent'));
    await page.check('#contact-privacy-consent');
    responseMode = 'deferred';
    const pendingRequest = page.waitForRequest(request => request.url().startsWith('https://api.emailjs.com/') && request.method() === 'POST');
    await page.locator('#contact button[type=submit]').click();
    await pendingRequest;
    await page.fill('#contact-message', '전송 중 새롭게 작성한 문의');
    await page.waitForFunction(() => document.querySelector('#contact button[type=submit]')?.disabled);
    responseMode = 'success';
    releaseResponse();
    await page.getByText('전송 중 변경하신 내용은 현재 폼에 유지됩니다.', { exact: false }).waitFor();
    check('in-flight edits survive successful previous request', await page.inputValue('#contact-message') === '전송 중 새롭게 작성한 문의');
    check('submission snapshot excludes later edits', lastPayload.includes(draft) && !lastPayload.includes('전송 중 새롭게 작성한 문의'));

    await page.locator('#contact button[type=submit]').click();
    await page.getByText('문의가 성공적으로 전송되었습니다.', { exact: false }).waitFor();
    check('mock success clears submitted form and attachment', await page.inputValue('#contact-message') === '' && await page.inputValue('#contact-name') === '' && await page.locator('#contact-fit-summary').count() === 0);

    await diagnose({ problem: 'facility', goal: 'energy' });
    resultText = await page.locator('#fit-result').innerText();
    check('energy recommendation uses SSAx and relevant cost factors', resultText.includes('SSAx') && resultText.includes('계측 포인트'));
    await page.selectOption('#fit-goal', 'work');
    check('edited answer invalidates stale result and actions', await page.locator('#fit-result').count() === 0);
    await build();
    check('edited recommendation recomputes', (await page.locator('#fit-result h5').innerText()).includes('Smart FM'));
    await diagnose({ problem: 'access', goal: 'energy' });
    check('conflicting goals do not recommend products', await page.locator('#fit-result h5').count() === 0 && (await page.locator('#fit-result').innerText()).includes('우선순위'));
    await diagnose({ problem: 'safety', goal: 'safety', site: 'public' });
    check('safety routes to development and validation discussion', await page.locator('#fit-result h5').count() === 0 && (await page.locator('#fit-result-title').innerText()).includes('실증'));
    await diagnose({ problem: 'unknown', goal: 'unknown', site: 'unknown', scale: 'unknown', system: 'unknown', timing: 'unknown' });
    check('unknown answers permit diagnosis without fabricated product', await page.locator('#fit-result').isVisible() && await page.locator('#fit-result h5').count() === 0);

    await diagnose({ problem: 'logistics', goal: 'throughput', site: 'warehouse' });
    await page.getByRole('button', { name: '이 검토안으로 상담 준비', exact: true }).click();
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('inquiry-selected', { detail: { solutionName: 'SSiN' } })));
    await page.locator('#contact-fit-summary').waitFor({ state: 'detached' });
    check('legacy product selection removes unrelated diagnosis', await page.locator('#contact-fit-summary').count() === 0 && await page.locator('#contact input[name=solution]').inputValue() === 'SSiN');
    await page.goto(baseUrl + '/?inquiry=SSiN#contact');
    await page.locator('#contact-name').waitFor();
    check('legacy inquiry URL remains supported', (await page.inputValue('#contact-message')).includes('SSiN'));
    await diagnose();
    await page.getByRole('button', { name: '이 검토안으로 상담 준비', exact: true }).click();
    check('fit replaces stale product query without exposing answers', !page.url().includes('inquiry=') && !page.url().includes('system=') && page.url().endsWith('#contact'));
    await page.goto(baseUrl + '/#product-sson');
    await page.getByRole('dialog').waitFor();
    check('legacy product deep link remains functional', (await page.getByRole('dialog').innerText()).includes('SSoN'));
    await page.keyboard.press('Escape');

    await page.goto(baseUrl);
    await page.locator('#needs').waitFor();
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(output, 'desktop-home.png') });
    await captureSection('#needs', 'desktop-diagnosis.png');
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.getByRole('button', { name: '메뉴 열기', exact: true }).click();
      await page.locator('#mobile-navigation').getByRole('link', { name: '맞춤 진단', exact: true }).click();
      check('mobile diagnosis entry ' + width, await page.locator('#mobile-navigation').count() === 0);
      await diagnose({ scale: 'multi', system: 'connected', timing: 'planned' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      check('no page overflow at ' + width, !overflow);
      const fitOverflow = await page.locator('#fit').evaluate(el => el.scrollWidth > el.clientWidth);
      check('no clipped diagnosis overflow at ' + width, !fitOverflow);
      await captureSection('#fit', 'mobile-' + width + '-diagnosis.png');
      await captureSection('#fit-result', 'mobile-' + width + '-result.png');
    }
    check('no browser application errors', errors.length === 0);
    check('email tests were intercepted', posts === 3);
    console.log(JSON.stringify({ passed: checks.length, realEmailSent: false, output }, null, 2));
  } finally {
    if (releaseResponse) releaseResponse();
    fs.writeFileSync(path.join(output, 'validation.json'), JSON.stringify({ date: '2026-10-01', baseUrl, checks, errors, mockedEmailRequests: posts, realEmailSent: false }, null, 2));
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
