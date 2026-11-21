import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { useProfile } from '../../context/ProfileContext';
import { api } from '../../api/client';
import { ConsumerWizard } from './ConsumerWizard';
import { CompareTable } from '../../components/CompareTable';

const SCALES = [
  {
    id: 'small',
    title: 'Small (Micro-Digester)',
    capacity: '10 – 250 kg/day',
    biogasYield: '1 – 20 m³/day (~6 – 120 kWh/day)',
    suitableFor: 'Households, micro-bistros, community gardens, rural off-grid cottages.',
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
    suitableFor: 'Hotels, dining halls, food processing plants, care homes, urban farms.',
    equipment: 'Insulated steel tank, internal hot water heating coil, gas scrubber, automated feeding hopper.',
    suitabilityQuestions: [
      'Is there dedicated vehicle access for feedstock delivery or digestate extraction?',
      'Do you have a consistent baseline thermal load (e.g. daily commercial kitchen cooking or domestic hot water)?',
    ],
    limitations: 'Requires steady thermal energy off-take; unutilized gas must be safely flared or compressed.',
    validationPrompt: 'Validate with provider: Confirm local council odor abatement permitting and flare backup availability.',
  },
  {
    id: 'large',
    title: 'Large (Centralized / Industrial)',
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

  const [plants, setPlants] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [selectedPlantIdsToCompare, setSelectedPlantIdsToCompare] = useState(['plant-apex-1', 'plant-terra-3']);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      api.get(`/plants/compare?ids=${selectedPlantIdsToCompare.join(',')}`)
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
    <div className="space-y-6">
      {/* Tab 1: Need & Sizing Wizard */}
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
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Scale size={18} className="text-amber-400" />
                  Side-by-Side Provider Comparison
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select 2 to 3 providers to inspect capacities, warranties, and verified documents with missing evidence flagged.
                </p>
              </div>

              {/* Plant selection chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-zinc-400 mr-1">Select plants:</span>
                {plants.map((plant) => {
                  const isSelected = selectedPlantIdsToCompare.includes(plant.id);
                  return (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => togglePlantSelection(plant.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-600'
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
              <div className="p-8 text-center bg-zinc-950/50 rounded-xl border border-zinc-800 text-xs text-zinc-400">
                Please select at least 2 plant providers above to view side-by-side comparison.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Requests & Proposals */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Clock size={18} className="text-amber-400" />
                  Sent Offtake Requests & Proposal Status
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Track project enquiries sent to regional biogas plant providers.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 self-start sm:self-auto">
                {enquiries.length} total enquiries
              </span>
            </div>

            {enquiries.length === 0 ? (
              <div className="p-8 text-center bg-zinc-950/50 rounded-xl border border-zinc-800 space-y-3">
                <p className="text-xs text-zinc-400">
                  No offtake connection enquiries sent yet. Complete the wizard to submit a simulated enquiry.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('sizing')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-xl shadow-xs transition-colors"
                >
                  Start Offtake Sizing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
                      <div className="space-y-0.5">
                        <span className="font-bold text-zinc-100 text-sm block">
                          {enq.summary?.intendedUse || 'Biogas Offtake Enquiry'}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">Reference: {enq.id}</span>
                      </div>
                      <StatusBadge status={enq.status === 'answered' ? 'verified' : 'pending'} size="sm" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-zinc-300">
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Chosen Plant Scale:</span>
                        <strong className="text-zinc-200 capitalize">{enq.summary?.chosenScale || 'Assessment required'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Contact Preference:</span>
                        <span className="capitalize font-medium text-zinc-200">{enq.contactPreference || 'Email'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800">
                      <span className="text-zinc-500 block text-[11px]">Unresolved Questions:</span>
                      <p className="text-zinc-300 italic mt-0.5">"{enq.questions}"</p>
                    </div>

                    {/* Plant Provider Simulated Replies */}
                    {enq.replies && enq.replies.length > 0 && (
                      <div className="pt-3 border-t border-zinc-800 space-y-2">
                        <span className="font-bold text-amber-400 block text-[11px]">
                          Replies from Plant Provider:
                        </span>
                        {enq.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/60 text-amber-100 space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] text-amber-400 font-semibold">
                              <span>{reply.authorName || 'Engineering Representative'}</span>
                              <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-zinc-200">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[10px] text-zinc-500 flex justify-between pt-1">
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

      {/* Tab 4: Scale Guidance */}
      {activeTab === 'scales' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-800 shadow-sm space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Building2 size={18} className="text-amber-400" />
                Anaerobic Digestion Plant Scale Guidance
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Understand the physical footprint, expected yields, and operational limitations across scales without biased sales promises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SCALES.map((scale) => (
                <div
                  key={scale.id}
                  className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/50 flex flex-col justify-between space-y-4 text-xs"
                >
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
                      {scale.capacity}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-zinc-100">{scale.title}</h3>
                      <span className="text-xs font-semibold text-amber-400 block mt-0.5">
                        {scale.biogasYield}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-zinc-800 text-zinc-300 leading-relaxed">
                      <div>
                        <strong className="text-zinc-100 block mb-0.5">Typical Suitability:</strong>
                        <p>{scale.suitableFor}</p>
                      </div>

                      <div>
                        <strong className="text-zinc-100 block mb-0.5">Core Equipment:</strong>
                        <p>{scale.equipment}</p>
                      </div>

                      <div>
                        <strong className="text-zinc-100 block mb-0.5">Key Limitation:</strong>
                        <p className="text-rose-300 bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/60">
                          {scale.limitations}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-amber-800/60 text-[11px] text-amber-200 font-medium">
                    <HelpCircle size={13} className="text-amber-400 inline mr-1 -mt-0.5" />
                    {scale.validationPrompt}
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

export default ConsumerDashboard;
