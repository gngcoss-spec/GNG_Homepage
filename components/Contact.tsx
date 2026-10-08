import React, { useState, useRef, useEffect } from 'react';
import { Send, Mail, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { FIT_INQUIRY_EVENT, FIT_INVALIDATE_EVENT, type FitInquiryDetail } from '../data/fitTypes';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const formRevision = useRef(0);
  const fitInquiryRef = useRef<FitInquiryDetail | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState('');
  const [fitInquiry, setFitInquiry] = useState<FitInquiryDetail | null>(null);
  const [inquiryNotice, setInquiryNotice] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'success-preserved' | 'error' | 'consent-required'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    type: '일반 문의',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    formRevision.current += 1;
    setFormData(prev => ({ ...prev, [name === 'user_message' ? 'message' : name]: value }));
    setSubmitStatus('idle');
  };

  const removeFitInquiry = () => {
    formRevision.current += 1;
    fitInquiryRef.current = null;
    setFitInquiry(null);
    setSelectedSolution('');
    setPrivacyConsent(false);
    setSubmitStatus('idle');
    setInquiryNotice('현장 진단을 제외했습니다. 작성하신 문의 내용은 유지됩니다.');
  };

  const outgoingMessage = [
    formData.message.trim(),
    fitInquiry && `[GNG Fit 현장 진단]\n진단 기준: ${fitInquiry.ruleVersion}\n추천 구성: ${fitInquiry.solutionNames.join(', ') || '상담 후 확인'}\n\n${fitInquiry.summary}`
  ].filter(Boolean).join('\n\n');

  useEffect(() => {
    // Function to handle inquiry data
    const handleInquiryData = (solutionName: string | null) => {
      if (solutionName) {
        formRevision.current += 1;
        setInquiryNotice(fitInquiryRef.current ? '선택한 솔루션이 변경되어 이전 현장 진단을 제외했습니다.' : '');
        fitInquiryRef.current = null;
        setFitInquiry(null);
        setPrivacyConsent(false);
        setSelectedSolution(solutionName);
        setSubmitStatus('idle');
        setFormData(prev => ({
          ...prev,
          type: '솔루션 도입 문의',
          message: prev.message.trim() ? prev.message : `${solutionName}에 대해 궁금합니다.`
        }));

        // Focus name input for better UX
        const nameInput = formRef.current?.querySelector<HTMLInputElement>('#contact-name');
        nameInput?.focus({ preventScroll: true });
      }
    };

    // Check URL params on mount
    const urlParams = new URLSearchParams(window.location.search);
    const inquiryParam = urlParams.get('inquiry');
    if (inquiryParam) {
      handleInquiryData(inquiryParam);
    }

    // Listen for custom event
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.solutionName) {
        handleInquiryData(customEvent.detail.solutionName);
      }
    };

    const handleFitInquiry = (e: Event) => {
      const detail = (e as CustomEvent<FitInquiryDetail>).detail;
      if (!detail || typeof detail.summary !== 'string' || !detail.summary.trim() ||
        !Array.isArray(detail.solutionNames) || !detail.solutionNames.every(name => typeof name === 'string') ||
        typeof detail.ruleVersion !== 'string') return;

      formRevision.current += 1;
      setInquiryNotice(fitInquiryRef.current ? '새 현장 진단으로 교체했습니다. 첨부 내용을 확인한 뒤 다시 동의해주세요.' : '현장 진단을 첨부했습니다. 내용을 확인한 뒤 전송해주세요.');
      fitInquiryRef.current = detail;
      setFitInquiry(detail);
      setSelectedSolution(detail.solutionNames.join(', '));
      setPrivacyConsent(false);
      setSubmitStatus('idle');
      setFormData(prev => ({ ...prev, type: '솔루션 도입 문의' }));
      formRef.current?.querySelector<HTMLInputElement>('#contact-name')?.focus({ preventScroll: true });
    };

    const handleFitInvalidation = () => {
      if (!fitInquiryRef.current) return;
      removeFitInquiry();
      setInquiryNotice('진단 선택이 변경되어 이전 첨부를 제외했습니다. 새 검토안으로 상담을 준비해주세요.');
    };

    window.addEventListener('inquiry-selected', handleCustomEvent);
    window.addEventListener(FIT_INQUIRY_EVENT, handleFitInquiry);
    window.addEventListener(FIT_INVALIDATE_EVENT, handleFitInvalidation);
    return () => {
      window.removeEventListener('inquiry-selected', handleCustomEvent);
      window.removeEventListener(FIT_INQUIRY_EVENT, handleFitInquiry);
      window.removeEventListener(FIT_INVALIDATE_EVENT, handleFitInvalidation);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current || isSubmitting) return;
    if (!privacyConsent) {
      setSubmitStatus('consent-required');
      formRef.current.querySelector<HTMLInputElement>('#contact-privacy-consent')?.focus();
      return;
    }
    if (!formRef.current.reportValidity()) return;

    const submittedRevision = formRevision.current;
    const submittedForm = document.createElement('form');
    new FormData(formRef.current).forEach((value, name) => {
      if (typeof value !== 'string') return;
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      submittedForm.appendChild(input);
    });

    setSubmitStatus('idle');
    setIsSubmitting(true);

    // TODO: Replace with your actual EmailJS keys
    // Sign up at https://www.emailjs.com/
    const SERVICE_ID = 'service_myccx8i';
    const TEMPLATE_ID = 'template_vt9hwe1';
    const PUBLIC_KEY = 'qNOuL3c4rhj7xYMOn';

    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        submittedForm,
        PUBLIC_KEY
      );

      if (formRevision.current === submittedRevision) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', type: '일반 문의', message: '' });
        setSelectedSolution('');
        fitInquiryRef.current = null;
        setFitInquiry(null);
        setInquiryNotice('');
        setPrivacyConsent(false);
      } else {
        setSubmitStatus('success-preserved');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-background border-t border-line relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line bg-white text-slate-700 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Contact Us
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-6 leading-tight">
              AX·DX 전환에 대한<br />
              <span className="text-primary">궁금증</span>이 있으신가요?
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              가능가 주식회사는 DT·AI 기반 AX·DX 전환을 통해
              산업 현장, 스마트빌딩, 취약계층 시설에 ‘안심’을 설계하고 구축합니다.
              <br /><br />
              디지털 트윈과 인공지능을 결합하여 공간이 스스로 운영되고 최적화되는 미래를 만들어갑니다.
            </p>

            <div className="space-y-6 mt-12">
              <a href="mailto:gngss@gngss.co.kr" className="flex items-center gap-4 text-ink hover:text-primary transition-colors group p-4 rounded-xl hover:bg-[#F5F2FC] -mx-4">
                <div className="w-12 h-12 rounded-full bg-[#F5F2FC] flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="text-slate-600 group-hover:text-primary" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">메일로 직접 문의하기</div>
                  <div className="text-lg font-semibold flex items-center gap-2">
                    gngss@gngss.co.kr
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4 text-ink p-4 -mx-4">
                <div className="w-12 h-12 rounded-full bg-[#F5F2FC] flex items-center justify-center">
                  <MapPin className="text-slate-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">본사 위치</div>
                  <div className="text-lg font-semibold">세종특별자치시 한누리대로 1824, 606-74호</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white border border-line rounded-3xl p-5 sm:p-8 shadow-[0_2px_16px_rgba(23,21,31,0.06)]">
            <h3 className="text-2xl font-bold text-ink mb-6">문의하기</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="solution" value={selectedSolution} />
              <input type="hidden" name="message" value={outgoingMessage} />
              {selectedSolution && (
                <p className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
                  선택한 솔루션: {selectedSolution}
                </p>
              )}
              {fitInquiry && (
                <div id="contact-fit-summary" className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-semibold text-ink">상담에 첨부할 현장 진단</h4>
                    <button id="contact-remove-fit" type="button" onClick={removeFitInquiry} className="min-h-11 rounded-lg px-3 text-sm font-medium text-primary hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                      진단 내용 제외
                    </button>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">{fitInquiry.summary}</p>
                  <p className="mt-3 text-xs text-slate-500">전송하기를 누르면 아래 문의 내용과 함께 전달됩니다.</p>
                </div>
              )}
              <p id="contact-inquiry-notice" role="status" aria-live="polite" className="text-sm leading-relaxed text-slate-600">{inquiryNotice}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">이름</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary transition-all placeholder:text-slate-400"
                    placeholder="홍길동"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-company" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">회사/기관명 (선택)</label>
                  <input
                    id="contact-company"
                    type="text"
                    name="company"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary transition-all placeholder:text-slate-400"
                    placeholder="(주)가능가"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">이메일</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary transition-all placeholder:text-slate-400"
                  placeholder="example@company.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-type" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">문의 유형</label>
                <div className="relative">
                  <select
                    id="contact-type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option className="bg-white">일반 문의</option>
                    <option className="bg-white">솔루션 도입 문의</option>
                    <option className="bg-white">기술 제휴 문의</option>
                    <option className="bg-white">기타 문의</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{fitInquiry ? '추가 문의 내용 (선택)' : '문의 내용'}</label>
                <textarea
                  id="contact-message"
                  name="user_message"
                  value={formData.message}
                  onChange={handleChange}
                  required={!fitInquiry}
                  rows={4}
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary transition-all resize-none placeholder:text-slate-400"
                  placeholder="문의하실 내용을 입력해주세요."
                ></textarea>
              </div>

              <div className="rounded-xl border border-line bg-background p-4 text-xs leading-relaxed text-slate-600">
                <p id="contact-privacy-notice">
                  수집 항목: 이름·이메일·회사명(선택)·문의 내용<br />
                  선택 수집 항목: 현장 진단 답변·추천 구성(상담에 첨부한 경우)<br />
                  목적: 문의 응대<br />
                  보유기간: 처리 목적 달성 시까지<br />
                  외부 전송: EmailJS 이메일 발송 서비스
                </p>
                <label htmlFor="contact-privacy-consent" className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink">
                  <input
                    id="contact-privacy-consent"
                    type="checkbox"
                    name="privacy_consent"
                    checked={privacyConsent}
                    onChange={(e) => {
                      formRevision.current += 1;
                      setPrivacyConsent(e.target.checked);
                      setSubmitStatus('idle');
                    }}
                    required
                    aria-describedby="contact-privacy-notice"
                    className="h-4 w-4 shrink-0 accent-primary"
                  />
                  개인정보 수집·이용 및 외부 전송에 동의합니다. (필수)
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-glow text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    전송하기
                    <Send size={18} />
                  </>
                )}
              </button>
              <div role="status" aria-live="polite" aria-atomic="true" className="text-sm leading-relaxed text-slate-700">
                {submitStatus === 'success' && '문의가 성공적으로 전송되었습니다. 담당자가 곧 연락드리겠습니다.'}
                {submitStatus === 'success-preserved' && '전송을 요청한 문의가 성공적으로 전달되었습니다. 전송 중 변경하신 내용은 현재 폼에 유지됩니다.'}
                {submitStatus === 'consent-required' && '개인정보 수집·이용 및 외부 전송에 동의해주세요.'}
                {submitStatus === 'error' && (
                  <p>
                    문의 전송에 실패했습니다. 입력하신 내용은 유지됩니다. 잠시 후 다시 시도해주세요. 또는{' '}
                    <a href="mailto:gngss@gngss.co.kr" className="font-medium text-primary underline underline-offset-2">gngss@gngss.co.kr</a>로 직접 문의 부탁드립니다.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
