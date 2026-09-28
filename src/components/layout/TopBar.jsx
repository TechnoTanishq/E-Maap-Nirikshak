import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Scale, LogOut, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAppStore, { LANGUAGES } from '../../store/useAppStore.js';
import useT from '../../i18n/useT.js';

const ROLE_BADGE = {
  owner: 'bg-blue-100 text-blue-800 border-blue-200',
  lmo:   'bg-purple-100 text-purple-800 border-purple-200',
  gatc:  'bg-cyan-100 text-cyan-800 border-cyan-200',
  admin: 'bg-amber-100 text-amber-800 border-amber-200',
};

const ROLE_KEY = {
  owner: 'roleOwner',
  lmo:   'roleLMO',
  gatc:  'roleGATC',
  admin: 'roleAdmin',
};

function LanguageSwitcher() {
  const { language, setLanguage } = useAppStore();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 border border-gray-200 hover:border-[#1a3a6e] hover:bg-blue-50 rounded px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:text-[#1a3a6e] transition-colors"
        title={t('selectLanguage')}
      >
        <Globe size={13} className="text-[#1a3a6e]" />
        <span>{current.native}</span>
        <ChevronDown size={11} className={`text-gray-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('selectLanguage')}</p>
          </div>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-blue-50 hover:text-[#1a3a6e]
                ${language === lang.code ? 'bg-blue-50 text-[#1a3a6e] font-semibold' : 'text-gray-700'}`}
            >
              <span>{lang.label}</span>
              <span>{lang.native}</span>
              {language === lang.code && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[#1a3a6e] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopBar({ role }) {
  const { currentUser, logout } = useAppStore();
  const navigate = useNavigate();
  const t = useT();
  const badge = ROLE_BADGE[role] || '';

  const notifRoute = role === 'owner' ? '/owner/notifications' : null;

  return (
    <header className="bg-white border-b border-gray-200 shrink-0 sticky top-0 z-20 shadow-sm">
      {/* ── Tricolour micro strip ── */}
      <div className="flex h-0.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="h-12 flex items-center justify-between px-5">
        {/* Left — ministry name */}
        <div className="flex items-center gap-2">
          <Scale size={15} className="text-[#1a3a6e]" />
          <div className="hidden sm:block">
            <p className="text-[10px] text-gray-400 leading-none">{t('ministry')}</p>
            <p className="text-xs font-semibold text-[#1a3a6e] leading-none mt-0.5">{t('portalLabel')} — {t('appName')}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <div className="w-px h-5 bg-gray-200" />

          {/* Role badge */}
          <span className={`hidden sm:inline-flex text-[10px] font-semibold border rounded px-2 py-0.5 ${badge}`}>
            {t(ROLE_KEY[role] || 'roleOwner')}
          </span>

          {/* Notification bell */}
          <button
            onClick={() => notifRoute && navigate(notifRoute)}
            className="relative p-1.5 rounded hover:bg-gray-100 transition-colors"
            title={t('notifications_bell')}
          >
            <Bell size={16} className="text-gray-500" />
          </button>

          <div className="w-px h-5 bg-gray-200" />

          {/* User */}
          <div className="flex items-center gap-1.5 cursor-pointer group">
            <div className="w-7 h-7 rounded bg-[#1a3a6e] text-white text-[10px] font-bold flex items-center justify-center">
              {currentUser?.avatar || currentUser?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-800 leading-none">{currentUser?.name}</p>
              <p className="text-[9px] text-gray-400 leading-none mt-0.5">
                {currentUser?.designation || currentUser?.city || t('portalLabel')}
              </p>
            </div>
            <ChevronDown size={12} className="text-gray-400" />
          </div>

          {/* Logout */}
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors ml-1"
            title={t('signOut')}
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
