import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2 } from 'lucide-react';
import { PlatformItem } from '../types';

interface PlatformModalProps {
    platform: PlatformItem;
    isOpen: boolean;
    onClose: () => void;
}

const PlatformModal: React.FC<PlatformModalProps> = ({ platform, isOpen, onClose }) => {
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const onCloseRef = useRef(onClose);
    const restoreFocusRef = useRef(true);
    const [copyStatus, setCopyStatus] = useState('');
    onCloseRef.current = onClose;

    useEffect(() => {
        if (!isOpen) return;

        const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const previousOverflow = document.body.style.overflow;
        restoreFocusRef.current = true;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus({ preventScroll: true });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCloseRef.current();
                return;
            }
            if (event.key !== 'Tab') return;

            const panel = panelRef.current;
            if (!panel) return;
            const focusable = Array.from(panel.querySelectorAll<HTMLElement>(
                'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )).filter(element => element.getClientRects().length > 0);
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!first || !last) {
                event.preventDefault();
                panel.focus();
            } else if (!panel.contains(document.activeElement)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
            if (restoreFocusRef.current && opener?.isConnected) opener.focus({ preventScroll: true });
        };
    }, [isOpen]);

    useEffect(() => {
        setCopyStatus('');
    }, [platform.id]);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopyStatus('링크를 복사했습니다.');
        } catch {
            setCopyStatus('링크를 복사하지 못했습니다. 주소창의 링크를 복사해주세요.');
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className="relative w-full max-w-6xl bg-white border border-line rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in-up">
                {/* Header */}
                <div className="relative p-5 sm:p-8 pb-4 sm:pb-4 flex shrink-0 justify-between items-start gap-4 border-b border-line bg-white">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-3">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            GNG · {platform.id}
                        </div>
                        <h2 id={titleId} className="text-3xl sm:text-4xl font-bold text-ink mb-2 break-words">{platform.title}</h2>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="닫기"
                        onClick={onClose}
                        className="p-2 min-w-11 min-h-11 shrink-0 rounded-full bg-white hover:bg-[#F5F2FC] text-slate-600 hover:text-ink transition-colors border border-line"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-5 sm:p-8 min-h-0 overflow-y-auto custom-scrollbar bg-white">
                    <p className="text-primary font-medium text-lg">{platform.subtitle}</p>
                    <p className="text-slate-600 mt-2 mb-8 text-lg italic">
                        {platform.detail.description}
                    </p>

                    {/* Value Proposition - Full Width */}
                    <div className="mb-8">
                        <div className="bg-[#F5F2FC] rounded-2xl p-8 border border-line relative overflow-hidden flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-ink mb-4">Why {platform.id}?</h3>
                            <div className="text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">
                                {platform.detail.valueProp.title}
                            </div>
                            <p className="text-slate-700 text-lg leading-relaxed">
                                {platform.detail.valueProp.description}
                            </p>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {platform.detail.features.map((feature, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-6 border border-line hover:border-primary/30 transition-all hover:bg-[#F5F2FC]">
                                <h4 className="text-xl font-bold text-ink mb-4 flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
                                    {feature.title}
                                </h4>
                                <ul className="space-y-3">
                                    {feature.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600 text-base">
                                            <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                                            <span className="leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 shrink-0 border-t border-line bg-[#FAF9F7]">
                    <div className="text-slate-500 text-sm hidden md:block">
                        * {platform.title}의 상세 기능은 고객사 환경에 따라 커스터마이징 가능합니다.
                    </div>
                    <p role="status" className="text-sm text-slate-600 min-h-5 mb-2">{copyStatus}</p>
                    <div className="flex flex-wrap justify-end gap-2">
                        <button
                            type="button"
                            onClick={copyLink}
                            className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-line text-primary hover:bg-[#F5F2FC] transition-colors font-medium"
                        >
                            링크 복사
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-slate-600 hover:text-ink hover:bg-[#F5F2FC] transition-colors font-medium"
                        >
                            닫기
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                restoreFocusRef.current = false;
                                const url = new URL(window.location.href);
                                url.searchParams.set('inquiry', platform.title);
                                url.hash = 'contact';
                                window.history.pushState({}, '', url);

                                // Dispatch custom event for immediate update if on same page
                                window.dispatchEvent(new CustomEvent('inquiry-selected', {
                                    detail: { solutionName: platform.title }
                                }));

                                onClose();
                                document.getElementById('contact')?.scrollIntoView({
                                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
                                });
                            }}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-glow text-white font-bold shadow-sm transition-all hover:scale-105"
                        >
                            솔루션 도입 문의
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PlatformModal;
