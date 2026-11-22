import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Leaf,
  FileText,
  Clock,
  BookOpen,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  RotateCcw,
  Search,
  Filter,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { useProfile } from '../../context/ProfileContext';
import { api } from '../../api/client';
import { WasteAssessmentWizard } from './WasteAssessmentWizard';
import { ProviderDetailModal } from '../../components/ProviderDetailModal';
import { CylinderIcon } from '../../components/CylinderIcon';

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
      {/* Overview Card */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-forest-900">
                Waste generator portal
              </span>
              <StatusBadge status="verified" size="sm" label="Active profile" />
            </div>
            <h1 className="text-xl sm:text-2xl font-medium text-zinc-900">
              Commercial organic waste management
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              Kitchen scrap evaluation, biogas yield estimation, and regional digester connections.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTab('assessment')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${activeTab === 'assessment'
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                  : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                }`}
            >
              <Sparkles size={14} className="stroke-[1.5]" />
              <span>New waste assessment</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
            <span className="text-[11px] text-zinc-500 block">
              Daily scrap volume
            </span>
            <span className="text-lg font-medium text-zinc-900 block tabular-nums">
              ~150 kg/day
            </span>
            <span className="text-[11px] text-zinc-500">Commercial kitchen prep</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
            <span className="text-[11px] text-zinc-500 block flex items-center gap-1">
              <CylinderIcon size={14} className="text-amber-700" />
              LPG fuel displaced
            </span>
            <span className="text-lg font-medium text-forest-900 block tabular-nums">
              ~6 cylinders/mo
            </span>
            <span className="text-[11px] text-zinc-500 font-medium text-forest-800">₹11,100 / mo saved</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
            <span className="text-[11px] text-zinc-500 block">
              Compatible plants
            </span>
            <span className="text-lg font-medium text-zinc-900 block tabular-nums">
              {plants.length} regional
            </span>
            <span className="text-[11px] text-zinc-500">Accepting wet organic scraps</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
            <span className="text-[11px] text-zinc-500 block">
              Active bookings
            </span>
            <span className="text-lg font-medium text-zinc-900 block tabular-nums">
              {enquiries.length} requests
            </span>
            <span className="text-[11px] text-zinc-500">Tracked in my bookings</span>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-forest-900 shrink-0 stroke-[1.5]" />
            <span className="text-zinc-700">
              <span className="font-medium text-zinc-900">Next step: </span>
              Complete your feedstock assessment to receive an indicative yield spread, then request a collection slot.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setTab('plants')}
            className="text-xs font-medium text-forest-900 hover:text-forest-800 transition-colors cursor-pointer shrink-0"
          >
            Explore nearby plants →
          </button>
        </div>
      </div>

      {/* Tab 1: Feedstock Assessment Wizard */}
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

      {/* Tab 2: Regional Plants Discovery */}
      {activeTab === 'plants' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-medium text-zinc-900 flex items-center gap-2">
                  <Building2 size={16} className="text-forest-900 stroke-[1.5]" />
                  Regional biogas plants
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Verified digester operators accepting commercial kitchen, mandi, and community organic waste.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTab('assessment')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-forest-900 hover:text-forest-800 transition-colors cursor-pointer"
              >
                <span>Calculate yield first</span>
                <ArrowRight size={13} className="stroke-[1.5]" />
              </button>
            </div>

            {/* Search & Scale Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 stroke-[1.5]" />
                <input
                  type="text"
                  placeholder="Search by name, city, or waste type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-900 focus:border-forest-900 text-xs"
                />
              </div>

              {/* Scale Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-zinc-500 mr-1 flex items-center gap-1">
                  <Filter size={12} className="stroke-[1.5]" /> Scale:
                </span>
                {['all', 'small', 'medium', 'large'].map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setScaleFilter(scale)}
                    className={`capitalize text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${scaleFilter === scale
                        ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                  >
                    {scale === 'all' ? 'All scales' : scale}
                  </button>
                ))}
              </div>
            </div>

            {/* Plant Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {filteredPlants.map((plant) => (
                <div
                  key={plant.id}
                  className="p-4 rounded-xl border border-zinc-200/90 bg-white space-y-3 text-xs flex flex-col justify-between hover:border-zinc-300 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-zinc-900 text-sm">{plant.organisation}</h3>
                        <span className="text-[11px] text-zinc-500 capitalize block">
                          Scale: {plant.scale} · {plant.capacityMin}–{plant.capacityMax} {plant.capacityUnit}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 shrink-0">
                        {plant.serviceArea?.slice(0, 2).join(', ')}
                      </span>
                    </div>

                    <div className="space-y-1 text-zinc-700 pt-0.5">
                      <span className="text-zinc-500 block text-[11px]">Accepted waste:</span>
                      <div className="flex flex-wrap gap-1">
                        {plant.supportedFeedstock?.map((f) => (
                          <span
                            key={f}
                            className="bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded text-[11px] text-zinc-700"
                          >
                            {f.split('(')[0].trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-zinc-600 line-clamp-2 leading-relaxed text-xs">
                      {plant.omOffering}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-forest-900 font-medium text-xs">
                        <CheckCircle2 size={13} className="text-forest-800 stroke-[1.5]" /> Verified Facility
                      </span>
                      <span className="text-zinc-400 text-[11px]">·</span>
                      <span className="inline-flex items-center gap-1 text-zinc-600 font-medium text-xs">
                        <Clock size={12} className="text-zinc-400" /> 24h Response
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPlantDossier(plant)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-200 transition-colors cursor-pointer"
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => setTab('assessment')}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors cursor-pointer"
                      >
                        Request Quote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sent Requests & Status */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-medium text-zinc-900 flex items-center gap-2">
                  <Clock size={16} className="text-forest-900 stroke-[1.5]" />
                  Sent feedstock requests & status
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Track drop-off bookings and project connection enquiries forwarded to regional digesters.
                </p>
              </div>

              <span className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 self-start sm:self-auto">
                {enquiries.length} total requests
              </span>
            </div>

            {enquiries.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-2">
                <p className="text-xs text-zinc-500">
                  No feedstock requests sent yet. Complete the assessment wizard to connect with regional plants.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('assessment')}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Start assessment
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-4 rounded-xl border border-zinc-200/90 bg-white space-y-2.5 text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
                      <div>
                        <span className="font-medium text-zinc-900 text-sm block">
                          {enq.summary?.wasteType || 'Feedstock assessment'}
                        </span>
                        <span className="text-[11px] text-zinc-400">Reference: {enq.id}</span>
                      </div>
                      <StatusBadge status={enq.status === 'answered' ? 'verified' : 'pending'} size="sm" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-zinc-700">
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Estimated daily yield:</span>
                        <span className="text-zinc-900 font-medium">{enq.summary?.estimatedBiogasRange || 'Assessment required'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Contact preference:</span>
                        <span className="capitalize text-zinc-900">{enq.contactPreference || 'Email'}</span>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-zinc-100 text-zinc-600">
                      <span className="text-zinc-500 block text-[11px]">Unresolved questions:</span>
                      <p className="text-zinc-700 italic mt-0.5">"{enq.questions}"</p>
                    </div>

                    {/* Replies */}
                    {enq.replies && enq.replies.length > 0 && (
                      <div className="pt-2 border-t border-zinc-100 space-y-1.5">
                        <span className="font-medium text-forest-900 block text-[11px]">
                          Replies from plant provider:
                        </span>
                        {enq.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-900 space-y-0.5"
                          >
                            <div className="flex items-center justify-between text-[10px] text-zinc-500">
                              <span>{reply.authorName || 'Plant representative'}</span>
                              <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-zinc-800">{reply.message || reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[11px] text-zinc-400 flex justify-between pt-1">
                      <span>Submitted on {new Date(enq.createdAt).toLocaleDateString()}</span>
                      <span>Target: {enq.toPlantIds?.length || 1} plant(s)</span>
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
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-base font-medium text-zinc-900 flex items-center gap-2">
                <Leaf size={16} className="text-forest-900 stroke-[1.5]" />
                Environmental impact & diversion potential
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Calculated sustainability outcomes when your organic waste is diverted from landfill to anaerobic digestion.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
                <span className="text-[11px] font-medium text-forest-900 block">Circularity</span>
                <span className="text-lg font-medium text-zinc-900 block tabular-nums">100% diverted</span>
                <p className="text-zinc-600 text-xs leading-relaxed">Zero organic waste to landfill; transformed into biological soil conditioner.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
                <span className="text-[11px] font-medium text-forest-900 block">Climate action</span>
                <span className="text-lg font-medium text-zinc-900 block tabular-nums">~35 kg CO₂e / 100kg</span>
                <p className="text-zinc-600 text-xs leading-relaxed">Avoided fugitive methane emissions compared to open disposal.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
                <span className="text-[11px] font-medium text-forest-900 block">Clean energy</span>
                <span className="text-lg font-medium text-zinc-900 block tabular-nums">~10–14 m³ gas</span>
                <p className="text-zinc-600 text-xs leading-relaxed">Displaces fossil LPG cylinders or grid electricity for heating.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
            <div className="border-b border-zinc-100 pb-3">
              <h3 className="text-base font-medium text-zinc-900 flex items-center gap-2">
                <BookOpen size={16} className="text-forest-900 stroke-[1.5]" />
                Published anaerobic digestion research benchmarks
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Authoritative reference yield rates used to generate indicative output ranges without marketing bias.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assumptions.map((item) => (
                <div
                  key={item.wasteType}
                  className="p-3.5 rounded-lg border border-zinc-200/80 bg-zinc-50 space-y-1.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-zinc-900 text-xs">{item.wasteType}</h4>
                    <span className="text-xs font-medium text-forest-900 bg-white px-2 py-0.5 rounded border border-zinc-200 shrink-0">
                      {item.yieldMin} – {item.yieldMax} {item.unit.split('/')[0].trim()}
                    </span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed text-xs">{item.caveat}</p>
                  <div className="pt-1.5 border-t border-zinc-200/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
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
        enquiryButtonLabel="Book feedstock drop-off slot"
        onSendEnquiry={(p) => {
          setSelectedPlantDossier(null);
          setTab('assessment');
        }}
      />
    </div>
  );
}

export default WasteDashboard;
