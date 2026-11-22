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
    title: 'Small (micro-digester)',
    capacity: '10 – 250 kg/day',
    biogasYield: '1 – 20 m³/day (~6 – 120 kWh/day)',
    suitableFor: 'Households, micro-bistros, community gardens, rural cottages.',
    equipment: 'Compact containerized vessel, flexible gas holder bag, mechanical macerator pump.',
    suitabilityQuestions: [
      'Do you have at least 10–15 m² of outdoor, well-ventilated ground space?',
      'Can you commit to daily sorting and feeding of organic scraps?',
    ],
    limitations: 'Gas yield drops 30%–50% in colder months without auxiliary heat insulation.',
    validationPrompt: 'Validate with provider: Verify frost protection and odorous digestate disposal logistics.',
  },
  {
    id: 'medium',
    title: 'Medium (commercial turnkey)',
    capacity: '50 – 1,000 kg/day',
    biogasYield: '5 – 80 m³/day (~30 – 480 kWh/day)',
    suitableFor: 'Hotels, dining halls, food processing plants, institutional campuses.',
    equipment: 'Insulated steel tank, internal hot water heating coil, gas scrubber, automated feeding hopper.',
    suitabilityQuestions: [
      'Is there dedicated vehicle access for feedstock delivery or digestate extraction?',
      'Do you have a consistent baseline thermal load (e.g. daily commercial kitchen cooking)?',
    ],
    limitations: 'Requires steady thermal energy off-take; unutilized gas must be safely flared or compressed.',
    validationPrompt: 'Validate with provider: Confirm local odor abatement permitting and flare backup.',
  },
  {
    id: 'large',
    title: 'Large (centralized / industrial CBG)',
    capacity: '500 – 10,000+ kg/day',
    biogasYield: '50 – 1,000+ m³/day (>300 kWh/day to MW)',
    suitableFor: 'Municipal waste networks, agro-industrial clusters, multi-farm cooperatives.',
    equipment: 'Multi-stage continuous stirred-tank reactors (CSTR), biomethane upgrading unit, grid-injection substation.',
    suitabilityQuestions: [
      'Do you have access to agricultural land banks for liquid biofertilizer spreading?',
      'Is high-voltage 3-phase grid infrastructure or gas grid pipeline present near the site?',
    ],
    limitations: 'Significant capital expenditure and strict environmental agency monitoring.',
    validationPrompt: 'Validate with provider: Review environmental permit requirements and grid interconnection queue.',
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
      {/* Overview Card */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-forest-900">
                Biogas consumer portal
              </span>
              <StatusBadge status="verified" size="sm" label="Active profile" />
            </div>
            <h1 className="text-xl sm:text-2xl font-medium text-zinc-900">
              Thermal energy & cooking fuel sizing
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              Daily gas requirement estimation, audited provider comparison, and proposal requests.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTab('sizing')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'sizing'
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                  : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              <Flame size={14} className="stroke-[1.5]" />
              <span>Explore biogas solutions</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
            <span className="text-[11px] text-zinc-500 block">
              Estimated energy demand
            </span>
            <span className="text-lg font-medium text-zinc-900 block tabular-nums">
              12 – 18 m³/day
            </span>
            <span className="text-[11px] text-zinc-500">Commercial cooking & heating</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
            <span className="text-[11px] text-zinc-500 block">
              Target plant scales
            </span>
            <span className="text-lg font-medium text-forest-900 block">
              Small & medium
            </span>
            <span className="text-[11px] text-zinc-500">Micro-skid or commercial turnkey</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
            <span className="text-[11px] text-zinc-500 block">
              Regional providers
            </span>
            <span className="text-lg font-medium text-zinc-900 block tabular-nums">
              {plants.length} providers
            </span>
            <span className="text-[11px] text-zinc-500">In your operational zone</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
            <span className="text-[11px] text-zinc-500 block">
              Active proposals
            </span>
            <span className="text-lg font-medium text-zinc-900 block tabular-nums">
              {enquiries.length} requests
            </span>
            <span className="text-[11px] text-zinc-500">Tracked in proposals</span>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-forest-900 shrink-0 stroke-[1.5]" />
            <span className="text-zinc-700">
              <span className="font-medium text-zinc-900">Next step: </span>
              Compare providers side-by-side to review verified commissioning documents and winter continuity terms.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setTab('compare')}
            className="text-xs font-medium text-forest-900 hover:text-forest-800 transition-colors cursor-pointer shrink-0"
          >
            Compare providers now →
          </button>
        </div>
      </div>

      {/* Tab 1: Sizing & Need Wizard */}
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

      {/* Tab 2: Compare Providers */}
      {activeTab === 'compare' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-medium text-zinc-900 flex items-center gap-2">
                  <Scale size={16} className="text-forest-900 stroke-[1.5]" />
                  Side-by-side provider comparison
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Select 2 to 3 providers to inspect capacities, warranties, and verified documents with missing files flagged.
                </p>
              </div>

              {/* Plant selector chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-zinc-500 mr-1">Select plants:</span>
                {plants.map((plant) => {
                  const isSelected = selectedPlantIdsToCompare.includes(plant.id);
                  return (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => togglePlantSelection(plant.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
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
              <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200/80 text-xs text-zinc-500">
                Please select at least 2 plant providers above to view side-by-side comparison.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Requests & Proposals */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-medium text-zinc-900 flex items-center gap-2">
                  <Clock size={16} className="text-forest-900 stroke-[1.5]" />
                  Sent offtake requests & proposal status
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Track project enquiries and formal proposals sent to regional biogas plant providers.
                </p>
              </div>

              <span className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 self-start sm:self-auto">
                {enquiries.length} total enquiries
              </span>
            </div>

            {enquiries.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-2">
                <p className="text-xs text-zinc-500">
                  No offtake connection enquiries sent yet. Complete the sizing wizard to submit a proposal request.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('sizing')}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Start sizing wizard
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
                          Offtake Enquiry for {enq.summary?.estimatedBiogasRange || 'Commercial Kitchen'}
                        </span>
                        <span className="text-[11px] text-zinc-400">Reference: {enq.id}</span>
                      </div>
                      <StatusBadge status={enq.status === 'answered' ? 'verified' : 'pending'} size="sm" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-zinc-700">
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Primary intended use:</span>
                        <span className="text-zinc-900 font-medium">{enq.summary?.intendedUse || 'Commercial cooking'}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Contact preference:</span>
                        <span className="capitalize text-zinc-900">{enq.contactPreference || 'Email'}</span>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-zinc-100 text-zinc-600">
                      <span className="text-zinc-500 block text-[11px]">Specific requirements noted:</span>
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
                              <span>{reply.authorName || 'Engineering representative'}</span>
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

      {/* Tab 4: Plant Scales Pathway Guide */}
      {activeTab === 'scales' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-base font-medium text-zinc-900 flex items-center gap-2">
                <Layers size={16} className="text-forest-900 stroke-[1.5]" />
                Plant scale sizing & technology pathways
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Understand the physical footprint, winter constraints, and equipment requirements across plant scales.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SCALES.map((scale) => (
                <div
                  key={scale.id}
                  className="p-4 rounded-xl border border-zinc-200/90 bg-white space-y-3 text-xs flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <div className="space-y-2">
                    <span className="font-medium text-zinc-900 text-sm block">{scale.title}</span>

                    <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-500">Capacity:</span>
                        <span className="font-medium text-zinc-900 tabular-nums">{scale.capacity}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-500">Biogas yield:</span>
                        <span className="font-medium text-forest-900 tabular-nums">{scale.biogasYield}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[11px]">Ideal application:</span>
                      <p className="text-zinc-700 leading-relaxed text-xs">{scale.suitableFor}</p>
                    </div>

                    <div className="pt-1.5 border-t border-zinc-100">
                      <span className="text-zinc-500 block text-[11px]">Typical equipment:</span>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">{scale.equipment}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
                      <span className="text-zinc-700 font-medium block text-[11px]">Winter continuity notice:</span>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">{scale.limitations}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setTab('sizing')}
                      className="w-full py-1.5 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium transition-colors cursor-pointer text-center"
                    >
                      Size for this scale
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <ProviderDetailModal
        isOpen={Boolean(selectedPlantDossier)}
        onClose={() => setSelectedPlantDossier(null)}
        plant={selectedPlantDossier}
        enquiryButtonLabel="Request offtake proposal"
        onSendEnquiry={(p) => {
          setSelectedPlantDossier(null);
          setTab('sizing');
        }}
      />
    </div>
  );
}

export default ConsumerDashboard;
