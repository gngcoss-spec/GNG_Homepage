import React, { useEffect } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { PlatformItem } from '../types';

interface PlatformModalProps {
    platform: PlatformItem;
    isOpen: boolean;
    onClose: () => void;
}

const PlatformModal: React.FC<PlatformModalProps> = ({ platform, isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-6xl bg-white border border-line rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in-up">
                {/* Header */}
                <div className="relative p-8 pb-4 flex justify-between items-start border-b border-line bg-white">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-3">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            GNG · {platform.id}
                        </div>
                        <h2 className="text-4xl font-bold text-ink mb-2">{platform.title}</h2>
                        <p className="text-primary font-medium text-lg">{platform.subtitle}</p>
                        <p className="text-slate-600 mt-2 text-lg italic">
                            {platform.detail.description}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white hover:bg-[#F5F2FC] text-slate-600 hover:text-ink transition-colors border border-line"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-8 overflow-y-auto custom-scrollbar bg-white">

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
                <div className="p-6 border-t border-line bg-[#FAF9F7] flex justify-between items-center">
                    <div className="text-slate-500 text-sm hidden md:block">
                        * {platform.title}의 상세 기능은 고객사 환경에 따라 커스터마이징 가능합니다.
                    </div>
                    <div className="flex gap-4 ml-auto">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl text-slate-600 hover:text-ink hover:bg-[#F5F2FC] transition-colors font-medium"
                        >
                            닫기
                        </button>
                        <button
                            onClick={() => {
                                const url = new URL(window.location.href);
                                url.searchParams.set('inquiry', platform.title);
                                window.history.pushState({}, '', url);

                                // Dispatch custom event for immediate update if on same page
                                window.dispatchEvent(new CustomEvent('inquiry-selected', {
                                    detail: { solutionName: platform.title }
                                }));

                                onClose();
                                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-glow text-white font-bold shadow-sm transition-all hover:scale-105"
                        >
                            솔루션 도입 문의
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformModal;
