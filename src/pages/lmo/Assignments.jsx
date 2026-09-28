import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, MapPin } from 'lucide-react';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import EmptyState from '../../components/shared/EmptyState.jsx';
import useAppStore from '../../store/useAppStore.js';
import useT from '../../i18n/useT.js';
import { getApplications, getInstruments, getOwners } from '../../data/api.js';

export default function Assignments() {
  const { currentUser } = useAppStore();
  const navigate = useNavigate();
  const t = useT();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [apps, instrs, owners] = await Promise.all([
        getApplications({ officerId: currentUser.id }),
        getInstruments(),
        getOwners(),
      ]);
      const enriched = apps.map(a => {
        const instr = instrs.find(i => i.instrumentId === a.instrumentId);
        const owner = owners.find(o => o.id === instr?.ownerId);
        return { ...a, instr, owner };
      });
      setItems(enriched.sort((a, b) => (b.scheduledDate || '').localeCompare(a.scheduledDate || '')));
      setLoading(false);
    }
    load();
  }, [currentUser.id]);

  if (loading) return <LoadingSpinner text={t('loadingApplications')} />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('myAssignmentsTitle')}</h1>
        <p className="text-sm text-gray-500">{items.length} {t('assignedInspection')}</p>
      </div>

      {items.length === 0 ? (
        <EmptyState title={t('noAssignmentsTitle')} description={t('noAssignmentsDesc')} />
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.applicationId} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{item.instr?.type || t('instrument')}</p>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-xs font-mono text-indigo-700 mt-0.5">{item.instrumentId}</p>
                </div>
                {item.status === 'Scheduled' && (
                  <button
                    onClick={() => navigate(`/lmo/inspect/${item.applicationId}`)}
                    className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700"
                  >
                    <Play size={12} /> {t('conductInspection')}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div><p className="text-gray-400">{t('ownerLabel')}</p><p className="font-medium">{item.owner?.name || '—'}</p></div>
                <div><p className="text-gray-400">{t('typeLabel')}</p><p className="font-medium capitalize">{item.type}</p></div>
                <div><p className="text-gray-400">{t('scheduledLabel')}</p><p className="font-medium">{item.scheduledDate || t('notYet')}</p></div>
                <div>
                  <p className="text-gray-400">{t('location')}</p>
                  <p className="font-medium flex items-center gap-1 truncate">
                    <MapPin size={10} className="text-gray-400 shrink-0" />
                    {item.instr?.registeredAddress?.split(',').slice(-2).join(',').trim() || '—'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
