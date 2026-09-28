import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Scale, FileText, Award, Bell, LogOut,
  ClipboardList, Users, AlertTriangle, BarChart3,
  History, ShieldCheck, Home, ChevronRight
} from 'lucide-react';
import useAppStore from '../../store/useAppStore.js';

const NAV_ITEMS = {
  owner: [
    { to: '/owner/dashboard',      icon: LayoutDashboard, label: 'Dashboard',         labelHi: 'डैशबोर्ड' },
    { to: '/owner/instruments',    icon: Scale,           label: 'My Instruments',    labelHi: 'मेरे यंत्र' },
    { to: '/owner/applications',   icon: FileText,        label: 'Applications',      labelHi: 'आवेदन' },
    { to: '/owner/certificates',   icon: Award,           label: 'Certificates',      labelHi: 'प्रमाण-पत्र' },
    { to: '/owner/notifications',  icon: Bell,            label: 'Notifications',     labelHi: 'सूचनाएं' },
  ],
  lmo: [
    { to: '/lmo/dashboard',    icon: LayoutDashboard, label: 'Dashboard',          labelHi: 'डैशबोर्ड' },
    { to: '/lmo/assignments',  icon: ClipboardList,   label: 'My Assignments',     labelHi: 'निरीक्षण कार्य' },
    { to: '/lmo/history',      icon: History,         label: 'Inspection History', labelHi: 'इतिहास' },
  ],
  gatc: [
    { to: '/gatc/dashboard',   icon: LayoutDashboard, label: 'Dashboard',      labelHi: 'डैशबोर्ड' },
    { to: '/gatc/assignments', icon: ClipboardList,   label: 'Assigned Tests', labelHi: 'परीक्षण कार्य' },
    { to: '/gatc/history',     icon: History,         label: 'Test History',   labelHi: 'इतिहास' },
  ],
  admin: [
    { to: '/admin/dashboard',     icon: LayoutDashboard, label: 'Dashboard',           labelHi: 'डैशबोर्ड' },
    { to: '/admin/applications',  icon: FileText,        label: 'Applications Queue',  labelHi: 'आवेदन कतार' },
    { to: '/admin/stakeholders',  icon: Users,           label: 'Stakeholders',        labelHi: 'हितधारक' },
    { to: '/admin/certificates',  icon: Award,           label: 'Certificate Registry',labelHi: 'रजिस्ट्री' },
    { to: '/admin/enforcement',   icon: AlertTriangle,   label: 'Enforcement & Risk',  labelHi: 'प्रवर्तन' },
    { to: '/admin/reports',       icon: BarChart3,       label: 'Reports',             labelHi: 'रिपोर्ट' },
  ],
};

const ROLE_META = {
  owner: { label: 'Instrument Owner',             labelHi: 'यंत्र स्वामी',          accentColor: 'bg-blue-500' },
  lmo:   { label: 'Legal Metrology Officer',       labelHi: 'विधिक माप-विज्ञान अधिकारी', accentColor: 'bg-purple-500' },
  gatc:  { label: 'Govt. Approved Test Centre',    labelHi: 'सरकारी परीक्षण केंद्र',   accentColor: 'bg-cyan-500' },
  admin: { label: 'Administrator',                 labelHi: 'प्रशासक',               accentColor: 'bg-amber-500' },
};

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const { logout, currentUser } = useAppStore();
  const navItems = NAV_ITEMS[role] || [];
  const meta = ROLE_META[role] || {};

  return (
    <aside className="w-60 min-h-screen bg-[#1a3a6e] flex flex-col shrink-0 shadow-xl">

      {/* ── Tricolour top strip ── */}
      <div className="flex h-1">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* ── Logo / Portal Name ── */}
      <div className="px-4 py-4 border-b border-blue-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white rounded flex items-center justify-center shrink-0 shadow-sm">
            <Scale size={18} className="text-[#1a3a6e]" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">E-Maap Nirikshak</p>
            <p className="text-blue-300 text-[9px] leading-tight">माप निरीक्षक</p>
          </div>
        </div>
        <p className="text-blue-400 text-[9px] mt-1.5 leading-tight">
          Legal Metrology Verification Portal<br />
          Ministry of Consumer Affairs
        </p>
      </div>

      {/* ── User chip ── */}
      <div className="px-3 py-3 border-b border-blue-800">
        <div className="bg-[#0f2a5a] rounded p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {currentUser?.avatar || currentUser?.name?.slice(0,2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{currentUser?.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${meta.accentColor} shrink-0`} />
                <p className="text-blue-300 text-[9px] truncate">{meta.label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        <p className="text-blue-400 text-[9px] uppercase tracking-widest font-semibold px-2 mb-2">Navigation</p>
        {navItems.map(({ to, icon: Icon, label, labelHi }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-white text-[#1a3a6e] shadow-sm'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate leading-tight">{label}</p>
                  <p className={`text-[8px] leading-tight truncate ${isActive ? 'text-[#1a3a6e]/60' : 'text-blue-400'}`}>{labelHi}</p>
                </div>
                {isActive && <ChevronRight size={12} className="text-[#1a3a6e]/40 shrink-0" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom actions ── */}
      <div className="px-2 py-2 border-t border-blue-800 space-y-0.5">
        <button
          onClick={() => window.open('/verify', '_blank')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-blue-200 hover:bg-blue-800 hover:text-white transition-all"
        >
          <Home size={14} />
          <span>Public Verify Portal</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-blue-200 hover:bg-blue-800 hover:text-white transition-all"
        >
          <ShieldCheck size={14} />
          <span>Switch Role</span>
        </button>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-red-300 hover:bg-red-700 hover:text-white transition-all"
        >
          <LogOut size={14} />
          <span>Sign Out / लॉग आउट</span>
        </button>
      </div>

      {/* ── Bottom badge ── */}
      <div className="px-3 py-2 border-t border-blue-800">
        <p className="text-[8px] text-blue-500 text-center leading-relaxed">
          Legal Metrology Act, 2009<br />
          Govt. of India · SIH 26036
        </p>
      </div>
    </aside>
  );
}
