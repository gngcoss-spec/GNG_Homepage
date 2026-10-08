// ============================================================
// useSeo — 라우트별 title/description/canonical/OG를 index.html의 기존 태그에 덮어쓴다
// (React 19의 <meta> 호이스팅은 정적 태그와 중복되므로, 기존 태그를 갱신하는 방식 사용)
// 사전 렌더링된 HTML(scripts/postbuild.ts)과 같은 값을 클라이언트 전환 시에도 유지
// ============================================================
import { useEffect } from 'react';

interface Seo { title: string; description: string; url: string }

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector<HTMLElement>(selector);
  if (el) el.setAttribute(attr, value);
}

export function useSeo({ title, description, url }: Seo) {
  useEffect(() => {
    const prev = {
      title: document.title,
      desc: document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      canonical: document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
      ogTitle: document.head.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
      ogDesc: document.head.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? '',
      ogUrl: document.head.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '',
    };
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    return () => {
      document.title = prev.title;
      setMeta('meta[name="description"]', 'content', prev.desc);
      setMeta('link[rel="canonical"]', 'href', prev.canonical);
      setMeta('meta[property="og:title"]', 'content', prev.ogTitle);
      setMeta('meta[property="og:description"]', 'content', prev.ogDesc);
      setMeta('meta[property="og:url"]', 'content', prev.ogUrl);
    };
  }, [title, description, url]);
}
