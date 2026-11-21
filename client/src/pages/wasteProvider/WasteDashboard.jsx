import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Leaf,
  FileText,
  Clock,
  BookOpen,
  MapPin,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { useProfile } from '../../context/ProfileContext';
import { api } from '../../api/client';
import { WasteAssessmentWizard } from './WasteAssessmentWizard';

export function WasteDashboard() {
  const { activeProfile } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'assessment';

  const [wasteProfile, setWasteProfile] = useState(null);
  const [plants, setPlants] = useState([]);
  const [assumptions, setAssumptions] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get(`/waste/${activeProfile.id}`).catch(() => ({ data: null })),
      api.get('/plants').catch(() => ({ data: [] })),
      api.get('/assumptions').catch(() => ({ data: [] })),
      api.get(`/enquiries?fromProfile=${activeProfile.id}`).catch(() => ({ data: [] })),
    ])
      .then(([wasteRes, plantsRes, assumpRes, enqRes]) => {
        setWasteProfile(wasteRes?.data || null);
        setPlants(plantsRes?.data || []);
        setAssumptions(assumpRes?.data || []);
        setEnquiries(enqRes?.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [activeProfile.id]);

  const setTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="space-y-6">
      {/* Tab 1: Feedstock Assessment Wizard (Default) */}
      {activeTab === 'assessment' && (
        <WasteAssessmentWizard
          onCancel={() => setTab('plants')}
          onViewEnquiries={() => {
            loadData();
            setTab('enquiries');
          }}
          onComplete={() => {
            loadData();
            setTab('enquiries');
          }}
        />
      )}

      {/* Tab 2: Plants Near You */}
      {activeTab === 'plants' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Building2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                  Regional Anaerobic Digestion Plants
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Plants accepting regional commercial and household organic waste streams.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTab('assessment')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
              >
                <span>Calculate Feedstock Yield</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plants.map((plant) => (
                <div
                  key={plant.id}
                  className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-3 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{plant.organisation}</h3>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 capitalize">
                          Scale: {plant.scale} · {plant.capacityMin}–{plant.capacityMax} {plant.capacityUnit}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
                        {plant.serviceArea.slice(0, 2).join(', ')}
                      </span>
                    </div>

                    <div className="space-y-1 text-zinc-700 dark:text-zinc-300 pt-1">
                      <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Accepted Feedstocks:</span>
                      <div className="flex flex-wrap gap-1">
                        {plant.supportedFeedstock.map((f) => (
                          <span key={f} className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-[10px] text-zinc-700 dark:text-zinc-300">
                            {f.split('(')[0].trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                      {plant.omOffering}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                        <ShieldCheck size={13} /> {plant.evidenceSummary?.provided || 0} verified
                      </span>
                      {plant.evidenceSummary?.missing > 0 && (
                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium text-[11px]">
                          <AlertCircle size={13} /> {plant.evidenceSummary.missing} missing
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setTab('assessment')}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      Connect / Book Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Requests & Status */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Clock size={18} className="text-emerald-600 dark:text-emerald-400" />
                  Sent Feedstock Requests & Status
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Track drop-off bookings and project connection enquiries forwarded to regional digesters.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 self-start sm:self-auto">
                {enquiries.length} total requests
              </span>
            </div>

            {enquiries.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  No feedstock requests sent yet. Complete the assessment wizard to connect with regional plants.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('assessment')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl shadow-xs transition-colors"
                >
                  Start Assessment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2.5">
                      <div className="space-y-0.5">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm block">
                          {enq.summary?.wasteType || 'Feedstock Assessment'}
                        </span>
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">Reference: {enq.id}</span>
                      </div>
                      <StatusBadge status={enq.status === 'answered' ? 'verified' : 'pending'} size="sm" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-zinc-700 dark:text-zinc-300">
                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Estimated Daily Yield:</span>
                        <strong className="text-zinc-900 dark:text-zinc-200">{enq.summary?.estimatedBiogasRange || 'Assessment required'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Transport / Contact:</span>
                        <span className="capitalize font-medium text-zinc-900 dark:text-zinc-200">{enq.contactPreference || 'Email'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Unresolved Questions:</span>
                      <p className="text-zinc-700 dark:text-zinc-300 italic mt-0.5">"{enq.questions}"</p>
                    </div>

                    {/* Plant Provider Simulated Replies */}
                    {enq.replies && enq.replies.length > 0 && (
                      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-[11px]">
                          Replies from Plant Provider:
                        </span>
                        {enq.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100 space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                              <span>{reply.authorName || 'Plant Engineering Representative'}</span>
                              <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 flex justify-between pt-1">
                      <span>Submitted on: {new Date(enq.createdAt).toLocaleDateString()}</span>
                      <span>Target Providers: {enq.toPlantIds?.length || 1} plant(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Impact & Benchmarks */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          {/* SDG Impact Metrics Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Leaf size={18} className="text-emerald-600 dark:text-emerald-400" />
                Environmental Impact & Diversion Potential
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Calculated sustainability outcomes when your organic waste is diverted from landfill to anaerobic digestion.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">SDG 12 · Circularity</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 block">100% Diverted</span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Zero organic waste to landfill; transformed into biological soil conditioner.</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">SDG 13 · Climate Action</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 block">~450 kg CO₂e / t</span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Avoided fugitive methane emissions compared to open disposal.</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">SDG 7 · Clean Energy</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 block">~80–120 m³ gas</span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Displaces fossil LPG cylinders or grid electricity for heating.</p>
              </div>
            </div>
          </div>

          {/* Research Benchmarks */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <BookOpen size={18} className="text-emerald-600 dark:text-emerald-400" />
                Published Anaerobic Digestion Research Benchmarks
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Authoritative reference yield rates used to generate indicative output ranges without marketing bias.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assumptions.map((item) => (
                <div
                  key={item.wasteType}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{item.wasteType}</h4>
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
                      {item.yieldMin} – {item.yieldMax} {item.unit.split('/')[0].trim()}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.caveat}</p>
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 gap-2">
                    <span>Source: {item.source}</span>
                    <span>Date: {item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WasteDashboard;