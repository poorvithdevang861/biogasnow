import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Flame,
  Scale,
  Clock,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Check,
  Search,
  Filter,
  CheckCircle2,
  Layers,
  Wrench,
  AlertTriangle,
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { useProfile } from '../../context/ProfileContext';
import { api } from '../../api/client';
import { ConsumerWizard } from './ConsumerWizard';
import { CompareTable } from '../../components/CompareTable';
import { ProviderDetailModal } from '../../components/ProviderDetailModal';

const SCALES = [
  {
    id: 'small',
    title: 'Small (Micro-Digester)',
    capacity: '10 – 250 kg/day',
    biogasYield: '1 – 20 m³/day (~6 – 120 kWh/day)',
    suitableFor: 'Households, micro-bistros, community gardens, rural cottages.',
    equipment: 'Compact containerized vessel, flexible gas holder bag, mechanical macerator pump.',
    suitabilityQuestions: [
      'Do you have at least 10–15 m² of outdoor, well-ventilated ground space?',
      'Can you commit to daily sorting and feeding of organic scraps?',
    ],
    limitations: 'High sensitivity to winter temperatures; gas yield drops 30%–50% in cold snaps without auxiliary heat.',
    validationPrompt: 'Validate with provider: Verify frost protection and odorous digestate disposal logistics.',
  },
  {
    id: 'medium',
    title: 'Medium (Commercial Turnkey)',
    capacity: '50 – 1,000 kg/day',
    biogasYield: '5 – 80 m³/day (~30 – 480 kWh/day)',
    suitableFor: 'Hotels, dining halls, food processing plants, institutional campuses.',
    equipment: 'Insulated steel tank, internal hot water heating coil, gas scrubber, automated feeding hopper.',
    suitabilityQuestions: [
      'Is there dedicated vehicle access for feedstock delivery or digestate extraction?',
      'Do you have a consistent baseline thermal load (e.g. daily commercial kitchen cooking or domestic hot water)?',
    ],
    limitations: 'Requires steady thermal energy off-take; unutilized gas must be safely flared or compressed.',
    validationPrompt: 'Validate with provider: Confirm local municipal odor abatement permitting and flare backup availability.',
  },
  {
    id: 'large',
    title: 'Large (Centralized / Industrial CBG)',
    capacity: '500 – 10,000+ kg/day',
    biogasYield: '50 – 1,000+ m³/day (>300 kWh/day to MW)',
    suitableFor: 'Municipal waste networks, agro-industrial clusters, multi-farm cooperatives.',
    equipment: 'Multi-stage continuous stirred-tank reactors (CSTR), biomethane upgrading unit, grid-injection substation.',
    suitabilityQuestions: [
      'Do you have access to agricultural land banks for liquid biofertilizer spreading?',
      'Is high-voltage 3-phase grid infrastructure or gas grid pipeline present near the site?',
    ],
    limitations: 'Significant capital expenditure, lengthy planning permissions, strict environmental agency monitoring.',
    validationPrompt: 'Validate with provider: Review environmental permit requirements and gas grid interconnection queue.',
  },
];

