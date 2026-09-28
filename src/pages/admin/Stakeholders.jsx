import { useEffect, useState } from 'react';
import { Users, UserCheck, Building2 } from 'lucide-react';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import useT from '../../i18n/useT.js';
import { getOwners, getLMOs, getGATCs } from '../../data/api.js';

export default function Stakeholders() {
  const t = useT();
  const [tab, setTab] = useState('owners');
  const [owners, setOwners] = useState([]);
  const [lmos, setLmos] = useState([]);
  const [gatcs, setGatcs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOwners(), getLMOs(), getGATCs()]).then(([o, l, g]) => {
      setOwners(o); setLmos(l); setGatcs(g); setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner text={t('loadingStakeholders')} />;

  const TABS = [
    { key: 'owners', labelKey: 'instrumentOwners', icon: Users,     count: owners.length },
    { key: 'lmos',   labelKey: 'legalMetrologyOfficers', icon: UserCheck, count: lmos.length },
    { key: 'gatcs',  labelKey: 'gatcs',            icon: Building2, count: gatcs.length },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('stakeholderMgmt')}</h1>
        <p className="text-sm text-gray-500">{t('stakeholderSubtitle')}</p>
      </div>

      <div className="flex gap-2">
        {TABS.map(tab_ => (
          <button key={tab_.key} onClick={() => setTab(tab_.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${tab === tab_.key ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <tab_.icon size={14} />{t(tab_.labelKey)}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === tab_.key ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{tab_.count}</span>
          </button>
        ))}
      </div>

      {tab === 'owners' && (
        <StakeholderTable
          data={owners}
          columns={[t('name'), t('email'), t('phone'), t('city'), t('state'), t('registered')]}
          rows={o => [o.name, o.email, o.phone, o.city, o.state, o.registeredDate]}
          t={t}
        />
      )}
      {tab === 'lmos' && (
        <StakeholderTable
          data={lmos}
          columns={[t('name'), t('email'), t('phone'), t('designation'), t('jurisdiction'), t('inspections')]}
          rows={l => [l.name, l.email, l.phone, l.designation, l.jurisdiction, `${l.completedInspections} ${t('completed')}`]}
          t={t}
        />
      )}
      {tab === 'gatcs' && (
        <StakeholderTable
          data={gatcs}
          columns={[t('name'), t('email'), t('phone'), t('accreditation'), t('jurisdiction'), t('tests')]}
          rows={g => [g.name, g.email, g.phone, g.accreditation, g.jurisdiction, `${g.completedTests} ${t('completed')}`]}
          t={t}
        />
      )}
    </div>
  );
}

function StakeholderTable({ data, columns, rows, t }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
            ))}
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{t('actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {rows(item).map((val, j) => (
                <td key={j} className={`px-4 py-3 text-gray-700 ${j === 0 ? 'font-semibold' : ''}`}>{val}</td>
              ))}
              <td className="px-4 py-3">
                <div className="flex gap-1.5">
                  <button className="text-xs border border-indigo-200 text-indigo-700 px-2.5 py-1 rounded-lg hover:bg-indigo-50">{t('viewBtn')}</button>
                  <button className="text-xs border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg hover:bg-gray-50">{t('deactivate')}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
