import React, { useState } from 'react';
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
  Calendar,
  Layers,
  RotateCcw,
  ShieldCheck,
  Clock,
  Sparkles,
  IndianRupee,
  Utensils,
  Droplets,
  Truck,
  MapPin,
} from 'lucide-react';
import { api } from '../../api/client';
import { useProfile } from '../../context/ProfileContext';
import { StatusBadge } from '../../components/StatusBadge';
import { CylinderDisplay, CylinderIcon } from '../../components/CylinderIcon';
import { tabContentVariants, buttonTapMotion } from '../../utils/motion';

const STEPS = [
  { id: 1, title: 'Feedstock Type' },
  { id: 2, title: 'Daily Volume' },
  { id: 3, title: 'Location & Site' },
  { id: 4, title: 'Fuel & Cost Savings' },
  { id: 5, title: 'Matched Digesters' },
  { id: 6, title: 'Review & Request' },
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

  // Form State
  const [formData, setFormData] = useState({
    wasteType: 'Food waste (commercial kitchen)',
    wasteTypeNotSure: false,
    quantityKg: '150',
    quantityNotSure: false,
    frequency: 'Daily collection',
    frequencyNotSure: false,
    location: activeProfile.location || 'Indiranagar, Bengaluru',
    siteConstraints: 'Rear service lane access; ground space for 2 bins',
    siteConstraintsNotSure: false,
    intendedUse: 'Displace commercial kitchen cooking gas',
    questions: 'We need daily bin collection or an on-site digester survey.',
    contactPreference: 'Email with quotation and collection schedule',
  });

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
      if (matchRes.matches && matchRes.matches.length > 0) {
        setSelectedPlantIds([matchRes.matches[0].id]);
      }
      setCurrentStep(4);
    } catch (err) {
      console.error('Assessment failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePlantSelect = (plantId) => {
    if (selectedPlantIds.includes(plantId)) {
      setSelectedPlantIds(selectedPlantIds.filter((id) => id !== plantId));
    } else {
      setSelectedPlantIds([...selectedPlantIds, plantId]);
    }
  };

  const handleSubmitEnquiry = async () => {
    setLoading(true);
    try {
      const summaryPayload = {
        role: 'waste_provider',
        wasteType: formData.wasteTypeNotSure ? 'Not sure / Mixed stream' : formData.wasteType,
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
    if (currentStep === 3) {
      handleCalculate();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Derive visual cylinder metrics from assessmentResult or fallback to daily waste calculation
  const dailyKg = Number(formData.quantityKg) || 150;
  const computedCylinders = assessmentResult?.lpgDisplacement?.max
    ? Math.max(1, Math.round((assessmentResult.lpgDisplacement.max * 30) / 19))
    : Math.max(1, Math.round((dailyKg * 0.12 * 30 * 0.45) / 19));
  const computedSavings = (computedCylinders * 1850).toLocaleString('en-IN');
  const computedGasM3 = assessmentResult?.dailyBiogas?.max
    ? assessmentResult.dailyBiogas.max
    : (dailyKg * 0.12).toFixed(1);
  const burnerHours = (computedGasM3 / 2.6).toFixed(1);
  const mealsCooked = Math.round(dailyKg * 3.5);
  const compostKg = Math.round(dailyKg * 0.2);

  return (
    <div className="bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-5 sm:p-6 space-y-6 w-full text-zinc-900 font-sans">
      {/* Top Header & Fast Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
            Feedstock Calculator
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 mt-1">
            Waste Assessment & Fuel Sizing
          </h2>
        </div>

        {/* Quick Fill Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-zinc-500 mr-1">Load sample:</span>
          <button
            type="button"
            onClick={() => {
              setFormData({
                wasteType: 'Food waste (commercial kitchen)',
                wasteTypeNotSure: false,
                quantityKg: '150',
                quantityNotSure: false,
                frequency: 'Daily collection',
                frequencyNotSure: false,
                location: 'Indiranagar, Bengaluru',
                siteConstraints: 'Rear service lane access; ground space for 2 bins',
                siteConstraintsNotSure: false,
                intendedUse: 'Displace commercial kitchen cooking gas',
                questions: 'We need daily bin collection or an on-site digester survey.',
                contactPreference: 'Email with quotation and collection schedule',
              });
            }}
            className="text-xs px-2.5 py-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors cursor-pointer"
          >
            Restaurant (150 kg)
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                wasteType: 'Mixed organic & vegetable scraps',
                wasteTypeNotSure: false,
                quantityKg: '400',
                quantityNotSure: false,
                frequency: 'Daily collection',
                frequencyNotSure: false,
                location: 'Shivajinagar, Pune',
                siteConstraints: 'Wide gate loading dock; continuous access',
                siteConstraintsNotSure: false,
                intendedUse: 'Replace boiler LPG fuel',
                questions: 'Can you provide containerized tanks with telemetry?',
                contactPreference: 'Phone callback with engineer',
              });
            }}
            className="text-xs px-2.5 py-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium transition-colors cursor-pointer"
          >
            Canteen (400 kg)
          </button>
        </div>
      </div>

      {/* Step Indicator Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-medium text-zinc-700">
          <span>
            Step {currentStep} of {STEPS.length}: <strong className="text-zinc-900">{STEPS[currentStep - 1].title}</strong>
          </span>
          <span className="text-zinc-400">Interactive Assessment</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            initial={false}
            animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
            className="h-full bg-forest-900 rounded-full"
          />
        </div>
      </div>

      {/* SUCCESS CONFIRMATION VIEW */}
      {enquirySuccess ? (
        <div className="space-y-6 text-center py-6">
          <div className="w-14 h-14 rounded-full bg-forest-50 border border-forest-200 flex items-center justify-center mx-auto text-forest-900">
            <CheckCircle2 size={32} className="stroke-[2.2]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-zinc-900">Request Sent to Plant Operators</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Your feedstock profile has been forwarded directly to the selected digester operator. Reference ID:{' '}
              <strong className="font-mono text-zinc-900 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">
                {enquirySuccess.id}
              </strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-left max-w-md mx-auto text-xs space-y-2">
            <span className="font-semibold text-zinc-900 block">Recipients Notified:</span>
            <ul className="space-y-1.5 text-zinc-600">
              {matchedPlants
                .filter((p) => selectedPlantIds.includes(p.id))
                .map((p) => (
                  <li key={p.id} className="flex items-center gap-1.5 font-medium text-zinc-800">
                    <Building2 size={13} className="text-forest-900 shrink-0" />
                    <span>{p.organisation} ({p.serviceArea?.slice(0, 2).join(', ')})</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEnquirySuccess(null);
                setCurrentStep(1);
                if (onViewEnquiries) onViewEnquiries();
                else if (onComplete) onComplete();
              }}
              className="inline-flex items-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <span>View in Sent Requests</span>
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                setEnquirySuccess(null);
                setCurrentStep(1);
              }}
              className="px-4 py-2 text-xs sm:text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors cursor-pointer"
            >
              Start New Assessment
            </button>
          </div>
        </div>
      ) : (
        /* WIZARD FORM STEPS */
        <div className="space-y-6 min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={shouldReduceMotion ? undefined : tabContentVariants}
              initial={shouldReduceMotion ? false : 'initial'}
              animate={shouldReduceMotion ? false : 'animate'}
              exit={shouldReduceMotion ? false : 'exit'}
            >
              {/* ======================================================== */}
              {/* STEP 1: Feedstock Selection                              */}
              {/* ======================================================== */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-zinc-900">
                      What type of organic waste do you produce?
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Select your primary organic waste stream to determine accurate gas yield rates.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      {
                        title: 'Food waste (commercial kitchen)',
                        desc: 'Kitchen prep, cooked leftovers, table scraps. High calorific yield.',
                        yieldLabel: 'High Yield: ~100 m³ / tonne',
                      },
                      {
                        title: 'Mixed organic & vegetable scraps',
                        desc: 'Greengrocer scrap, peelings, fruit pulp. High moisture content.',
                        yieldLabel: 'Standard Yield: ~60 m³ / tonne',
                      },
                      {
                        title: 'Brewery spent grain & trub',
                        desc: 'Spent barley/malt, brewery residues. High protein density.',
                        yieldLabel: 'High Protein: ~110 m³ / tonne',
                      },
                      {
                        title: 'Agricultural slurry & manure',
                        desc: 'Dairy or livestock manure. Excellent biological buffering.',
                        yieldLabel: 'Liquid Base: ~30 m³ / tonne',
                      },
                    ].map((item) => {
                      const isSelected = !formData.wasteTypeNotSure && formData.wasteType === item.title;
                      return (
                        <div
                          key={item.title}
                          onClick={() => setFormData({ ...formData, wasteType: item.title, wasteTypeNotSure: false })}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                            isSelected
                              ? 'border-forest-900 bg-forest-50/60 shadow-xs'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-zinc-900">{item.title}</span>
                            <span className="text-[10px] font-medium text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 shrink-0">
                              {item.yieldLabel}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 leading-relaxed">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Not sure toggle */}
                  <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-zinc-900 block">Mixed or variable waste stream?</span>
                      <span className="text-zinc-500">Select if you generate multiple unseparated organic types.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, wasteTypeNotSure: !formData.wasteTypeNotSure })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        formData.wasteTypeNotSure
                          ? 'bg-forest-900 text-white border-forest-900'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      {formData.wasteTypeNotSure ? 'Selected: Mixed stream' : "I'm not sure"}
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 2: Daily Mass & Frequency                           */}
              {/* ======================================================== */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-zinc-900">
                      How much organic waste is generated daily?
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Click a quick preset or type your estimated daily kilograms.
                    </p>
                  </div>

                  {!formData.quantityNotSure && (
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-4">
                      {/* Presets */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-700 block">
                          Typical commercial presets:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: 'Small Cafe (~50 kg)', kg: '50' },
                            { label: 'Restaurant (~150 kg)', kg: '150' },
                            { label: 'Dining Hall (~300 kg)', kg: '300' },
                            { label: 'Bulk Canteen (~500 kg)', kg: '500' },
                            { label: 'Commercial (~1000 kg)', kg: '1000' },
                          ].map((p) => {
                            const isSelected = formData.quantityKg === p.kg;
                            return (
                              <button
                                key={p.kg}
                                type="button"
                                onClick={() => setFormData({ ...formData, quantityKg: p.kg })}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                                  isSelected
                                    ? 'bg-forest-900 text-white border-forest-900 shadow-xs'
                                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                                }`}
                              >
                                {p.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Input Field */}
                      <div className="space-y-1.5 pt-1">
                        <label htmlFor="quantity-input" className="text-xs font-medium text-zinc-700 block">
                          Weight in kilograms:
                        </label>
                        <div className="relative max-w-xs">
                          <input
                            id="quantity-input"
                            type="number"
                            min="10"
                            max="10000"
                            value={formData.quantityKg}
                            onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
                            className="w-full text-base font-semibold px-3 py-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500">
                            kg / day
                          </span>
                        </div>
                      </div>

                      {/* Collection Rhythm */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-xs font-medium text-zinc-700 block">
                          Collection or feeding rhythm:
                        </label>
                        <div className="flex gap-2">
                          {['Daily collection', 'Alternate days', 'Weekly pickup'].map((freq) => (
                            <button
                              key={freq}
                              type="button"
                              onClick={() => setFormData({ ...formData, frequency: freq })}
                              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                                formData.frequency === freq
                                  ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                              }`}
                            >
                              {freq}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Not sure toggle */}
                  <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-zinc-900 block">Unsure of exact daily kilograms?</span>
                      <span className="text-zinc-500">We will arrange an on-site scrap characterization survey.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, quantityNotSure: !formData.quantityNotSure })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        formData.quantityNotSure
                          ? 'bg-forest-900 text-white border-forest-900'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      {formData.quantityNotSure ? 'Selected: Needs survey' : "I'm not sure"}
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 3: Location & Site Constraints                      */}
              {/* ======================================================== */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-zinc-900">
                      Where is your kitchen or site located?
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Used to match digesters with active service routes in your neighborhood.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="location-input" className="text-xs font-medium text-zinc-700 block">
                        City / Neighborhood / Postal Area
                      </label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          id="location-input"
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                          placeholder="e.g. Indiranagar, Bengaluru or Kothrud, Pune"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="constraints-input" className="text-xs font-medium text-zinc-700 block">
                        Vehicle access & storage space:
                      </label>
                      <input
                        id="constraints-input"
                        type="text"
                        value={formData.siteConstraints}
                        onChange={(e) => setFormData({ ...formData, siteConstraints: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                        placeholder="e.g. Rear service lane access; ground space for 2 bins"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 4: RESULTS WITH VISUAL CYLINDERS (PRACTICAL!)       */}
              {/* ======================================================== */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-forest-900 uppercase tracking-wider">
                      Assessment Outcome
                    </span>
                    <h3 className="text-lg font-semibold text-zinc-900">
                      Calculated Fuel & Monthly Savings
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Based on {formData.quantityNotSure ? 'baseline benchmark' : `${formData.quantityKg} kg/day`} of {formData.wasteType}.
                    </p>
                  </div>

                  {/* FEATURED VISUAL: LPG CYLINDERS SAVED */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50/80 to-orange-50/40 border border-amber-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/70 pb-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-950 block">
                          Commercial LPG Cylinders Replaced
                        </span>
                        <span className="text-xs text-amber-800">
                          Displaces 19 kg commercial gas cylinders every month
                        </span>
                      </div>
                      <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-forest-900 text-white font-semibold text-xs shadow-xs">
                        ₹{computedSavings} / month fuel saved
                      </div>
                    </div>

                    {/* PHYSICAL CYLINDERS DISPLAY */}
                    <div className="py-2">
                      <CylinderDisplay count={computedCylinders} size={32} showLabel={false} />
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-amber-950 tabular-nums">
                        {computedCylinders}
                      </span>
                      <span className="text-xs font-medium text-amber-900">
                        commercial 19 kg cylinders displaced per month
                      </span>
                    </div>
                  </div>

                  {/* 3 Practical Metric Cards with Icons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Metric 1: Clean Cooking Gas */}
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/90 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                        <Flame size={15} className="text-forest-800 stroke-[2]" />
                        <span>Biogas Output</span>
                      </div>
                      <span className="text-2xl font-bold text-zinc-900 block tabular-nums">
                        {computedGasM3} <span className="text-xs font-normal text-zinc-500">m³ / day</span>
                      </span>
                      <span className="text-[11px] text-zinc-500 block">
                        ~{burnerHours} continuous cooking burner hours
                      </span>
                    </div>

                    {/* Metric 2: Hot Meals Cooked */}
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/90 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                        <Utensils size={15} className="text-forest-800 stroke-[2]" />
                        <span>Hot Meals Cooked</span>
                      </div>
                      <span className="text-2xl font-bold text-zinc-900 block tabular-nums">
                        {mealsCooked}
                      </span>
                      <span className="text-[11px] text-zinc-500 block">
                        meals cooked daily on clean blue flame
                      </span>
                    </div>

                    {/* Metric 3: Organic Fertilizer */}
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/90 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                        <Droplets size={15} className="text-forest-800 stroke-[2]" />
                        <span>Bio-Fertilizer</span>
                      </div>
                      <span className="text-2xl font-bold text-zinc-900 block tabular-nums">
                        {compostKg} <span className="text-xs font-normal text-zinc-500">kg / day</span>
                      </span>
                      <span className="text-[11px] text-zinc-500 block">
                        nutrient-rich soil replenishment
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 5: Matched Digester Operators (NO EVIDENCE JARGON)  */}
              {/* ======================================================== */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-zinc-900">
                        Matching Local Digester Operators
                      </h3>
                      <p className="text-xs text-zinc-600">
                        Operators accepting {formData.wasteType} in {formData.location}.
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-900 border border-forest-200">
                      {matchedPlants.length} nearby operators
                    </span>
                  </div>

                  <div className="space-y-3">
                    {matchedPlants.map((plant) => {
                      const isSelected = selectedPlantIds.includes(plant.id);
                      return (
                        <div
                          key={plant.id}
                          onClick={() => togglePlantSelect(plant.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-forest-900 bg-forest-50/50 shadow-xs'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-zinc-900 text-sm">
                                {plant.organisation}
                              </h4>
                              <span className="text-[11px] font-medium bg-forest-100/70 text-forest-900 px-2 py-0.5 rounded border border-forest-200">
                                Verified Operator
                              </span>
                            </div>
                            <p className="text-xs text-zinc-600 leading-relaxed max-w-lg">
                              Capacity: {plant.capacityMin}–{plant.capacityMax} {plant.capacityUnit} · Service: {plant.serviceArea?.slice(0, 3).join(', ')}
                            </p>
                            <span className="text-[11px] text-zinc-500 block">
                              Terms: {plant.omOffering}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              className={`text-xs px-3.5 py-1.5 rounded-lg font-medium border transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-forest-900 text-white border-forest-900'
                                  : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 6: Review & Send Request                            */}
              {/* ======================================================== */}
              {currentStep === 6 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-zinc-900">
                      Confirm & Send Collection Request
                    </h3>
                    <p className="text-xs text-zinc-600">
                      Review your feedstock profile before sending to the selected operators.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-zinc-200/80 pb-3">
                      <div>
                        <span className="text-[11px] text-zinc-500 block">Waste stream:</span>
                        <span className="font-semibold text-zinc-900">{formData.wasteType}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-500 block">Daily mass:</span>
                        <span className="font-semibold text-zinc-900">{formData.quantityKg} kg / day</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-500 block">Location:</span>
                        <span className="font-semibold text-zinc-900">{formData.location}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-500 block">LPG displaced:</span>
                        <span className="font-semibold text-forest-900">~{computedCylinders} cylinders / mo</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="questions-input" className="text-xs font-medium text-zinc-700 block">
                        Specific questions or logistics notes:
                      </label>
                      <textarea
                        id="questions-input"
                        rows="2"
                        value={formData.questions}
                        onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                        placeholder="e.g. Can you supply 120L sealable bins? What is the pickup timing?"
                      />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label htmlFor="contact-pref" className="text-xs font-medium text-zinc-700 block">
                        Preferred contact method:
                      </label>
                      <input
                        id="contact-pref"
                        type="text"
                        value={formData.contactPreference}
                        onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                        placeholder="e.g. Email with quote or WhatsApp call"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* FOOTER BUTTONS: Navigation */}
      {!enquirySuccess && (
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 text-xs">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-medium transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep === STEPS.length ? (
              <button
                type="button"
                disabled={loading || selectedPlantIds.length === 0}
                onClick={handleSubmitEnquiry}
                className="inline-flex items-center gap-1.5 bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Send size={13} />
                <span>{loading ? 'Sending Request...' : 'Send Request to Operators'}</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={nextStep}
                className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <span>{currentStep === 3 ? 'Calculate Fuel Output' : 'Next Step'}</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WasteAssessmentWizard;