export function ConsumerDashboard() {
  const { activeProfile } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'sizing';
  const shouldReduceMotion = useReducedMotion();

  const [plants, setPlants] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [selectedPlantIdsToCompare, setSelectedPlantIdsToCompare] = useState(['plant-apex-1', 'plant-terra-3']);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detail Modal State
  const [selectedPlantDossier, setSelectedPlantDossier] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get('/plants').catch(() => ({ data: [] })),
      api.get(`/enquiries?fromProfile=${activeProfile.id}`).catch(() => ({ data: [] })),
    ])
      .then(([plantsRes, enqRes]) => {
        const fetchedPlants = plantsRes?.data || [];
        setPlants(fetchedPlants);
        setEnquiries(enqRes?.data || []);

        if (fetchedPlants.length >= 2 && selectedPlantIdsToCompare.length === 0) {
          setSelectedPlantIdsToCompare([fetchedPlants[0].id, fetchedPlants[1].id]);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [activeProfile.id]);

  useEffect(() => {
    if (selectedPlantIdsToCompare.length >= 2) {
      api
        .get(`/plants/compare?ids=${selectedPlantIdsToCompare.join(',')}`)
        .then((res) => setComparisonData(res.data))
        .catch(() => setComparisonData(null));
    } else {
      setComparisonData(null);
    }
  }, [selectedPlantIdsToCompare]);

  const togglePlantSelection = (plantId) => {
    if (selectedPlantIdsToCompare.includes(plantId)) {
      if (selectedPlantIdsToCompare.length > 2) {
        setSelectedPlantIdsToCompare(selectedPlantIdsToCompare.filter((id) => id !== plantId));
      }
    } else {
      if (selectedPlantIdsToCompare.length < 3) {
        setSelectedPlantIdsToCompare([...selectedPlantIdsToCompare, plantId]);
      }
    }
  };

  const setTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ======================================================== */}
      {/* SCREEN 1: Consumer Dashboard Overview Card               */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 font-mono uppercase tracking-wider">
                Consumer Energy Portal
              </span>
              <StatusBadge status="verified" size="sm" label="Active Profile" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
              Welcome back, {activeProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              {activeProfile.location || 'Pune'} · Thermal energy and biogas demand sizing, provider comparison, and proposal dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setTab('sizing')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-subtle transition-colors cursor-pointer ${
                activeTab === 'sizing'
                  ? 'bg-amber-700 hover:bg-amber-600 text-white'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              <Flame size={14} className="stroke-[2.2]" />
              <span>Explore Biogas Solutions</span>
            </motion.button>
          </div>
        </div>

        {/* 4 Summary Metric Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Estimated Energy Demand
            </span>
            <span className="text-lg font-bold text-zinc-900 font-mono block">
              12 – 18 m³/day
            </span>
            <span className="text-[11px] text-zinc-500">Domestic cooking & thermal heating</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Target Plant Scales
            </span>
            <span className="text-lg font-bold text-amber-800 font-mono block">
              Small & Medium
            </span>
            <span className="text-[11px] text-zinc-500">Micro-skid or commercial turnkey</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Regional Providers
            </span>
            <span className="text-lg font-bold text-zinc-900 font-mono block">
              {plants.length} Providers
            </span>
            <span className="text-[11px] text-zinc-500">Operating in your service area</span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Enquiries & Proposals
            </span>
            <span className="text-lg font-bold text-zinc-900 font-mono block">
              {enquiries.length} Active
            </span>
            <span className="text-[11px] text-zinc-500">Proposals in My Proposals tab</span>
          </div>
        </div>

        {/* Recommended Action Card */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-amber-800 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold text-amber-950 block">Recommended Action:</span>
              <p className="text-zinc-600 text-[11px]">
                Compare providers side-by-side to review verified commissioning documents and winter continuity recommendations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setTab('compare')}
              className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              Compare Providers Now →
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Tab 1: Sizing & Need Wizard                              */}
      {/* ======================================================== */}
      {activeTab === 'sizing' && (
        <ConsumerWizard
          onCancel={() => setTab('compare')}
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
      {/* Tab 2: Compare Providers (Screens 5 & 6)                 */}
      {/* ======================================================== */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Scale size={18} className="text-amber-700" />
                  Side-by-Side Provider Comparison
                </h2>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Select 2 to 3 providers to inspect capacities, warranties, and verified documents with missing evidence flagged in red.
                </p>
              </div>

              {/* Plant selector chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-zinc-500 mr-1">Select plants:</span>
                {plants.map((plant) => {
                  const isSelected = selectedPlantIdsToCompare.includes(plant.id);
                  return (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => togglePlantSelection(plant.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-700 text-white border-amber-600 shadow-subtle'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                      }`}
                    >
                      {plant.organisation.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comparison Table */}
            {comparisonData && comparisonData.plants ? (
              <CompareTable
                plants={comparisonData.plants}
                selectedForEnquiry={selectedPlantIdsToCompare}
                onRemove={(id) => {
                  if (selectedPlantIdsToCompare.length > 2) {
                    setSelectedPlantIdsToCompare(selectedPlantIdsToCompare.filter((pid) => pid !== id));
                  }
                }}
              />
            ) : (
              <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-500">
                Please select at least 2 plant providers above to view side-by-side comparison.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Tab 3: Requests & Proposals (Screen 9 My Enquiries)      */}
      {/* ======================================================== */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Clock size={18} className="text-amber-700" />
                  Sent Offtake Requests & Proposal Status
                </h2>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Track project enquiries and formal proposals sent to regional biogas plant providers.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 self-start sm:self-auto">
                {enquiries.length} total enquiries
              </span>
            </div>

            {enquiries.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                <p className="text-xs text-zinc-500">
                  No offtake connection enquiries sent yet. Complete the sizing wizard to submit a proposal request.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('sizing')}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-medium text-xs rounded-xl shadow-subtle transition-colors cursor-pointer"
                >
                  Start Offtake Sizing
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
                          {enq.summary?.intendedUse || 'Biogas Offtake Enquiry'}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">Reference: {enq.id}</span>
                      </div>
                      <StatusBadge status={enq.status === 'answered' ? 'verified' : 'pending'} size="sm" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-zinc-700">
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Demand Level:</span>
                        <strong className="text-zinc-900">{enq.summary?.demandLevel || 'Moderate domestic cooking'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Continuity Need:</span>
                        <span className="font-medium text-zinc-900">{enq.summary?.continuityNeed || 'Continuous hot water'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200">
                      <span className="text-zinc-500 block text-[11px]">Questions & Constraints:</span>
                      <p className="text-zinc-700 italic mt-0.5">"{enq.questions}"</p>
                    </div>

                    {/* Replies from Providers */}
                    {enq.replies && enq.replies.length > 0 && (
                      <div className="pt-3 border-t border-zinc-200 space-y-2">
                        <span className="font-bold text-amber-800 block text-[11px]">
                          Replies from Plant Provider:
                        </span>
                        {enq.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] text-amber-800 font-semibold">
                              <span>{reply.authorName || 'Provider Engineering Representative'}</span>
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
      {/* Tab 4: Plant Scales (Screen 4 Plant Scale Exploration)   */}
      {/* ======================================================== */}
      {activeTab === 'scales' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Layers size={18} className="text-amber-700" />
                Anaerobic Digester Scale Pathways
              </h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                Understand the physical differences, ground space, biological sensitivities, and maintenance obligations between small, medium, and large digesters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SCALES.map((scale) => (
                <div
                  key={scale.id}
                  className="p-5 rounded-2xl bg-zinc-50/70 border border-zinc-200 flex flex-col justify-between space-y-4 text-xs"
                >
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider font-mono">
                        Scale Pathway
                      </span>
                      <h3 className="text-sm font-bold text-zinc-900">{scale.title}</h3>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-zinc-200 space-y-1 font-mono">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-500">Feedstock Capacity:</span>
                        <strong className="text-zinc-800">{scale.capacity}</strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-500">Expected Yield:</span>
                        <strong className="text-amber-800">{scale.biogasYield}</strong>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-zinc-800 block text-[11px]">Typical Applications:</span>
                      <p className="text-zinc-600 leading-relaxed text-[11px]">{scale.suitableFor}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-zinc-800 block text-[11px]">Key Equipment:</span>
                      <p className="text-zinc-600 leading-relaxed text-[11px]">{scale.equipment}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1 text-[11px]">
                      <span className="font-bold flex items-center gap-1 text-amber-900">
                        <AlertTriangle size={12} className="shrink-0" /> Biological Sensitivity:
                      </span>
                      <p className="leading-snug">{scale.limitations}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200">
                    <button
                      type="button"
                      onClick={() => setTab('sizing')}
                      className="w-full py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-subtle transition-colors cursor-pointer"
                    >
                      Assess Sizing for this Scale
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Provider Dossier & Evidence Modal */}
      <ProviderDetailModal
        isOpen={Boolean(selectedPlantDossier)}
        onClose={() => setSelectedPlantDossier(null)}
        plant={selectedPlantDossier}
        enquiryButtonLabel="Request Offtake Proposal"
        onSendEnquiry={(p) => {
          setSelectedPlantDossier(null);
          setTab('sizing');
        }}
      />
    </div>
  );
}

export default ConsumerDashboard;
