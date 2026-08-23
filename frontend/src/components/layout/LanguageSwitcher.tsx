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
    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center gap-1.5 px-2 text-slate-500 font-bold text-[11px] shrink-0">
        <Globe className="w-3.5 h-3.5 text-indigo-600" />
      </div>

      <div className="flex items-center gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeLang === lang.code
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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
