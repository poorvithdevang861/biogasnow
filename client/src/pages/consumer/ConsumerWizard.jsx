import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Flame,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  Send,
  Scale,
  Calendar,
  Layers,
  RotateCcw,
  ShieldCheck,
  Clock,
  Eye,
  Check,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../api/client';
import { useProfile } from '../../context/ProfileContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { cardHoverMotion, buttonTapMotion, tabContentVariants } from '../../utils/motion';
import { CompareTable } from '../../components/CompareTable';

const STEPS = [
  { id: 1, title: 'Demand & Requirements' },
  { id: 2, title: 'Plant Scale Options' },
  { id: 3, title: 'Provider Discovery' },
  { id: 4, title: 'Side-by-Side Comparison' },
  { id: 5, title: 'Review & Enquiry' },
];

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
    title: 'Medium (Commercial / Turnkey)',
    capacity: '50 – 1,000 kg/day',
    biogasYield: '15 – 120 m³/day (~90 – 720 kWh/day)',
    suitableFor: 'Hotels, dining halls, food manufacturing units, commercial kitchens.',
    equipment: 'Continuous stirred-tank reactor (CSTR), insulated heated jacket, pressurized storage, automatic gas scrubber.',
    suitabilityQuestions: [
      'Do you have continuous hot water or kitchen cooking demand 365 days a year?',
      'Is there access for a commercial vehicle / delivery van to load feedstock?',
    ],
    limitations: 'Requires formal civil foundation pad and specialized biological maintenance oversight.',
    validationPrompt: 'Validate with site: Verify gas piping distance from digester to commercial kitchen appliances.',
  },
  {
    id: 'large',
    title: 'Large (Centralized / Farm-Fed)',
    capacity: '500 – 10,000+ kg/day',
    biogasYield: '100 – 1,200+ m³/day (~600 – 7,200 kWh/day)',
    suitableFor: 'Agricultural estates, multi-tenant industrial parks, district heating clusters.',
    equipment: 'Multi-stage heated concrete/steel digester, biomethane upgrading skid, grid-injection or CHP generator.',
    suitabilityQuestions: [
      'Are you connected to a district heating loop or micro-grid pipeline?',
      'Can you accommodate daily bulk agricultural or commercial deliveries?',
    ],
    limitations: 'High capital entry and statutory planning/permitting requirements.',
    validationPrompt: 'Validate with provider: Check local environmental agency permit boundaries and feedstock agreements.',
  },
];

