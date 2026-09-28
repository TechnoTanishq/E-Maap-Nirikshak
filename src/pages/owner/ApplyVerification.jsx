import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import useAppStore from '../../store/useAppStore.js';
import { getInstruments, submitApplication } from '../../data/api.js';

export default function ApplyVerification() {
  const { currentUser, addToast } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const preselected = location.state?.instrumentId;

  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  const [selectedInstrument, setSelectedInstrument] = useState(preselected || '');
  const [applicationType, setApplicationType] = useState('new');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    getInstruments(currentUser.id).then(d => { setInstruments(d); setLoading(false); });
  }, [currentUser.id]);

  const selectedInstr = instruments.find(i => i.instrumentId === selectedInstrument);

  const handleSubmit = async () => {
    setSubmitting(true);
    const result = await submitApplication({
      instrumentId: selectedInstrument,
      type: applicationType,
      ownerId: currentUser.id,
      remarks,
    });
    setSubmitting(false);
    setDone(result.applicationId);
    addToast('Application submitted successfully!', 'success');
  };

  if (loading) return <LoadingSpinner />;

  if (done) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Application Submitted</h2>
          <p className="text-gray-500 text-sm mb-2">Your application has been submitted successfully.</p>
          <p className="font-mono text-indigo-700 font-bold text-sm mb-6">{done}</p>
          <p className="text-xs text-gray-400 mb-6">The Administrator will review and allocate an LMO or GATC. You'll receive a notification when your inspection is scheduled.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/owner/applications')} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50">View Applications</button>
            <button onClick={() => navigate('/owner/dashboard')} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm hover:bg-indigo-700">Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Apply for Verification</h1>
        <p className="text-sm text-gray-500 mt-1">Submit a verification or re-verification application</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        {/* Instrument selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Select Instrument *</label>
          <select value={selectedInstrument} onChange={e => setSelectedInstrument(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white"
          >
            <option value="">— Select an instrument —</option>
            {instruments.map(i => (
              <option key={i.instrumentId} value={i.instrumentId}>
                {i.type} — {i.instrumentId} ({i.serialNumber})
              </option>
            ))}
          </select>
        </div>

        {selectedInstr && (
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1.5">
            <div className="flex justify-between"><span className="text-gray-500">Type</span><span>{selectedInstr.type}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Manufacturer</span><span>{selectedInstr.manufacturer}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Model</span><span>{selectedInstr.model}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Current Status</span><StatusBadge status={selectedInstr.status} /></div>
            {selectedInstr.validUntil && <div className="flex justify-between"><span className="text-gray-500">Valid Until</span><span>{selectedInstr.validUntil}</span></div>}
          </div>
        )}

        {/* Application type */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Application Type *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'new', label: 'New Verification', desc: 'First-time verification for a new instrument' },
              { value: 're-verification', label: 'Re-verification', desc: 'Renewal after expiry or before expiry' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setApplicationType(opt.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${applicationType === opt.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <p className={`text-sm font-semibold ${applicationType === opt.value ? 'text-indigo-700' : 'text-gray-700'}`}>{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Remarks (optional)</label>
          <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
            rows={3} placeholder="Any specific notes for the verifying officer..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 resize-none"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
          After submission, the Administrator will review and assign an LMO or GATC based on jurisdiction and availability.
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={() => navigate('/owner/applications')} className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
        <button onClick={handleSubmit} disabled={!selectedInstrument || submitting}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40">
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
}
