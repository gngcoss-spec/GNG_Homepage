import React, { useState, useRef, useEffect } from 'react';
import { Send, Mail, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    type: '일반 문의',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // Function to handle inquiry data
    const handleInquiryData = (solutionName: string | null) => {
      if (solutionName) {
        setFormData(prev => ({
          ...prev,
          type: '솔루션 도입 문의',
          message: `${solutionName}에 대해 궁금합니다.`
        }));

        // Focus name input for better UX
        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
        if (nameInput) nameInput.focus();
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

    window.addEventListener('inquiry-selected', handleCustomEvent);
    return () => window.removeEventListener('inquiry-selected', handleCustomEvent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

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
        formRef.current,
        PUBLIC_KEY
      );

      alert('문의가 성공적으로 전송되었습니다. 담당자가 곧 연락드리겠습니다.');
      setFormData({ name: '', email: '', company: '', type: '일반 문의', message: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      alert(`문의 전송에 실패했습니다.\n에러 내용: ${errorMessage}\n\n잠시 후 다시 시도해주세요. 또는 gngss@gngss.co.kr로 직접 문의 부탁드립니다.`);
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
          <div className="bg-white border border-line rounded-3xl p-8 shadow-[0_2px_16px_rgba(23,21,31,0.06)]">
            <h3 className="text-2xl font-bold text-ink mb-6">문의하기</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">이름</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary transition-all placeholder:text-slate-400"
                    placeholder="홍길동"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">회사/기관명</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary transition-all placeholder:text-slate-400"
                    placeholder="(주)가능가"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">이메일</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary transition-all placeholder:text-slate-400"
                  placeholder="example@company.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">문의 유형</label>
                <div className="relative">
                  <select
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
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">문의 내용</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-primary transition-all resize-none placeholder:text-slate-400"
                  placeholder="문의하실 내용을 입력해주세요."
                ></textarea>
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
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;