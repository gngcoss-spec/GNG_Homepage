import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'privacy' | 'terms';
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
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

    const title = type === 'privacy' ? '개인정보처리방침' : '이용약관';

    const privacyContent = (
        <div className="space-y-6 text-slate-700">
            <p>
                <strong>제1조 (목적)</strong><br />
                가능가 주식회사(이하 '회사')는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립·공개합니다.
            </p>
            <p>
                <strong>제2조 (개인정보의 처리 목적)</strong><br />
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.<br />
                1. 홈페이지 회원 가입 및 관리<br />
                2. 재화 또는 서비스 제공<br />
                3. 마케팅 및 광고에의 활용
            </p>
            <p>
                <strong>제3조 (개인정보의 처리 및 보유기간)</strong><br />
                ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.<br />
                ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.<br />
                - 고객 문의 및 상담: 문의 처리 완료 후 3년<br />
                - 서비스 이용 기록: 3년
            </p>
            <p>
                <strong>제4조 (정보주체의 권리·의무 및 행사방법)</strong><br />
                정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.<br />
                1. 개인정보 열람요구<br />
                2. 오류 등이 있을 경우 정정 요구<br />
                3. 삭제요구<br />
                4. 처리정지 요구
            </p>
            <p>
                <strong>제5조 (처리하는 개인정보 항목)</strong><br />
                회사는 다음의 개인정보 항목을 처리하고 있습니다.<br />
                - 필수항목: 성명, 회사명, 이메일, 연락처, 문의내용
            </p>
            <p>
                <strong>제6조 (개인정보의 파기)</strong><br />
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
        </div>
    );

    const termsContent = (
        <div className="space-y-6 text-slate-700">
            <p>
                <strong>제1조 (목적)</strong><br />
                이 약관은 가능가 주식회사(이하 "회사")가 제공하는 제반 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
            <p>
                <strong>제2조 (정의)</strong><br />
                이 약관에서 사용하는 용어의 정의는 다음과 같습니다.<br />
                1. "서비스"라 함은 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 회사의 제반 서비스를 의미합니다.<br />
                2. "회원"이라 함은 회사의 "서비스"에 접속하여 이 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다.
            </p>
            <p>
                <strong>제3조 (약관의 게시와 개정)</strong><br />
                ① "회사"는 이 약관의 내용을 "회원"이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.<br />
                ② "회사"는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 "정보통신망법")" 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
            </p>
            <p>
                <strong>제4조 (서비스의 제공 및 변경)</strong><br />
                ① 회사는 회원에게 아래와 같은 서비스를 제공합니다.<br />
                1. 회사 소개 및 솔루션 안내<br />
                2. 온라인 문의 및 상담<br />
                3. 기타 회사가 정하는 업무<br />
                ② 회사는 서비스의 내용을 변경할 수 있으며, 이 경우 변경된 서비스의 내용 및 제공일자를 명시하여 공지합니다.
            </p>
            <p>
                <strong>제5조 (회원의 의무)</strong><br />
                회원은 다음 행위를 하여서는 안 됩니다.<br />
                1. 신청 또는 변경 시 허위내용의 등록<br />
                2. 타인의 정보 도용<br />
                3. 회사가 게시한 정보의 변경<br />
                4. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
            </p>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-3xl bg-white border border-line rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in-up">
                {/* Header */}
                <div className="p-6 border-b border-line bg-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-ink">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white hover:bg-[#F5F2FC] text-slate-600 hover:text-ink transition-colors border border-line"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar bg-white leading-relaxed">
                    {type === 'privacy' ? privacyContent : termsContent}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-line bg-[#FAF9F7] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-glow text-white font-bold transition-all"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
