import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import EmptyState from '../../components/shared/EmptyState.jsx';
import useAppStore from '../../store/useAppStore.js';
import useT from '../../i18n/useT.js';
import { getApplications } from '../../data/api.js';

const STATUS_ORDER = ['Submitted','Under Review','Scheduled','Inspected','Certified','Rejected'];

export default function Applications() {
  const { currentUser } = useAppStore();
  const navigate = useNavigate();
  const t = useT();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplications({ ownerId: currentUser.id }).then(d => {
      setApps(d.sort((a, b) => b.submittedDate.localeCompare(a.submittedDate)));
      setLoading(false);
    });
  }, [currentUser.id]);

  if (loading) return <LoadingSpinner text={t('loadingApplications')} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('applicationsTitle')}</h1>
          <p className="text-sm text-gray-500">{t('applicationsSubtitle')}</p>
        </div>
        <button
          onClick={() => navigate('/owner/applications/apply')}
          className="flex items-center gap-2 bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
        >
          <Plus size={16} /> {t('applyForVerification')}
        </button>
      </div>

      {/* Status pipeline */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between gap-1 overflow-x-auto">
          {STATUS_ORDER.map((s, i) => {
            const count = apps.filter(a => a.status === s).length;
            return (
              <div key={s} className="flex items-center flex-1 min-w-0">
                <div className="text-center flex-1">
                  <div className={`text-xl font-bold ${count > 0 ? 'text-indigo-700' : 'text-gray-300'}`}>{count}</div>
                  <StatusBadge status={s} />
                </div>
                {i < STATUS_ORDER.length - 1 && <div className="text-gray-300 text-lg mx-1">›</div>}
              </div>
            );
          })}
        </div>
      </div>

      {apps.length === 0 ? (
        <EmptyState title={t('noApplicationsTitle')} description={t('noApplicationsDesc')} action={
          <button onClick={() => navigate('/owner/applications/apply')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">{t('applyNow')}</button>
        } />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[t('applicationId'), t('instrumentId'), t('type'), t('submitted'), t('scheduled'), t('status')].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {apps.map(app => (
                <tr key={app.applicationId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-indigo-700 font-medium">{app.applicationId}</td>
                  <td className="px-4 py-3 font-mono text-xs">{app.instrumentId}</td>
                  <td className="px-4 py-3"><StatusBadge status={app.type} /></td>
                  <td className="px-4 py-3 text-gray-500">{app.submittedDate}</td>
                  <td className="px-4 py-3 text-gray-500">{app.scheduledDate || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
