// ============================================================
// 리드 수집 — Netlify Forms(즉시 수집) + Supabase(저장·조회) 병행
// - Netlify Forms: index.html의 정적 form(name="resource-request")과 같은 필드명으로 POST
// - Supabase: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 있을 때만 insert (없으면 건너뜀)
//   테이블: leads (id uuid default, created_at timestamptz default now(),
//                  name text, company text, email text, solution text, source text, consent bool)
//   RLS: anon role에 insert만 허용
// ============================================================

export interface Lead {
  name: string;
  company: string;
  email: string;
  solution: string;   // slug 또는 'all'
  source: string;     // 'resource-download' | 'demo-request'
  consent: boolean;
}

const FORM_NAME = 'resource-request';

async function submitNetlify(lead: Lead): Promise<boolean> {
  const body = new URLSearchParams({
    'form-name': FORM_NAME,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    solution: lead.solution,
    source: lead.source,
    consent: lead.consent ? 'yes' : 'no',
  });
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function submitSupabase(lead: Lead): Promise<boolean | null> {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) return null; // 미설정 — 건너뜀
  try {
    const res = await fetch(`${url}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(lead),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** 둘 중 하나라도 성공하면 성공으로 간주. 둘 다 미설정/실패면 false. */
export async function submitLead(lead: Lead): Promise<{ ok: boolean; netlify: boolean; supabase: boolean | null }> {
  const [netlify, supabase] = await Promise.all([submitNetlify(lead), submitSupabase(lead)]);
  const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  // 로컬 개발에서는 Netlify 엔드포인트가 없으므로 확인용으로 성공 처리
  return { ok: netlify || supabase === true || isLocal, netlify, supabase };
}
