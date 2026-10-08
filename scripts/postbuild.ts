// ============================================================
// postbuild.ts — 빌드 후 정적 라우트 HTML · sitemap · SPA 폴백 생성
// 실행: node --experimental-strip-types scripts/postbuild.ts  (Node 22+)
// - build/solutions/index.html, build/solutions/<slug>/index.html
//   → build/index.html을 복사하되 <title>/<meta>/canonical/OG를 라우트별로 치환하고
//     크롤러·미리보기용 noscript 요약 본문을 삽입
// - build/sitemap.xml 자동 생성, build/404.html(GitHub Pages SPA 폴백)
// ============================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { SOLUTIONS } from '../content/solutions/index.ts';

const SITE = 'https://gngss.co.kr';
const BUILD = join(process.cwd(), 'build');
const base = readFileSync(join(BUILD, 'index.html'), 'utf8');
const today = new Date().toISOString().slice(0, 10);

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function routeHtml(title: string, description: string, path: string, body: string) {
  let html = base;
  const url = `${SITE}${path}`;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(description)}" />`);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(description)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${esc(title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${esc(description)}" />`);
  // 크롤러용 요약 본문 (React가 마운트되면 교체됨)
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
}

// 두 형태로 저장: <path>/index.html (trailing slash 직접 진입) + <path>.html
// (Netlify·GitHub Pages의 pretty URL이 /solutions/ssin 을 301 없이 바로 서빙하도록)
function write(path: string, html: string) {
  const dir = join(BUILD, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  writeFileSync(join(BUILD, `${path}.html`), html);
}

// 허브
const hubBody = `<main><h1>솔루션</h1><ul>${SOLUTIONS.map((s) => `<li><a href="/solutions/${s.slug}">${esc(s.name)} — ${esc(s.tagline)}</a></li>`).join('')}</ul></main>`;
write('solutions', routeHtml('솔루션 — 8개 제품으로 공간의 안전·보안·운영·물류를 연결 | 가능가 GNG',
  'SSiN·SSoN·SSAx·SpaceOps·Golden Bridge·Smart FM·Edge H/W·Logistics DX. 고객 유형별로 필요한 솔루션을 찾고 상세 기능·도입 구성·절차를 확인하세요.',
  '/solutions', hubBody));

// 상세
for (const s of SOLUTIONS) {
  const body = `<main><h1>${esc(s.name)} — ${esc(s.subtitle)}</h1><p>${esc(s.tagline)}</p><p>${esc(s.summary)}</p>` +
    `<h2>핵심 기능</h2><ul>${s.features.map((f) => `<li><strong>${esc(f.title)}</strong> ${esc(f.summary)}</li>`).join('')}</ul>` +
    `<h2>자주 묻는 질문</h2>${s.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}</main>`;
  write(`solutions/${s.slug}`, routeHtml(s.seo.title, s.seo.description, `/solutions/${s.slug}`, body));
}

// sitemap
const urls = ['/', '/solutions', ...SOLUTIONS.map((s) => `/solutions/${s.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n') +
  `\n</urlset>\n`;
writeFileSync(join(BUILD, 'sitemap.xml'), sitemap);

// GitHub Pages SPA 폴백
if (!existsSync(join(BUILD, '404.html'))) copyFileSync(join(BUILD, 'index.html'), join(BUILD, '404.html'));

console.log(`postbuild: ${urls.length} routes, sitemap written`);
