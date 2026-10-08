// ============================================================
// LeadGate.tsx — 자료 요청 · 데모 요청 리드 수집 폼
// 이름·회사·이메일·동의 → Netlify Forms + Supabase 전송 → 자료 링크 노출
// PDF가 아직 없으면 "자료 준비 중, 이메일로 보내드립니다" 안내
// ============================================================
import React, { useId, useState } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { submitLead } from '../../lib/leads';

interface LeadGateProps {
  solutionSlug: string;
  solutionName: string;
  resourceUrl?: string;   // 솔루션별 상세 브로슈어 PDF. 없으면 통합 브로슈어를 제공하고 상세는 요청 접수
  source?: 'resource-download' | 'demo-request';
  title?: string;
}

const INTEGRATED_BROCHURE = `${import.meta.env.BASE_URL}resources/GNG_Integrated_Brochure.pdf`;

const LeadGate: React.FC<LeadGateProps> = ({ solutionSlug, solutionName, resourceUrl, source = 'resource-download', title }) => {
  const uid = useId();
  const [form, setForm] = useState({ name: '', company: '', email: '', consent: false, detail: true });
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const isDemo = source === 'demo-request';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    setState('sending');
    const { detail, ...lead } = form;
    const r = await submitLead({ ...lead, solution: solutionSlug, source: !isDemo && detail && !resourceUrl ? 'resource-download+detail-brochure-request' : source });
    setState(r.ok ? 'done' : 'error');
  };

  const heading = title ?? (isDemo ? `${solutionName} 데모·상담 요청` : `${solutionName} 소개 자료 받기`);

  return (
    <div className="rounded-2xl bg-white border border-line p-6 md:p-8">
      <h3 className="text-xl font-bold text-ink mb-1">{heading}</h3>
      <p className="text-sm text-slate-600 mb-6">
        {isDemo ? '담당자가 영업일 기준 2일 내 연락드립니다.' : 'GNG 통합 솔루션 브로슈어를 바로 받으실 수 있습니다. 제품별 상세 브로슈어는 요청 시 이메일로 보내드립니다.'}
      </p>

      {state === 'done' ? (
        <div role="status" className="flex flex-col gap-3 text-sm text-slate-700">
          <div className="flex items-center gap-2 text-primary font-semibold"><CheckCircle2 size={18} /> 요청이 접수되었습니다.</div>
          {!isDemo && (
            <>
              <a href={resourceUrl ?? INTEGRATED_BROCHURE} download className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-full font-bold text-sm w-fit">
                <Download size={16} /> {resourceUrl ? `${solutionName} 상세 브로슈어 다운로드` : 'GNG 통합 솔루션 브로슈어 다운로드 (PDF)'}
              </a>
              {!resourceUrl && form.detail && (
                <p>{solutionName} 상세 브로슈어 요청이 함께 접수되었습니다. 담당자가 입력하신 이메일로 보내드리겠습니다.</p>
              )}
            </>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${uid}-name`} className="block text-xs font-semibold text-slate-600 mb-1">이름</label>
              <input id={`${uid}-name`} name="name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label htmlFor={`${uid}-company`} className="block text-xs font-semibold text-slate-600 mb-1">회사/기관명</label>
              <input id={`${uid}-company`} name="company" required autoComplete="organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label htmlFor={`${uid}-email`} className="block text-xs font-semibold text-slate-600 mb-1">업무용 이메일</label>
            <input id={`${uid}-email`} name="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary" />
          </div>
          {!isDemo && !resourceUrl && (
            <label htmlFor={`${uid}-detail`} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input id={`${uid}-detail`} name="detail" type="checkbox" checked={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.checked })} className="w-4 h-4 accent-primary" />
              {solutionName} 상세 브로슈어도 요청합니다 (이메일 발송)
            </label>
          )}
          <div className="rounded-xl bg-background border border-line p-4 text-xs text-slate-600 leading-relaxed">
            수집 항목: 이름·회사명·이메일 · 목적: 자료 발송 및 상담 연락 · 보유기간: 처리 목적 달성 시까지 · 외부 전송: Netlify Forms, Supabase(저장)
            <label htmlFor={`${uid}-consent`} className="mt-3 flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input id={`${uid}-consent`} name="consent" type="checkbox" required checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="w-4 h-4 accent-primary" />
              개인정보 수집·이용 및 외부 전송에 동의합니다. (필수)
            </label>
          </div>
          {state === 'error' && (
            <p role="alert" className="text-sm text-signal-red">전송에 실패했습니다. 잠시 후 다시 시도하시거나 gngss@gngss.co.kr로 문의해 주세요.</p>
          )}
          <button type="submit" disabled={state === 'sending'}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-full transition-all disabled:opacity-50">
            {state === 'sending' ? <><Loader2 size={16} className="animate-spin" /> 전송 중</> : (isDemo ? '데모·상담 요청하기' : '자료 요청하기')}
          </button>
        </form>
      )}
    </div>
  );
};

export default LeadGate;
