import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
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
  Search,
  Filter,
  Check,
  Info,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { useProfile } from '../../context/ProfileContext';
import { api } from '../../api/client';
import { WasteAssessmentWizard } from './WasteAssessmentWizard';
import { ProviderDetailModal } from '../../components/ProviderDetailModal';

export function WasteDashboard() {
  const { activeProfile } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'assessment';
  const shouldReduceMotion = useReducedMotion();

  const [wasteProfile, setWasteProfile] = useState(null);
  const [plants, setPlants] = useState([]);
  const [assumptions, setAssumptions] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State for Plants Discovery
  const [searchQuery, setSearchQuery] = useState('');
  const [scaleFilter, setScaleFilter] = useState('all');

  // Selected plant for full dossier modal
  const [selectedPlantDossier, setSelectedPlantDossier] = useState(null);

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

  // Filtered plants for discovery tab
  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchesSearch =
        plant.organisation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.serviceArea?.some((area) => area.toLowerCase().includes(searchQuery.toLowerCase())) ||
        plant.supportedFeedstock?.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesScale = scaleFilter === 'all' || plant.scale?.toLowerCase() === scaleFilter.toLowerCase();
      return matchesSearch && matchesScale;
    });
  }, [plants, searchQuery, scaleFilter]);

  return (
    <div className="space-y-6 font-sans">
      {/* ======================================================== */}
      {/* SCREEN 1: Waste Generator Dashboard Overview Card        */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-forest-900 font-mono uppercase tracking-wider">
                Waste Generator Portal
              </span>
              <StatusBadge status="verified" size="sm" label="Active Profile" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
              Welcome back, {activeProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              {activeProfile.location || 'Indiranagar, Bengaluru'} · Commercial kitchen organic waste evaluation and regional digester matching.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setTab('assessment')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-subtle transition-colors cursor-pointer ${
                activeTab === 'assessment'
                  ? 'bg-forest-900 hover:bg-forest-800 text-white'
                  : 'bg-forest-50 hover:bg-forest-100 text-forest-900 border border-forest-200'
              }`}
            >
              <Sparkles size={14} className="stroke-[2.2]" />
              <span>Create Waste Assessment</span>
            </motion.button>
          </div>
        </div>

        {/* 4 Summary Metric Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Daily Feedstock Volume
            </span>
            <span className="text-lg font-bold text-zinc-900 font-mono block">
              ~150 kg/day
            </span>
            <span className="text-[11px] text-zinc-500">Commercial kitchen prep scraps</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Indicative Biogas Yield
            </span>
            <span className="text-lg font-bold text-forest-900 font-mono block">
              12 – 18 m³/day
            </span>
            <span className="text-[11px] text-zinc-500">~70 – 110 kWh thermal energy</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Compatible AD Plants
            </span>
            <span className="text-lg font-bold text-zinc-900 font-mono block">
              {plants.length} Regional
            </span>
            <span className="text-[11px] text-zinc-500">Accepting organic food waste</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Sent Enquiries / Bookings
            </span>
            <span className="text-lg font-bold text-zinc-900 font-mono block">
              {enquiries.length} Active
            </span>
            <span className="text-[11px] text-zinc-500">Track responses in My Bookings</span>
          </div>
        </div>

        {/* Recommended Next Steps Card */}
        <div className="p-3.5 rounded-xl bg-forest-50/70 border border-forest-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-forest-800 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold text-forest-950 block">Recommended Next Action:</span>
              <p className="text-zinc-600 text-[11px]">
                Complete your feedstock assessment to receive an indicative yield spread, then request a collection slot from local digesters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setTab('plants')}
              className="text-xs font-semibold text-forest-900 hover:underline cursor-pointer"
            >
              Explore Nearby Plants →
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Tab 1: Feedstock Assessment Wizard                       */}
      {/* ======================================================== */}
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

      {/* ======================================================== */}
      {/* Tab 2: Regional Plants Near You (Screen 4 Discovery)      */}
      {/* ======================================================== */}
      {activeTab === 'plants' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Building2 size={18} className="text-forest-800" />
                  Regional Anaerobic Digestion Plants
                </h2>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Verified digester operators accepting commercial kitchen, mandi, and community organic waste.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTab('assessment')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-900 hover:text-forest-800 transition-colors cursor-pointer"
              >
                <span>Calculate Yield First</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Search & Scale Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search by name, city, or feedstock..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 text-xs"
                />
              </div>

              {/* Scale Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-[11px] font-semibold text-zinc-500 mr-1 flex items-center gap-1">
                  <Filter size={12} /> Scale:
                </span>
                {['all', 'small', 'medium', 'large'].map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setScaleFilter(scale)}
                    className={`capitalize text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                      scaleFilter === scale
                        ? 'bg-forest-900 text-white border-forest-800 shadow-subtle'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                    }`}
                  >
                    {scale === 'all' ? 'All Scales' : scale}
                  </button>
                ))}
              </div>
            </div>

            {/* Plant Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlants.map((plant) => (
                <div
                  key={plant.id}
                  className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-4 text-xs flex flex-col justify-between hover:border-forest-700/60 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-zinc-900 text-sm">{plant.organisation}</h3>
                        <span className="text-[11px] text-zinc-500 capitalize">
                          Scale: {plant.scale} · {plant.capacityMin}–{plant.capacityMax} {plant.capacityUnit}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 shrink-0">
                        {plant.serviceArea?.slice(0, 2).join(', ')}
                      </span>
                    </div>

                    <div className="space-y-1 text-zinc-700 pt-1">
                      <span className="text-zinc-500 block text-[11px]">Accepted Feedstocks:</span>
                      <div className="flex flex-wrap gap-1">
                        {plant.supportedFeedstock?.map((f) => (
                          <span
                            key={f}
                            className="bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-[10px] text-zinc-700"
                          >
                            {f.split('(')[0].trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-zinc-600 line-clamp-2 leading-relaxed">
                      {plant.omOffering}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-forest-900 font-medium text-[11px]">
                        <ShieldCheck size={13} className="text-forest-800" /> {plant.evidenceSummary?.provided || 2} verified
                      </span>
                      {plant.evidenceSummary?.missing > 0 && (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-medium text-[11px]">
                          <AlertCircle size={13} /> {plant.evidenceSummary.missing} missing
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPlantDossier(plant)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 transition-colors cursor-pointer shadow-subtle"
                      >
                        Inspect Dossier
                      </button>

                      <button
                        type="button"
                        onClick={() => setTab('assessment')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-white transition-colors cursor-pointer shadow-subtle"
                      >
                        Book Slot
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Tab 3: Sent Requests & Status (Screen 7 My Enquiries)    */}
      {/* ======================================================== */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Clock size={18} className="text-forest-800" />
                  Sent Feedstock Requests & Status
                </h2>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Track drop-off bookings and project connection enquiries forwarded to regional digesters.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 self-start sm:self-auto">
                {enquiries.length} total requests
              </span>
            </div>

            {enquiries.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                <p className="text-xs text-zinc-500">
                  No feedstock requests sent yet. Complete the assessment wizard to connect with regional plants.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('assessment')}
                  className="px-4 py-2 bg-forest-900 hover:bg-forest-800 text-white font-medium text-xs rounded-xl shadow-subtle transition-colors cursor-pointer"
                >
                  Start Assessment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-2.5">
                      <div className="space-y-0.5">
                        <span className="font-bold text-zinc-900 text-sm block">
                          {enq.summary?.wasteType || 'Feedstock Assessment'}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">Reference: {enq.id}</span>
                      </div>
                      <StatusBadge status={enq.status === 'answered' ? 'verified' : 'pending'} size="sm" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-zinc-700">
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Estimated Daily Yield:</span>
                        <strong className="text-zinc-900">{enq.summary?.estimatedBiogasRange || 'Assessment required'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Transport / Contact:</span>
                        <span className="capitalize font-medium text-zinc-900">{enq.contactPreference || 'Email'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200">
                      <span className="text-zinc-500 block text-[11px]">Unresolved Questions:</span>
                      <p className="text-zinc-700 italic mt-0.5">"{enq.questions}"</p>
                    </div>

                    {/* Plant Provider Simulated Replies */}
                    {enq.replies && enq.replies.length > 0 && (
                      <div className="pt-3 border-t border-zinc-200 space-y-2">
                        <span className="font-bold text-forest-900 block text-[11px]">
                          Replies from Plant Provider:
                        </span>
                        {enq.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-3 rounded-xl bg-forest-50 border border-forest-200 text-forest-950 space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] text-forest-900 font-semibold">
                              <span>{reply.authorName || 'Plant Engineering Representative'}</span>
                              <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-zinc-800">{reply.message || reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[10px] text-zinc-400 flex justify-between pt-1">
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

      {/* ======================================================== */}
      {/* Tab 4: Impact & Benchmarks                               */}
      {/* ======================================================== */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Leaf size={18} className="text-forest-800" />
                Environmental Impact & Diversion Potential
              </h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                Calculated sustainability outcomes when your organic waste is diverted from landfill to anaerobic digestion.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 space-y-1">
                <span className="text-[10px] font-bold text-forest-900 uppercase tracking-wider block">SDG 12 · Circularity</span>
                <span className="text-lg font-bold text-zinc-900 block font-mono">100% Diverted</span>
                <p className="text-zinc-600 leading-relaxed text-[11px]">Zero organic waste to landfill; transformed into biological soil conditioner.</p>
              </div>

              <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 space-y-1">
                <span className="text-[10px] font-bold text-forest-900 uppercase tracking-wider block">SDG 13 · Climate Action</span>
                <span className="text-lg font-bold text-zinc-900 block font-mono">~35 kg CO₂e / 100kg</span>
                <p className="text-zinc-600 leading-relaxed text-[11px]">Avoided fugitive methane emissions compared to open disposal.</p>
              </div>

              <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 space-y-1">
                <span className="text-[10px] font-bold text-forest-900 uppercase tracking-wider block">SDG 7 · Clean Energy</span>
                <span className="text-lg font-bold text-zinc-900 block font-mono">~10–14 m³ gas</span>
                <p className="text-zinc-600 leading-relaxed text-[11px]">Displaces fossil LPG cylinders or grid electricity for heating.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <BookOpen size={18} className="text-forest-800" />
                Published Anaerobic Digestion Research Benchmarks
              </h3>
              <p className="text-xs text-zinc-600 mt-0.5">
                Authoritative reference yield rates used to generate indicative output ranges without marketing bias.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assumptions.map((item) => (
                <div
                  key={item.wasteType}
                  className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-zinc-900 text-sm">{item.wasteType}</h4>
                    <span className="text-[11px] font-semibold text-forest-900 bg-white px-2 py-0.5 rounded border border-forest-200 shrink-0">
                      {item.yieldMin} – {item.yieldMax} {item.unit.split('/')[0].trim()}
                    </span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed text-[11px]">{item.caveat}</p>
                  <div className="pt-2 border-t border-zinc-200 flex flex-wrap items-center justify-between text-[10px] text-zinc-400 gap-2">
                    <span>Source: {item.source}</span>
                    <span>Date: {item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Screen 5: Full Provider Dossier & Evidence Modal */}
      <ProviderDetailModal
        isOpen={Boolean(selectedPlantDossier)}
        onClose={() => setSelectedPlantDossier(null)}
        plant={selectedPlantDossier}
        enquiryButtonLabel="Book Feedstock Drop-off Slot"
        onSendEnquiry={(p) => {
          setSelectedPlantDossier(null);
          setTab('assessment');
        }}
      />
    </div>
  );
}

export default WasteDashboard;
