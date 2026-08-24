import React, { useState } from 'react';
import { Globe } from 'lucide-react';

export type SupportedLanguage = 'EN' | 'HI' | 'OR';

interface LanguageSwitcherProps {
  currentLang?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang = 'EN',
  onLanguageChange,
}) => {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(currentLang);

  const handleSelect = (lang: SupportedLanguage) => {
    setActiveLang(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const languages: { code: SupportedLanguage; label: string; name: string }[] = [
    { code: 'EN', label: 'EN', name: 'English' },
    { code: 'HI', label: 'हिन्दी', name: 'Hindi' },
    { code: 'OR', label: 'ଓଡ଼ିଆ', name: 'Odia' },
  ];

  return (
    <div className="flex items-center bg-white p-1 rounded-full border border-[#E2DFD5] shadow-xs">
      <div className="flex items-center justify-center pl-2 pr-1 text-[#152E22] font-bold text-[11px] shrink-0">
        <Globe className="w-3.5 h-3.5 text-[#152E22]" />
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
              activeLang === lang.code
                ? 'bg-[#152E22] text-white shadow-xs'
                : 'text-[#5A6E63] hover:text-[#1B231F] hover:bg-[#FAF8F3]'
            }`}
            title={lang.name}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};
