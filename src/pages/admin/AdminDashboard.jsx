import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Scale, Users, FileText, Award, AlertTriangle, UserCheck, Building2, TrendingUp } from 'lucide-react';
import StatCard from '../../components/shared/StatCard.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import useT from '../../i18n/useT.js';
import { getAdminStats } from '../../data/api.js';

const PIE_COLORS = ['#22C55E', '#EF4444'];

export default function AdminDashboard() {
  const t = useT();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(d => { setStats(d); setLoading(false); });
  }, []);

  if (loading) return <LoadingSpinner text={t('loadingAdmin')} />;

  const passFailData = [
    { name: t('passed'),      value: stats.completedVerifications },
    { name: t('pendingFailed'), value: stats.pendingVerifications },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('adminDashboard')}</h1>
        <p className="text-sm text-gray-500">{t('adminSubtitleDash')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Scale}         label={t('totalInstruments')}    value={stats.totalInstruments}        color="indigo" />
        <StatCard icon={Users}         label={t('totalOwners')}         value={stats.totalOwners}             color="blue" />
        <StatCard icon={FileText}      label={t('totalApplications')}   value={stats.totalApplications}       color="purple" />
        <StatCard icon={Award}         label={t('certificatesIssued')}  value={stats.completedVerifications}  color="green" />
        <StatCard icon={AlertTriangle} label={t('pendingVerifications')}value={stats.pendingVerifications}    color="amber" />
        <StatCard icon={AlertTriangle} label={t('expiredCertificates')} value={stats.expiredCertificates}     color="red" />
        <StatCard icon={UserCheck}     label={t('activeLMOs')}          value={stats.activeLMOs}              color="indigo" />
        <StatCard icon={Building2}     label={t('activeGATCs')}         value={stats.activeGATCs}             color="teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-gray-400" />{t('verificationsOverTime')}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.verificationsByMonth} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} />
              <Bar dataKey="passed" fill="#22C55E" radius={[4, 4, 0, 0]} name={t('passed')} stackId="a" />
              <Bar dataKey="failed" fill="#EF4444" radius={[4, 4, 0, 0]} name={t('pendingFailed')} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">{t('verificationOutcomes')}</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={passFailData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {passFailData.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">{t('applicationsByState')}</h2>
        <div className="space-y-2">
          {stats.applicationsByState.map(s => (
            <div key={s.state} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-28">{s.state}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${(s.count / stats.totalApplications) * 100}%` }} />
              </div>
              <span className="text-sm font-medium text-gray-800 w-6 text-right">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
