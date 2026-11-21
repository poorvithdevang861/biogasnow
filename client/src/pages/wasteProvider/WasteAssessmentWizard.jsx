import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Leaf,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  Send,
  Scale,
  Calendar,
  Truck,
  RotateCcw,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../../api/client';
import { useProfile } from '../../context/ProfileContext';
import { StatusBadge } from '../../components/StatusBadge';
import { EvidencePanel } from '../../components/EvidencePanel';
import { RangeBar } from '../../components/RangeBar';
import { tabContentVariants, buttonTapMotion } from '../../utils/motion';

const STEPS = [
  { id: 1, title: 'What is needed' },
  { id: 2, title: 'Feedstock' },
  { id: 3, title: 'Quantity' },
  { id: 4, title: 'Site Constraints' },
  { id: 5, title: 'Results & Evidence' },
  { id: 6, title: 'Matched Plants' },
  { id: 7, title: 'Review & Enquiry' },
];

export function WasteAssessmentWizard({ onComplete, onCancel, onViewEnquiries }) {
  const shouldReduceMotion = useReducedMotion();
  const { activeProfile } = useProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [matchedPlants, setMatchedPlants] = useState([]);
  const [selectedPlantIds, setSelectedPlantIds] = useState([]);
  const [enquirySuccess, setEnquirySuccess] = useState(null);

  // Form State with "not sure" support on every field
  const [formData, setFormData] = useState({
    wasteType: 'Food waste (commercial kitchen)',
    wasteTypeNotSure: false,
    quantityKg: '150',
    quantityNotSure: false,
    frequency: 'Daily collection',
    frequencyNotSure: false,
    location: activeProfile.location || 'Indiranagar, Bengaluru',
    siteConstraints: 'Rear service lane access only; 48-hour bin storage capacity',
    siteConstraintsNotSure: false,
    intendedUse: 'Displace commercial kitchen cooking gas',
    questions: 'Can a containerized digester be serviced from a service lane, or is off-site daily transport necessary?',
    contactPreference: 'Email with technical feasibility summary',
  });

  // Pre-fill sample datasets
  const loadPreset = (presetType) => {
    if (presetType === 'restaurant') {
      setFormData({
        wasteType: 'Food waste (commercial kitchen)',
        wasteTypeNotSure: false,
        quantityKg: '150',
        quantityNotSure: false,
        frequency: 'Daily collection',
        frequencyNotSure: false,
        location: 'Indiranagar, Bengaluru',
        siteConstraints: 'Rear service lane access only; 48-hour bin storage capacity',
        siteConstraintsNotSure: false,
        intendedUse: 'Displace commercial kitchen cooking gas',
        questions: 'Can a containerized digester be serviced from a service lane, or is off-site daily transport necessary?',
        contactPreference: 'Email with technical feasibility summary',
      });
    } else if (presetType === 'uncertain') {
      setFormData({
        wasteType: 'not sure',
        wasteTypeNotSure: true,
        quantityKg: '',
        quantityNotSure: true,
        frequency: 'not sure',
        frequencyNotSure: true,
        location: activeProfile.location || 'Shivajinagar, Pune',
        siteConstraints: 'not sure',
        siteConstraintsNotSure: true,
        intendedUse: 'not sure',
        questions: 'We have variable kitchen scraps and need an on-site waste characterization audit.',
        contactPreference: 'Phone callback to discuss measurement',
      });
    }
  };

  // Run assessment via API
  const handleCalculate = async () => {
    setLoading(true);
    try {
      const payload = {
        wasteType: formData.wasteTypeNotSure ? 'not sure' : formData.wasteType,
        quantityKg: formData.quantityNotSure ? null : formData.quantityKg,
        quantityUncertain: formData.quantityNotSure,
        frequency: formData.frequencyNotSure ? 'not sure' : formData.frequency,
        location: formData.location,
        siteConstraints: formData.siteConstraintsNotSure ? 'not sure' : formData.siteConstraints,
      };

      const [assessRes, matchRes] = await Promise.all([
        api.post('/waste/assess', payload),
        api.post('/waste/match', {
          wasteType: payload.wasteType,
          location: payload.location,
          quantityKg: payload.quantityKg,
        }),
      ]);

      setAssessmentResult(assessRes);
      setMatchedPlants(matchRes.matches || []);
      // Auto-select the first 1-2 top matching plants
      if (matchRes.matches && matchRes.matches.length > 0) {
        setSelectedPlantIds([matchRes.matches[0].id]);
      }
      setCurrentStep(5);
    } catch (err) {
      console.error('Assessment failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle plant selection for enquiry
  const togglePlantSelect = (plantId) => {
    if (selectedPlantIds.includes(plantId)) {
      setSelectedPlantIds(selectedPlantIds.filter((id) => id !== plantId));
    } else {
      setSelectedPlantIds([...selectedPlantIds, plantId]);
    }
  };

  // Submit simulated enquiry
  const handleSubmitEnquiry = async () => {
    setLoading(true);
    try {
      const summaryPayload = {
        role: 'waste_provider',
        wasteType: formData.wasteTypeNotSure ? 'Not sure / Assessment required' : formData.wasteType,
        quantityRange: formData.quantityNotSure ? 'Assessment required' : `${formData.quantityKg} kg/day (${formData.frequency})`,
        frequency: formData.frequencyNotSure ? 'Not sure' : formData.frequency,
        location: formData.location,
        estimatedBiogasRange: assessmentResult?.dailyBiogas
          ? `${assessmentResult.dailyBiogas.min} – ${assessmentResult.dailyBiogas.max} m³/day`
          : 'Assessment required',
        siteConstraints: formData.siteConstraintsNotSure ? 'Not sure' : formData.siteConstraints,
      };

      const res = await api.post('/enquiries', {
        fromProfile: activeProfile.id,
        fromName: activeProfile.name,
        toPlantIds: selectedPlantIds,
        summary: summaryPayload,
        questions: formData.questions,
        contactPreference: formData.contactPreference,
      });

      setEnquirySuccess(res.data);
    } catch (err) {
      console.error('Enquiry submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 4) {
      handleCalculate();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-6 sm:p-8 space-y-7 w-full text-zinc-900 dark:text-zinc-100">
      {/* Top Header & Preset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            Feedstock Decision Journey
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Organic Feedstock Assessment & Matching
          </h2>
        </div>

        {/* Quick Preload Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">Pre-fill test data:</span>
          <button
            type="button"
            onClick={() => loadPreset('restaurant')}
            className="text-xs px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 font-medium transition-colors"
          >
            Restaurant (150 kg/day)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('uncertain')}
            className="text-xs px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-medium transition-colors"
          >
            "Not sure" Stream
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
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Confirmation View after Enquiry Submission */}
      {enquirySuccess ? (
        <div className="space-y-6 text-center py-6">
          <CheckCircle2 size={42} className="text-emerald-600 dark:text-emerald-400 mx-auto stroke-[2.2]" aria-hidden="true" />

          <div className="space-y-2 max-w-md mx-auto">
            <StatusBadge status="verified" label="Simulated Enquiry Recorded" size="md" />
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Enquiry Forwarded to Plant Inbox</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Your structured project summary has been registered in the demo data store under reference ID{' '}
              <strong className="font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded">{enquirySuccess.id}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-left max-w-md mx-auto text-xs space-y-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-200 block">Forwarded to Selected Providers:</span>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              {matchedPlants
                .filter((p) => selectedPlantIds.includes(p.id))
                .map((p) => (
                  <li key={p.id} className="flex items-center gap-1.5">
                    <Building2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
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
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors shadow-xs"
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
              Start Another Assessment
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
          {/* STEP 1: What is needed explainer */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">What information is needed to assess biogas potential?</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Anaerobic digestion relies on organic matter purity and physical consistency. Here is what we collect:
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">Step 01</span>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Feedstock Type</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Pre-consumer prep scraps, plate waste, spent grains, or slurries have different volatile solids and gas yields.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">Step 02</span>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Mass & Rhythm</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Kilograms per day or standard wheelie bin counts. Consistent feeding prevents biological shock to the bacteria.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">Step 03</span>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Site Space & Access</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Tanker road access, outdoor footprint for containerized modules, and physical bin staging space.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <HelpCircle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold block mb-0.5 text-amber-950 dark:text-amber-100">Don't have exact metrics?</span>
                  Every screen has an <strong>"I'm not sure"</strong> option. The platform will flag missing metrics as "Assessment required" and explain the necessary survey steps instead of guessing.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Feedstock Type */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">What type of organic waste do you produce?</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Select the primary organic stream generated on site.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                {[
                  {
                    title: 'Food waste (commercial kitchen)',
                    sub: 'Commercial kitchen prep, cooked leftovers, high energy content.',
                    category: 'High Energy (80–120 m³/t)',
                  },
                  {
                    title: 'Mixed organic & vegetable scraps',
                    sub: 'Greengrocer scrap, peelings, lower fats, high moisture.',
                    category: 'Medium Moisture (45–70 m³/t)',
                  },
                  {
                    title: 'Brewery spent grain & trub',
                    sub: 'Spent barley/malt, high protein, prone to rapid acidification.',
                    category: 'High Protein (90–140 m³/t)',
                  },
                  {
                    title: 'Agricultural slurry & manure',
                    sub: 'Farm slurry or manure. High liquid buffering, lower gas yield.',
                    category: 'Liquid Base (20–35 m³/t)',
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setFormData({ ...formData, wasteType: item.title, wasteTypeNotSure: false })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      !formData.wasteTypeNotSure && formData.wasteType === item.title
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/40 text-emerald-900 dark:text-emerald-100'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.title}</span>
                      <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-zinc-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">{item.sub}</p>
                  </button>
                ))}
              </div>

              {/* Not Sure Toggle */}
              <div className="p-4 rounded-xl border border-dashed border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/20 flex items-center justify-between gap-4">
                <div className="text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 block">I am not sure of the exact waste classification</span>
                  <span className="text-zinc-600 dark:text-zinc-400">Our stream is mixed, uncharacterized, or seasonal.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, wasteTypeNotSure: !formData.wasteTypeNotSure })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    formData.wasteTypeNotSure
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  {formData.wasteTypeNotSure ? 'Selected: Not sure' : "I'm not sure"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Quantity & Frequency */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">How much organic waste is generated?</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Provide an estimated daily kilogram weight or pick a typical container preset.
                </p>
              </div>

              {!formData.quantityNotSure && (
                <div className="space-y-4 p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="quantity-input" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">
                      Estimated Daily Weight (kg/day)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-zinc-500">Presets:</span>
                      {[
                        { label: '1x 120L Bin (~50kg)', kg: '50' },
                        { label: '3x 120L Bins (~150kg)', kg: '150' },
                        { label: '1 Tonne Skid (~1000kg)', kg: '1000' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, quantityKg: preset.kg })}
                          className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="quantity-input"
                      type="number"
                      min="1"
                      max="20000"
                      value={formData.quantityKg}
                      onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
                      className="w-36 text-lg font-bold px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">kg per day (fresh weight)</span>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide block">
                      Collection / Generation Frequency
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Daily collection', '3x per week', 'Weekly batch', 'Seasonal harvest'].map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setFormData({ ...formData, frequency: freq, frequencyNotSure: false })}
                          className={`text-xs py-2 px-2.5 rounded-lg border font-medium text-center transition-colors ${
                            formData.frequency === freq && !formData.frequencyNotSure
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Not Sure Toggle */}
              <div className="p-4 rounded-xl border border-dashed border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/20 flex items-center justify-between gap-4">
                <div className="text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 block">I am not sure of our exact kilograms</span>
                  <span className="text-zinc-600 dark:text-zinc-400">We do not currently weigh our waste containers.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, quantityNotSure: !formData.quantityNotSure })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    formData.quantityNotSure
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  {formData.quantityNotSure ? 'Selected: Not sure' : "I'm not sure"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Site Constraints */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Physical Site Layout & Location</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Where is the feedstock located, and are there physical access restrictions?
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="location-input" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide block">
                    Location / Postal District
                  </label>
                  <input
                    id="location-input"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Bengaluru Central, Pune, Vadodara"
                  />
                </div>

                {!formData.siteConstraintsNotSure && (
                  <div className="space-y-1.5">
                    <label htmlFor="constraints-input" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide block">
                      Physical Access & Footprint Notes
                    </label>
                    <textarea
                      id="constraints-input"
                      rows="3"
                      value={formData.siteConstraints}
                      onChange={(e) => setFormData({ ...formData, siteConstraints: e.target.value })}
                      className="w-full text-sm p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. Rear alleyway only, no heavy truck turnaround, ground space for 2 bins"
                    />
                  </div>
                )}

                {/* Not Sure Toggle */}
                <div className="p-4 rounded-xl border border-dashed border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/20 flex items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block">I am not sure of physical site constraints</span>
                    <span className="text-zinc-600 dark:text-zinc-400">A physical survey will be needed to verify footprints and gate widths.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, siteConstraintsNotSure: !formData.siteConstraintsNotSure })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      formData.siteConstraintsNotSure
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    {formData.siteConstraintsNotSure ? 'Selected: Not sure' : "I'm not sure"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Results & Evidence Panel */}
          {currentStep === 5 && assessmentResult && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {assessmentResult.status === 'assessment_required' ? (
                /* Assessment Required State */
                <div className="space-y-5">
                  <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-800/80 space-y-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status="notsure" label="Assessment Required" size="lg" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-amber-950 dark:text-amber-200">{assessmentResult.headline}</h3>
                      <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {assessmentResult.explanation}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-amber-200 dark:border-amber-800/60">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">Uncertain or Unspecified Metrics:</span>
                      <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                        {assessmentResult.uncertainFields?.map((field) => (
                          <li key={field} className="flex items-center gap-1.5">
                            <AlertCircle size={13} className="text-amber-600 dark:text-amber-400" />
                            <span>{field}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800/60 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Next Steps:</span>
                      <p>{assessmentResult.recommendation}</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    You can still proceed to view regional plant providers who conduct physical site audits and feedstock sampling in your area.
                  </p>
                </div>
              ) : (
                /* Valid Calculation Range Output */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Assessed Stream:</span>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{assessmentResult.wasteType}</h3>
                    </div>
                    <StatusBadge status="verified" label="Evidence-Based Range" size="sm" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Range Output Bars */}
                    <div className="space-y-4">
                      <RangeBar
                        min={assessmentResult.dailyBiogas.min}
                        max={assessmentResult.dailyBiogas.max}
                        unit={assessmentResult.dailyBiogas.unit}
                        label="Daily Biogas Production"
                        sublabel={`For ${assessmentResult.inputSummary.dailyKgRange} (${assessmentResult.inputSummary.frequency})`}
                        accentColor="emerald"
                      />

                      <RangeBar
                        min={assessmentResult.thermalEnergy.min}
                        max={assessmentResult.thermalEnergy.max}
                        unit={assessmentResult.thermalEnergy.unit}
                        label="Thermal Energy Displacement"
                        sublabel="Gross calorific equivalent for boiler or kitchen burner displacement"
                        accentColor="teal"
                      />
                    </div>

                    {/* Evidence Panel beside range */}
                    <div>
                      <EvidencePanel
                        assumptions={assessmentResult.assumptions}
                        title="WRAP / ADBA Research Benchmark"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Matched Plant Providers */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Matching Regional Plant Providers</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    Filtered by feedstock compatibility ({formData.wasteTypeNotSure ? 'Unclassified' : formData.wasteType}) and regional service area ({formData.location}).
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {matchedPlants.length} matches found
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {matchedPlants.map((plant) => {
                  const isSelected = selectedPlantIds.includes(plant.id);
                  return (
                    <div
                      key={plant.id}
                      onClick={() => togglePlantSelect(plant.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/40 text-emerald-950 dark:text-emerald-100'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{plant.organisation}</h4>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 capitalize">
                            Scale: {plant.scale} · {plant.capacityMin}–{plant.capacityMax} {plant.capacityUnit}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by div click
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 mt-1 cursor-pointer bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                        />
                      </div>

                      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {plant.matchReasons?.map((reason, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 size={12} className="shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-medium">
                            <ShieldCheck size={11} /> {plant.evidenceSummary.provided} verified
                          </span>
                          {plant.evidenceSummary.missing > 0 && (
                            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                              <AlertCircle size={11} /> {plant.evidenceSummary.missing} missing
                            </span>
                          )}
                        </div>
                        <span className="text-zinc-400 dark:text-zinc-500">
                          {isSelected ? 'Selected' : 'Click to select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedPlantIds.length === 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>Please select at least one plant provider to receive your enquiry.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Project Summary & Enquiry Review */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Review Project Summary</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Always review your specifications and assumptions before sending a simulated enquiry.
                </p>
              </div>

              {/* Review Summary Card */}
              <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span className="font-bold text-zinc-900 dark:text-zinc-200">Enquiry Summary</span>
                  <StatusBadge status="illustrative" size="sm" label="Simulated enquiry" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block">Sender Persona:</span>
                    <strong className="text-zinc-900 dark:text-zinc-200">{activeProfile.name}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block">Location:</span>
                    <strong className="text-zinc-900 dark:text-zinc-200">{formData.location}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block">Feedstock Type:</span>
                    <strong className="text-zinc-900 dark:text-zinc-200">{formData.wasteTypeNotSure ? 'Assessment Required' : formData.wasteType}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block">Daily Volume:</span>
                    <strong className="text-zinc-900 dark:text-zinc-200">
                      {formData.quantityNotSure ? 'Assessment Required' : `${formData.quantityKg} kg/day (${formData.frequency})`}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500 dark:text-zinc-400 block">Estimated Biogas Output:</span>
                  <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {assessmentResult?.dailyBiogas
                      ? `${assessmentResult.dailyBiogas.min} – ${assessmentResult.dailyBiogas.max} m³/day (${assessmentResult.thermalEnergy.min}–${assessmentResult.thermalEnergy.max} kWh/day thermal)`
                      : 'Assessment required (on-site audit required)'}
                  </strong>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500 dark:text-zinc-400 block">Selected Recipient Providers:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {matchedPlants
                      .filter((p) => selectedPlantIds.includes(p.id))
                      .map((p) => (
                        <span key={p.id} className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium">
                          {p.organisation}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {/* Questions & Contact Preference */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="questions-input" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide block">
                    Unresolved Questions & Site Specifics
                  </label>
                  <textarea
                    id="questions-input"
                    rows="3"
                    value={formData.questions}
                    onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter any questions regarding delivery access, container lease, or grid connection..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="pref-input" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide block">
                    Preferred Follow-Up Method
                  </label>
                  <input
                    id="pref-input"
                    type="text"
                    value={formData.contactPreference}
                    onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            onClick={currentStep === 1 ? onCancel : prevStep}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>{currentStep === 1 ? 'Cancel Assessment' : 'Back'}</span>
          </motion.button>

          <div className="flex items-center gap-3">
            {currentStep < 7 ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={nextStep}
                disabled={loading || (currentStep === 6 && selectedPlantIds.length === 0)}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                <span>{currentStep === 4 ? (loading ? 'Calculating...' : 'Calculate Indicative Range') : 'Continue'}</span>
                <ArrowRight size={15} />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSubmitEnquiry}
                disabled={loading || selectedPlantIds.length === 0}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                <Send size={15} />
                <span>{loading ? 'Submitting...' : 'Send Simulated Enquiry'}</span>
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WasteAssessmentWizard;