export function ConsumerWizard({ onComplete, onCancel, onViewEnquiries }) {
  const shouldReduceMotion = useReducedMotion();
  const { activeProfile } = useProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allPlants, setAllPlants] = useState([]);
  const [selectedScale, setSelectedScale] = useState(null); // CRITICAL: NO DEFAULT SELECTION
  const [selectedPlantIdsToCompare, setSelectedPlantIdsToCompare] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [detailModalPlant, setDetailModalPlant] = useState(null);
  const [selectedPlantIdsForEnquiry, setSelectedPlantIdsForEnquiry] = useState([]);
  const [enquirySuccess, setEnquirySuccess] = useState(null);

  // Requirement Form State
  const [requirements, setRequirements] = useState({
    intendedUse: 'Cooking gas & domestic hot water',
    demandLevel: 'Medium (~4–8 m³/day)',
    siteFootprint: 'Private garden terrace (~25 m² outdoor space)',
    continuityNeed: 'Critical continuous supply (cannot tolerate complete winter outage)',
    location: activeProfile.location || 'Bristol East',
    unresolvedQuestions: 'What is the expected gas pressure drop in January? Is secondary LPG backup necessary?',
    contactPreference: 'Email with technical brochure and comparison notes',
  });

  // Load plants on mount
  useEffect(() => {
    api.get('/plants')
      .then((res) => {
        if (res?.data) {
          setAllPlants(res.data);
          // Set default comparison pair (e.g. Apex & Circular) once loaded
          if (res.data.length >= 2) {
            setSelectedPlantIdsToCompare([res.data[0].id, res.data[1].id]);
          }
        }
      })
      .catch((err) => console.error('Failed to load plants:', err));
  }, []);

  // Filter plants by scale if user chose one
  const filteredPlants = selectedScale
    ? allPlants.filter((p) => p.scale.toLowerCase() === selectedScale.toLowerCase())
    : allPlants;

  // Fetch comparison data when entering Step 4
  const fetchComparison = async (ids) => {
    setLoading(true);
    try {
      const res = await api.post('/plants/compare', { plantIds: ids });
      setComparisonData(res);
      // Auto-select the first provider for enquiry
      if (ids.length > 0) {
        setSelectedPlantIdsForEnquiry([ids[0]]);
      }
      setCurrentStep(4);
    } catch (err) {
      console.error('Comparison fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle plant in comparison list (max 3)
  const toggleComparePlant = (plantId) => {
    if (selectedPlantIdsToCompare.includes(plantId)) {
      setSelectedPlantIdsToCompare(selectedPlantIdsToCompare.filter((id) => id !== plantId));
    } else {
      if (selectedPlantIdsToCompare.length >= 3) return;
      setSelectedPlantIdsToCompare([...selectedPlantIdsToCompare, plantId]);
    }
  };

  // Toggle plant selection for enquiry
  const toggleEnquiryPlant = (plantId) => {
    if (selectedPlantIdsForEnquiry.includes(plantId)) {
      setSelectedPlantIdsForEnquiry(selectedPlantIdsForEnquiry.filter((id) => id !== plantId));
    } else {
      setSelectedPlantIdsForEnquiry([...selectedPlantIdsForEnquiry, plantId]);
    }
  };

  // Open provider detail modal with claims vs evidence breakdown
  const openDetailModal = async (plantId) => {
    setLoading(true);
    try {
      const res = await api.get(`/plants/${plantId}`);
      setDetailModalPlant(res.data);
    } catch (err) {
      console.error('Failed to fetch plant detail:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit simulated enquiry
  const handleSubmitEnquiry = async () => {
    setLoading(true);
    try {
      const summaryPayload = {
        role: 'consumer',
        intendedUse: requirements.intendedUse,
        expectedDemand: requirements.demandLevel,
        chosenScale: selectedScale ? selectedScale.toUpperCase() : 'FLEXIBLE / UNCONFIRMED',
        siteFootprint: requirements.siteFootprint,
        continuityNeed: requirements.continuityNeed,
        location: requirements.location,
      };

      const res = await api.post('/enquiries', {
        fromProfile: activeProfile.id,
        fromName: activeProfile.name,
        toPlantIds: selectedPlantIdsForEnquiry,
        summary: summaryPayload,
        questions: requirements.unresolvedQuestions,
        contactPreference: requirements.contactPreference,
      });

      setEnquirySuccess(res.data);
    } catch (err) {
      console.error('Enquiry submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill test scenarios
  const loadScenario = (type) => {
    if (type === 'household') {
      setRequirements({
        intendedUse: 'Cooking gas & space heating supplement',
        demandLevel: 'Low-Medium (~2–4 m³/day)',
        siteFootprint: 'Domestic rear garden (~25 m² space available)',
        continuityNeed: 'Flexible (can switch to electric induction during cold snaps)',
        location: 'Bristol East',
        unresolvedQuestions: 'Can a small containerized unit be sited within 5 meters of a residential boundary?',
        contactPreference: 'Email with installation specifications',
      });
      setSelectedScale('small');
    } else if (type === 'hotel') {
      setRequirements({
        intendedUse: 'Continuous boiler hot water and commercial kitchen cooking',
        demandLevel: 'High (~25–40 m³/day)',
        siteFootprint: 'Service yard and rear outbuilding (~150 m² space)',
        continuityNeed: 'Critical (hot water must be uninterrupted for guests)',
        location: 'Mendip District, Somerset',
        unresolvedQuestions: 'What is the telemetry response time if digester heating fails?',
        contactPreference: 'Phone call with senior mechanical engineer',
      });
      setSelectedScale('medium');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-6 sm:p-8 space-y-7 w-full text-zinc-900 dark:text-zinc-100">
      {/* Top Header & Preset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
            Consumer Offtake Journey
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Biogas Demand & Scale Discovery
          </h2>
        </div>

        {/* Quick Preload Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">Load scenario:</span>
          <button
            type="button"
            onClick={() => loadScenario('household')}
            className="text-xs px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 font-medium transition-colors"
          >
            Household (Cooking & Heat)
          </button>
          <button
            type="button"
            onClick={() => loadScenario('hotel')}
            className="text-xs px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-medium transition-colors"
          >
            Boutique Hotel (High Demand)
          </button>
        </div>
      </div>

      {/* Animated Step Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <span>Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-normal">Illustrative demo workflow</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={false}
            animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
            className="h-full bg-amber-500 rounded-full"
          />
        </div>
      </div>

      {/* Confirmation View after Enquiry Submission */}
      {enquirySuccess ? (
        <div className="space-y-6 text-center py-6">
          <CheckCircle2 size={42} className="text-emerald-600 dark:text-emerald-400 mx-auto stroke-[2.2]" aria-hidden="true" />

          <div className="space-y-2 max-w-md mx-auto">
            <StatusBadge status="verified" label="Consumer Enquiry Recorded" size="md" />
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Enquiry Forwarded to Plant Inbox</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Your offtake enquiry has been recorded in the demo store under reference ID{' '}
              <strong className="font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded">{enquirySuccess.id}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-left max-w-md mx-auto text-xs space-y-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-200 block">Recipients Selected from Comparison:</span>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              {allPlants
                .filter((p) => selectedPlantIdsForEnquiry.includes(p.id))
                .map((p) => (
                  <li key={p.id} className="flex items-center gap-1.5">
                    <Building2 size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{p.organisation} ({p.serviceArea.slice(0, 2).join(', ')})</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEnquirySuccess(null);
                setCurrentStep(1);
                if (onViewEnquiries) onViewEnquiries();
                else if (onComplete) onComplete();
              }}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              <span>View in Sent Enquiries</span>
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                setEnquirySuccess(null);
                setCurrentStep(1);
              }}
              className="px-4 py-2 text-xs sm:text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium transition-colors"
            >
              Start Another Discovery
            </button>
          </div>
        </div>
      ) : (
        /* Wizard Steps Container */
        <div className="space-y-6 min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={shouldReduceMotion ? undefined : tabContentVariants}
              initial={shouldReduceMotion ? false : 'initial'}
              animate={shouldReduceMotion ? false : 'animate'}
              exit={shouldReduceMotion ? false : 'exit'}
            >
          {/* STEP 1: Requirement Form */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Define Energy Demand & Site Conditions</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Clarify intended energy end-uses, expected volume, and supply continuity needs.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="intended-use" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide block">
                    Intended Biogas Application
                  </label>
                  <input
                    id="intended-use"
                    type="text"
                    value={requirements.intendedUse}
                    onChange={(e) => setRequirements({ ...requirements, intendedUse: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Commercial cooking, domestic space heating"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="demand-level" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide block">
                    Expected Daily Demand
                  </label>
                  <input
                    id="demand-level"
                    type="text"
                    value={requirements.demandLevel}
                    onChange={(e) => setRequirements({ ...requirements, demandLevel: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. 2–4 m³/day for domestic, 25–40 m³/day commercial"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="footprint-input" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide block">
                    Available Outdoor Site Footprint
                  </label>
                  <input
                    id="footprint-input"
                    type="text"
                    value={requirements.siteFootprint}
                    onChange={(e) => setRequirements({ ...requirements, siteFootprint: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. 25 m² outdoor yard, clear vehicular gate"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="continuity-input" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide block">
                    Supply Continuity & Winter Needs
                  </label>
                  <input
                    id="continuity-input"
                    type="text"
                    value={requirements.continuityNeed}
                    onChange={(e) => setRequirements({ ...requirements, continuityNeed: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Critical 24/7 or flexible with secondary fuel"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 space-y-1 leading-relaxed">
                <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">Note on Supply Continuity</span>
                <p>
                  Anaerobic bacteria slow their metabolism during cold winter weather. Small uninsulated systems can experience a 30%–50% drop in gas output unless paired with insulated heating jackets or secondary backup.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Scale Options Comparison (NO DEFAULT SELECTION) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Compare Digester Scale Options</h3>
                  <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                    No Default Selection
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Review suitability criteria, equipment profiles, and limitations. Select the scale best suited to your demand to filter providers.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {SCALES.map((scale) => {
                  const isSelected = selectedScale === scale.id;
                  return (
                    <div
                      key={scale.id}
                      onClick={() => setSelectedScale(scale.id)}
                      className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-500/40 text-amber-950 dark:text-amber-100'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            {scale.capacity}
                          </span>
                          {isSelected ? (
                            <Check size={18} className="text-amber-600 dark:text-amber-400 stroke-[2.5]" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700" />
                          )}
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{scale.title}</h4>
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block mt-0.5">
                            {scale.biogasYield}
                          </span>
                        </div>

                        <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/80 leading-relaxed">
                          <div>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">Suitable for:</span>
                            <p>{scale.suitableFor}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">Typical Equipment:</span>
                            <p>{scale.equipment}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">Limitations:</span>
                            <p className="text-zinc-500">{scale.limitations}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 font-medium">
                          {scale.validationPrompt}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Option to explore all without locking scale */}
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                <span>
                  {selectedScale
                    ? `Selected scale: ${selectedScale.toUpperCase()}`
                    : 'Please select a scale above to continue, or explore all providers.'}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedScale(null)}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 font-semibold underline transition-colors"
                >
                  Clear filter (Show all scales)
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Provider Discovery */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Discover Regional Plant Providers</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Showing providers active in {requirements.location} ({selectedScale ? `Scale: ${selectedScale}` : 'All scales'}). Select 2 or 3 providers to compare side-by-side.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {selectedPlantIdsToCompare.length} of 3 selected to compare
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {filteredPlants.map((plant) => {
                  const isChecked = selectedPlantIdsToCompare.includes(plant.id);
                  return (
                    <div
                      key={plant.id}
                      className={`p-5 rounded-xl border transition-all space-y-3 ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-500/40 text-amber-950 dark:text-amber-100'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{plant.organisation}</h4>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                            Scale: {plant.scale} · {plant.capacityMin}–{plant.capacityMax} {plant.capacityUnit}
                          </span>
                        </div>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleComparePlant(plant.id)}
                            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                          />
                          <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Compare</span>
                        </label>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {plant.omOffering}
                      </p>

                      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                            <ShieldCheck size={12} /> {plant.evidenceSummary.provided} verified
                          </span>
                          {plant.evidenceSummary.missing > 0 && (
                            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                              <AlertCircle size={12} /> {plant.evidenceSummary.missing} missing
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => openDetailModal(plant.id)}
                          className="text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye size={12} />
                          <span>Claims & Evidence</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedPlantIdsToCompare.length < 2 && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>Please check at least 2 providers above to view side-by-side comparison.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Side-by-Side Compare */}
          {currentStep === 4 && comparisonData && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Side-by-Side Comparison</h3>
                  <StatusBadge status="illustrative" size="sm" label="Evidence comparison" />
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Notice how unverified claims are explicitly highlighted as "Not provided / Not verified".
                </p>
              </div>

              <CompareTable
                plants={comparisonData.plants}
                selectedForEnquiry={selectedPlantIdsForEnquiry}
                onToggleSelect={toggleEnquiryPlant}
                onRemove={(id) => {
                  const updated = selectedPlantIdsToCompare.filter((pId) => pId !== id);
                  if (updated.length >= 2) {
                    setSelectedPlantIdsToCompare(updated);
                    fetchComparison(updated);
                  }
                }}
              />

              {selectedPlantIdsForEnquiry.length === 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Select at least 1 provider from the table header to proceed to enquiry.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Enquiry Summary & Request */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Review Offtake Enquiry Summary</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Always inspect your specifications before submitting your simulated enquiry.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span className="font-bold text-zinc-900 dark:text-zinc-200">Offtake Summary</span>
                  <StatusBadge status="illustrative" size="sm" label="Simulated request" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block">Consumer Persona:</span>
                    <strong className="text-zinc-900 dark:text-zinc-200">{activeProfile.name}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block">Location:</span>
                    <strong className="text-zinc-900 dark:text-zinc-200">{requirements.location}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block">Intended End-Use:</span>
                    <strong className="text-zinc-900 dark:text-zinc-200">{requirements.intendedUse}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block">Demand Volume:</span>
                    <strong className="text-zinc-900 dark:text-zinc-200">{requirements.demandLevel}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500 dark:text-zinc-400 block">Continuity & Storage Preference:</span>
                  <strong className="text-zinc-700 dark:text-zinc-300">{requirements.continuityNeed}</strong>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500 dark:text-zinc-400 block">Selected Recipient Providers:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {allPlants
                      .filter((p) => selectedPlantIdsForEnquiry.includes(p.id))
                      .map((p) => (
                        <span key={p.id} className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium">
                          {p.organisation}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {/* Free-text Unresolved Questions */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="unresolved-q" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide block">
                    Unresolved Technical Questions (Free Text)
                  </label>
                  <textarea
                    id="unresolved-q"
                    rows="3"
                    value={requirements.unresolvedQuestions}
                    onChange={(e) => setRequirements({ ...requirements, unresolvedQuestions: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter any questions regarding winter gas output, auxiliary heating, or digestate handling..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="pref-method" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide block">
                    Preferred Follow-Up Contact Method
                  </label>
                  <input
                    id="pref-method"
                    type="text"
                    value={requirements.contactPreference}
                    onChange={(e) => setRequirements({ ...requirements, contactPreference: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Navigation Buttons Footer */}
      {!enquirySuccess && (
        <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-5">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={currentStep === 1 ? onCancel : () => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </motion.button>

          <div className="flex items-center gap-3">
            {currentStep === 3 ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => fetchComparison(selectedPlantIdsToCompare)}
                disabled={loading || selectedPlantIdsToCompare.length < 2}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Comparing...' : `Compare ${selectedPlantIdsToCompare.length} Providers`}</span>
                <ArrowRight size={15} />
              </motion.button>
            ) : currentStep < 5 ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 5))}
                disabled={currentStep === 4 && selectedPlantIdsForEnquiry.length === 0}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Continue</span>
                <ArrowRight size={15} />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSubmitEnquiry}
                disabled={loading || selectedPlantIdsForEnquiry.length === 0}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                <Send size={15} />
                <span>{loading ? 'Submitting...' : 'Send Simulated Enquiry'}</span>
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Provider Detail Modal: Separating Claims from Evidence */}
      <Modal
        isOpen={Boolean(detailModalPlant)}
        onClose={() => setDetailModalPlant(null)}
        title={detailModalPlant?.organisation}
        subtitle={detailModalPlant ? `Scale: ${detailModalPlant.scale} · Service Area: ${detailModalPlant.serviceArea?.join(', ')}` : ''}
      >
        {detailModalPlant && (
          <div className="space-y-6 text-xs text-zinc-900 dark:text-zinc-100">
            {/* SEPARATING CLAIMS FROM EVIDENCE */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Box 1: Stated Commercial Claims */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-200 font-bold border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                  <FileText size={14} className="text-zinc-500 dark:text-zinc-400 stroke-[2]" />
                  <span>Stated Commercial Claims</span>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400 block">O&M Offering:</span>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">{detailModalPlant.claims?.statedOmOffering}</p>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400 block">Stated Warranty:</span>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">{detailModalPlant.claims?.statedWarranty}</p>
                </div>
              </div>

              {/* Box 2: Independent Evidence & Proof */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold border-b border-emerald-200 dark:border-emerald-900/60 pb-1.5">
                  <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 stroke-[2]" />
                  <span>Documented Evidence</span>
                </div>
                <div className="space-y-1.5">
                  {detailModalPlant.evidence?.map((ev) => (
                    <div key={ev.id} className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-1.5">
                      <div className="min-w-0">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-200 block truncate">{ev.title}</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{ev.source}</span>
                      </div>
                      <StatusBadge status={ev.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Operational Responsibilities */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <span className="font-bold text-zinc-900 dark:text-zinc-200 block">Operational Responsibilities</span>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-300 block mb-1">Your Daily Duties (Customer):</span>
                  <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                    {detailModalPlant.responsibilities?.customerDuties.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-300 block mb-1">Provider Servicing Duties:</span>
                  <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                    {detailModalPlant.responsibilities?.providerDuties.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Supply Continuity & Winter Information */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-2 text-amber-900 dark:text-amber-200">
              <span className="font-bold block flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 stroke-[2]" />
                Supply Continuity & Winter Information
              </span>
              <p><strong>Storage buffer:</strong> {detailModalPlant.supplyContinuity?.storageBufferHours}</p>
              <p><strong>Winter drop:</strong> {detailModalPlant.supplyContinuity?.winterPerformance}</p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300/90 italic">{detailModalPlant.supplyContinuity?.backupRecommendation}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setDetailModalPlant(null)}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Provider View
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ConsumerWizard;