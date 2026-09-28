import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale, User, Briefcase, Building2, ShieldCheck, QrCode,
  Eye, EyeOff, AlertCircle, ChevronRight, ArrowRight,
  Phone, Mail, Globe, Shield, CheckCircle, LogIn
} from 'lucide-react';
import useAppStore, { LANGUAGES } from '../store/useAppStore.js';
import { loginAs } from '../data/api.js';
import useT from '../i18n/useT.js';

const ROLES = [
  { role: 'owner', titleKey: 'ownerTitle', subtitleKey: 'ownerSubtitle', demoKey: 'ownerDemo', icon: User,       iconBg: 'bg-blue-50 text-blue-700 border-blue-200',    cardBorder: 'border-blue-100 hover:border-blue-400' },
  { role: 'lmo',   titleKey: 'lmoTitle',   subtitleKey: 'lmoSubtitle',   demoKey: 'lmoDemo',   icon: Briefcase,   iconBg: 'bg-purple-50 text-purple-700 border-purple-200', cardBorder: 'border-purple-100 hover:border-purple-400' },
  { role: 'gatc',  titleKey: 'gatcTitle',  subtitleKey: 'gatcSubtitle',  demoKey: 'gatcDemo',  icon: Building2,   iconBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',    cardBorder: 'border-cyan-100 hover:border-cyan-400' },
  { role: 'admin', titleKey: 'adminTitle', subtitleKey: 'adminSubtitle', demoKey: 'adminDemo', icon: ShieldCheck, iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200', cardBorder: 'border-indigo-100 hover:border-indigo-400' },
  { role: 'public',titleKey: 'publicTitle',subtitleKey: 'publicSubtitle',demoKey: null,        icon: QrCode,      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', cardBorder: 'border-emerald-100 hover:border-emerald-400', noAuth: true },
];

const TICKER_ITEMS = [
  'New: Digital Verification Certificates now issued with QR Code authentication under Legal Metrology Act, 2009',
  'Re-verification applications can now be submitted online — no physical visit required',
  'Instrument owners: Verify your certificate validity at /verify anytime',
  'GATCs and LMOs: Download offline Inspection Packs for field verification in low-connectivity areas',
  'SIH 2026 Prototype — Vajra Dominators | Problem Statement 26036',
];

function Ticker() {
  return (
    <div className="bg-[#f5f0e8] border-b border-[#d4a853] flex items-center overflow-hidden">
      <div className="bg-[#d4a853] text-white text-[10px] font-bold px-3 py-1.5 shrink-0 uppercase tracking-wider">
        Notice
      </div>
      <div className="overflow-hidden flex-1 py-1.5 px-3">
        <div className="flex gap-16 animate-marquee whitespace-nowrap text-[11px] text-[#5a3e1b] font-medium">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-block">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LangDropdown() {
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
        className="flex items-center gap-1.5 border border-[#138808] text-[#138808] hover:bg-green-50 rounded px-2.5 py-1 text-xs font-semibold transition-colors"
      >
        <Globe size={12} />
        <span>{current.native}</span>
        <ChevronRight size={10} className={`transition-transform duration-150 ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('selectLanguage')}</p>
          </div>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-blue-50 hover:text-[#1a3a6e] transition-colors
                ${language === lang.code ? 'bg-blue-50 text-[#1a3a6e] font-semibold' : 'text-gray-700'}`}
            >
              <span>{lang.label}</span>
              <span>{lang.native}</span>
              {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a6e] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const t = useT();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (roleObj) => {
    if (roleObj.noAuth) { navigate('/verify'); return; }
    setSelectedRole(roleObj);
    setError('');
    setPassword('');
  };

  const handleLogin = async () => {
    if (password !== '1234') { setError('Invalid password. Hint: 1234'); return; }
    setLoading(true);
    try {
      const user = await loginAs(selectedRole.role);
      login(user, selectedRole.role);
      navigate(`/${selectedRole.role}/dashboard`);
    } catch {
      setError('Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ══ 1. TRICOLOUR STRIP ══ */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-gray-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* ══ 2. GOVERNMENT HEADER ══ */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            alt="National Emblem of India"
            className="h-14 w-auto"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div className="border-l border-gray-300 pl-4">
            <p className="text-[#1a1a6e] font-bold text-base leading-tight">{t('govtIndia')} &nbsp;|&nbsp; {t('govtIndiaHi')}</p>
            <p className="text-[#333] text-sm leading-tight mt-0.5">{t('ministry')}</p>
          </div>
          <div className="ml-auto hidden lg:flex items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Phone size={12} className="text-[#FF9933]" />
              <span>{t('helpline')}: <strong className="text-gray-700">1800-11-4000</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={12} className="text-[#FF9933]" />
              <span>legalmetrology@nic.in</span>
            </div>
            <LangDropdown />
          </div>
        </div>
      </div>

      {/* ══ 3. NAV BAR ══ */}
      <div className="bg-[#1a3a6e] shadow">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-0">
          {[t('home'), t('about'), t('regulations'), t('downloads'), t('contactUs')].map((item, i) => (
            <button key={item} className={`text-xs text-blue-100 hover:text-white hover:bg-[#0f2a5a] px-4 py-2.5 transition-colors font-medium ${i === 0 ? 'text-white bg-[#0f2a5a]' : ''}`}>
              {item}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 py-1.5 pr-1">
            <button
              onClick={() => navigate('/verify')}
              className="flex items-center gap-1.5 bg-[#FF9933] hover:bg-[#e8871d] text-white text-xs font-bold px-4 py-1.5 rounded transition-colors"
            >
              <QrCode size={12} /> {t('verifyCertificate')}
            </button>
          </div>
        </div>
      </div>

      {/* ══ 4. TICKER ══ */}
      <Ticker />

      {/* ══ 5. HERO ══ */}
      <div className="bg-gradient-to-r from-[#1a3a6e] to-[#0f2a5a] py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg border-2 border-[#FF9933] shrink-0">
              <Scale size={32} className="text-[#1a3a6e]" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold leading-tight">
                {t('appName')} &nbsp;<span className="text-[#FF9933]">|</span>&nbsp; {t('appNameHi')}
              </h1>
              <p className="text-blue-200 text-sm mt-0.5">{t('portalLabel')}</p>
              <p className="text-blue-300 text-xs mt-0.5">{t('legalMetrologyAct')}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[9px] bg-[#FF9933]/20 text-[#FF9933] border border-[#FF9933]/40 rounded px-2 py-0.5 font-semibold uppercase tracking-wide">SIH 26036</span>
                <span className="text-[9px] bg-white/10 text-blue-200 border border-white/20 rounded px-2 py-0.5">{t('legalMetrologyAct')}</span>
              </div>
            </div>
          </div>
          <div className="hidden xl:flex items-center gap-6 shrink-0">
            {[
              { val: '10,000+', label: t('totalInstruments') },
              { val: '2,400+', label: t('certificatesIssued') },
              { val: '180+',   label: t('activeLMOs') },
              { val: '36',     label: 'States/UTs' },
            ].map(s => (
              <div key={s.label} className="text-center border-l border-white/20 pl-5">
                <p className="text-[#FF9933] text-xl font-bold">{s.val}</p>
                <p className="text-blue-300 text-[10px] max-w-20 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ 6. MAIN CONTENT ══ */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Login / Role selection */}
        <div className="lg:col-span-2">
          {!selectedRole ? (
            <div>
              {/* Section header */}
              <div className="bg-[#1a3a6e] text-white px-4 py-3 rounded-t-lg flex items-center gap-3">
                <div className="w-1 h-5 bg-[#FF9933] rounded" />
                <div>
                  <h2 className="font-bold text-sm uppercase tracking-wide leading-none">
                    {t('loginToPortal')}
                  </h2>
                  <p className="text-blue-300 text-[11px] mt-0.5 leading-none">{t('portalSubtitle')}</p>
                </div>
              </div>

              <div className="bg-white border border-t-0 border-gray-300 rounded-b-lg shadow-sm">
                {/* Instruction banner */}
                <div className="flex items-center gap-3 bg-blue-50 border-b border-blue-100 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a3a6e] flex items-center justify-center shrink-0">
                    <LogIn size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a3a6e]">{t('whoAreYou')}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{t('chooseOption')}</p>
                  </div>
                </div>

                {/* Role cards */}
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {ROLES.map(r => (
                      <button
                        key={r.role}
                        onClick={() => handleRoleSelect(r)}
                        className={`relative border-2 ${r.cardBorder} bg-white hover:bg-gray-50 rounded-xl p-4 text-left transition-all duration-150 hover:shadow-lg group`}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center shrink-0 ${r.iconBg}`}>
                            <r.icon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[#1a3a6e] font-bold text-[13px] leading-snug">{t(r.titleKey)}</h3>
                          </div>
                        </div>
                        <p className="text-gray-500 text-[11px] leading-relaxed border-t border-gray-100 pt-2">{t(r.subtitleKey)}</p>
                        {r.demoKey && (
                          <p className="text-[10px] text-gray-400 mt-2 pt-1.5 border-t border-gray-100">
                            Demo: <span className="text-[#1a3a6e] font-semibold">{t(r.demoKey)}</span>
                          </p>
                        )}
                        {r.noAuth && (
                          <span className="inline-flex items-center gap-1 mt-2 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5 font-semibold">
                            <CheckCircle size={9} /> {t('noLoginRequired')}
                          </span>
                        )}
                        <div className="absolute bottom-3 right-3">
                          <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-[#1a3a6e] flex items-center justify-center transition-colors">
                            <ChevronRight size={13} className="text-gray-400 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Platform Features */}
              <div className="mt-5 bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-[#1a3a6e] text-white px-4 py-2.5 flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#FF9933] rounded" />
                  <h2 className="font-bold text-sm uppercase tracking-wide">{t('platformFeatures')}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
                  {[
                    { icon: '📱', tKey: 'feat1Title', descKey: 'feat1Desc' },
                    { icon: '🔒', tKey: 'feat2Title', descKey: 'feat2Desc' },
                    { icon: '📍', tKey: 'feat3Title', descKey: 'feat3Desc' },
                    { icon: '🔔', tKey: 'feat4Title', descKey: 'feat4Desc' },
                  ].map(f => (
                    <div key={f.tKey} className="p-4 text-center hover:bg-blue-50 transition-colors">
                      <div className="text-2xl mb-1.5">{f.icon}</div>
                      <p className="text-xs font-bold text-[#1a3a6e] mb-1">{t(f.tKey)}</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">{t(f.descKey)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-[#1a3a6e] text-white px-4 py-2.5 rounded-t-lg flex items-center gap-2">
                <div className="w-1 h-4 bg-[#FF9933] rounded" />
                <h2 className="font-bold text-sm uppercase tracking-wide">{t(selectedRole.titleKey)} — {t('loginButton')}</h2>
              </div>
              <div className="bg-white border border-t-0 border-gray-300 rounded-b-lg p-6 shadow-sm">
                <button
                  onClick={() => setSelectedRole(null)}
                  className="flex items-center gap-1.5 text-xs text-[#1a3a6e] hover:underline mb-5"
                >
                  {t('backToRoleSelection')}
                </button>

                <div className="max-w-sm">
                  <div className={`w-12 h-12 rounded-lg border flex items-center justify-center mb-4 ${selectedRole.iconBg}`}>
                    <selectedRole.icon size={22} />
                  </div>
                  <h3 className="text-[#1a3a6e] text-lg font-bold mb-0.5">{t(selectedRole.titleKey)}</h3>
                  <p className="text-gray-500 text-xs mb-5">
                    {t('demoAccount')}: <span className="font-semibold text-gray-700">{selectedRole.demoKey ? t(selectedRole.demoKey) : ''}</span>
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        {t('userId')}
                      </label>
                      <input
                        readOnly
                        value={selectedRole.demoKey ? t(selectedRole.demoKey) : ''}
                        className="w-full border border-gray-300 rounded bg-gray-50 px-3 py-2.5 text-sm text-gray-700 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        {t('password')}
                      </label>
                      <div className="relative">
                        <input
                          type={showPw ? 'text' : 'password'}
                          value={password}
                          onChange={e => { setPassword(e.target.value); setError(''); }}
                          onKeyDown={e => e.key === 'Enter' && handleLogin()}
                          placeholder={t('password')}
                          className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6e] focus:ring-1 focus:ring-blue-200 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {error && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-xs">
                          <AlertCircle size={11} /> {error}
                        </div>
                      )}
                      <p className="text-[10px] text-amber-600 mt-1">{t('demoHint')} <strong>1234</strong></p>
                    </div>

                    <button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#1a3a6e] hover:bg-[#0f2a5a] text-white font-bold py-3 rounded text-sm transition-colors disabled:opacity-60"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><ArrowRight size={15} /> {t('loginButton')}</>
                      )}
                    </button>
                  </div>

                  <div className="mt-5 p-3 bg-[#f5f0e8] border border-[#d4a853]/40 rounded text-[10px] text-[#5a3e1b] flex items-start gap-2">
                    <Shield size={12} className="text-[#d4a853] shrink-0 mt-0.5" />
                    {t('securePortalNote')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          {/* Notice Board */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#1a3a6e] text-white px-4 py-2.5 flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FF9933] rounded" />
              <h3 className="font-bold text-sm uppercase tracking-wide">{t('noticeBoard')}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { date: '20 May 2026', text: 'e-Maap portal unified digital platform launched for Legal Metrology services across India.', tag: 'New' },
                { date: '15 Apr 2026', text: 'Circular: All petrol pump dispensers due for re-verification by 30 June 2026.', tag: 'Circular' },
                { date: '01 Mar 2026', text: 'NABL accredited GATCs can now onboard directly via the GATC registration portal.', tag: 'Update' },
                { date: '10 Jan 2026', text: 'SIH 2026 Prototype — E-Maap Nirikshak demonstrating full digital metrology lifecycle.', tag: 'Info' },
              ].map((n, i) => (
                <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer group">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                          n.tag === 'New' ? 'bg-green-100 text-green-700' :
                          n.tag === 'Circular' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>{n.tag}</span>
                        <span className="text-[10px] text-gray-400">{n.date}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed group-hover:text-[#1a3a6e]">{n.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <button className="text-[11px] text-[#1a3a6e] hover:underline flex items-center gap-1 font-semibold">
                {t('viewAllNotices')} <ChevronRight size={11} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#1a3a6e] text-white px-4 py-2.5 flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FF9933] rounded" />
              <h3 className="font-bold text-sm uppercase tracking-wide">{t('quickLinks')}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                'Legal Metrology Act, 2009',
                'Legal Metrology (General) Rules, 2011',
                'List of Approved GATCs',
                'Verification Fee Schedule',
                'Complaint Registration',
                'Download Certificate of Verification (Form)',
              ].map(link => (
                <button key={link} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 text-xs text-gray-700 hover:text-[#1a3a6e] transition-colors text-left">
                  <span className="flex items-center gap-2">
                    <ArrowRight size={10} className="text-[#FF9933] shrink-0" />
                    {link}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Verify Certificate widget */}
          <div className="bg-[#1a3a6e] rounded-lg p-4 text-white">
            <h3 className="font-bold text-sm mb-1 flex items-center gap-2"><QrCode size={14} className="text-[#FF9933]" />{t('verifyCertWidget')}</h3>
            <p className="text-blue-200 text-[11px] mb-3">{t('verifyCertDesc')}</p>
            <button
              onClick={() => navigate('/verify')}
              className="w-full bg-[#FF9933] hover:bg-[#e8871d] text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <QrCode size={13} /> {t('openVerificationPortal')}
            </button>
          </div>
        </div>
      </div>

      {/* ══ 7. FOOTER ══ */}
      <footer className="bg-[#1a3a6e] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-[#FF9933] uppercase tracking-wide mb-2 text-[11px]">{t('about')}</h4>
            <ul className="space-y-1 text-blue-200">
              {['About the Portal','Ministry of Consumer Affairs','Legal Metrology Division','Accessibility Statement'].map(l => (
                <li key={l}><button className="hover:text-white transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#FF9933] uppercase tracking-wide mb-2 text-[11px]">Services</h4>
            <ul className="space-y-1 text-blue-200">
              {[t('registerInstrumentAction'), t('applyVerification'), t('download'), t('publicVerifyPortal')].map(l => (
                <li key={l}><button className="hover:text-white transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#FF9933] uppercase tracking-wide mb-2 text-[11px]">Help</h4>
            <ul className="space-y-1 text-blue-200">
              {[`${t('helpline')}: 1800-11-4000`,'User Manual','FAQs','Technical Support'].map(l => (
                <li key={l}><button className="hover:text-white transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#FF9933] uppercase tracking-wide mb-2 text-[11px]">Related Sites</h4>
            <ul className="space-y-1 text-blue-200">
              {['consumeraffairs.gov.in','india.gov.in','meity.gov.in','data.gov.in'].map(l => (
                <li key={l}><button className="hover:text-white transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-blue-300">
            <p>© 2026 E-Maap Nirikshak | {t('ministry')} | {t('govtIndia')}</p>
            <p>Last Updated: 26 September 2026 &nbsp;|&nbsp; SIH 2026 — Vajra Dominators &nbsp;|&nbsp; Problem Statement 26036</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
