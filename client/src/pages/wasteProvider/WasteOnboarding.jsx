import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Flame,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Send,
  Sparkles,
  MapPin,
  Utensils,
  Droplets,
  Clock,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { api } from '../../api/client';
import { useProfile } from '../../context/ProfileContext';
import { CylinderDisplay } from '../../components/CylinderIcon';
import { tabContentVariants } from '../../utils/motion';

const STEPS = [
  { id: 1, title: 'Waste Type' },
  { id: 2, title: 'Daily Volume' },
  { id: 3, title: 'Location' },
  { id: 4, title: 'Fuel Savings' },
  { id: 5, title: 'Nearby Digesters' },
  { id: 6, title: 'Schedule Pickup' },
];

export function WasteOnboarding() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { activeProfile } = useProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [matchedPlants, setMatchedPlants] = useState([]);
  const [selectedPlantIds, setSelectedPlantIds] = useState([]);
  const [enquirySuccess, setEnquirySuccess] = useState(null);
  const [sentEnquiries, setSentEnquiries] = useState([]);
  const [showSentRequests, setShowSentRequests] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    wasteType: 'Kitchen food scraps (cooked food, prep peels)',
    quantityKg: '150',
    frequency: 'Daily collection',
    location: activeProfile?.location || 'Indiranagar, Bengaluru',
    siteNotes: 'Rear service lane; space for 2 bins',
    contactEmail: 'contact@greenfork.in',
    contactPhone: '+91 98450 12345',
    questions: 'We need daily bin collection or an on-site digester survey.',
  });

  // Load sent requests on mount
  useEffect(() => {
    if (activeProfile?.id) {
      api.get(`/enquiries?fromProfile=${activeProfile.id}`)
        .then((res) => setSentEnquiries(res?.data || []))
        .catch(() => {});
    }
  }, [activeProfile?.id]);

  // Handle calculation & matching
  const handleCalculate = async () => {
    setLoading(true);
    try {
      const payload = {
        wasteType: 'Food waste (commercial kitchen)',
        quantityKg: Number(formData.quantityKg) || 150,
        frequency: formData.frequency,
        location: formData.location,
        siteConstraints: formData.siteNotes,
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
        wasteType: formData.wasteType,
        quantityRange: `${formData.quantityKg} kg/day (${formData.frequency})`,
        frequency: formData.frequency,
        location: formData.location,
        estimatedBiogasRange: `~${computedGasM3} m³/day (~${computedCylinders} cylinders/mo)`,
        siteConstraints: formData.siteNotes,
      };

      const res = await api.post('/enquiries', {
        fromProfile: activeProfile?.id || 'waste-restaurant-1',
        fromName: activeProfile?.name || 'Commercial Kitchen',
        toPlantIds: selectedPlantIds,
        summary: summaryPayload,
        questions: `${formData.questions} · Contact: ${formData.contactPhone} / ${formData.contactEmail}`,
        contactPreference: 'Phone callback & Email',
      });

      setEnquirySuccess(res.data);
      if (res?.data) {
        setSentEnquiries((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      console.error('Submission failed:', err);
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

  // Tangible metrics
  const dailyKg = Number(formData.quantityKg) || 150;
  const computedCylinders = Math.max(1, Math.round((dailyKg * 0.12 * 30 * 0.45) / 19));
  const computedSavings = (computedCylinders * 1850).toLocaleString('en-IN');
  const computedGasM3 = (dailyKg * 0.12).toFixed(1);
  const burnerHours = (computedGasM3 / 2.6).toFixed(1);
  const mealsCooked = Math.round(dailyKg * 3.5);
  const compostKg = Math.round(dailyKg * 0.2);

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-zinc-900 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
            Waste Generator Onboarding
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 mt-1">
            Turn your daily food scraps into cooking fuel
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Log your daily scrap volume, see fuel savings, and schedule pickup with local digesters.
          </p>
        </div>

        {sentEnquiries.length > 0 && (
          <button
            type="button"
            onClick={() => setShowSentRequests(!showSentRequests)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors cursor-pointer"
          >
            <Clock size={13} className="text-zinc-500" />
            <span>My Requests ({sentEnquiries.length})</span>
            <ChevronDown size={13} className={`transition-transform ${showSentRequests ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Sent Requests Drawer */}
      {showSentRequests && (
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Submitted Requests
            </h3>
            <span className="text-xs text-zinc-500">{sentEnquiries.length} active requests</span>
          </div>
          <div className="space-y-2">
            {sentEnquiries.map((req) => (
              <div key={req.id} className="p-3 rounded-lg bg-white border border-zinc-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-zinc-900 block">{req.summary?.wasteType || 'Kitchen food waste'}</span>
                  <span className="text-[11px] text-zinc-500">
                    Ref: {req.id} · {req.summary?.quantityRange || '150 kg/day'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-forest-50 text-forest-900 border border-forest-200 font-medium text-[11px]">
                  {req.status === 'answered' ? 'Proposal Received' : 'Forwarded to Operator'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-zinc-700">
            Step {currentStep} of {STEPS.length}: <strong className="text-zinc-900">{STEPS[currentStep - 1].title}</strong>
          </span>
          <span className="text-xs text-zinc-400">Takes ~2 minutes</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-200/80 rounded-full overflow-hidden">
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
        <div className="bg-white rounded-xl border border-zinc-200 p-6 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-200 flex items-center justify-center mx-auto text-forest-900">
            <CheckCircle2 size={28} className="stroke-[2.2]" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-zinc-900">Pickup Request Sent!</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Your waste volume has been forwarded to the nearby digester operator. Reference ID:{' '}
              <strong className="font-mono text-zinc-900 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">
                {enquirySuccess.id}
              </strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-left max-w-md mx-auto text-xs space-y-2">
            <span className="font-semibold text-zinc-900 block">Notified Operator:</span>
            <ul className="space-y-1 text-zinc-600">
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

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEnquirySuccess(null);
                setShowSentRequests(true);
              }}
              className="bg-forest-900 hover:bg-forest-800 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              View in My Requests
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-zinc-600 hover:text-zinc-900 font-medium px-3 py-2 transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        /* WIZARD CONTAINER */
        <div className="bg-white rounded-xl border border-zinc-200/90 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6 min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={shouldReduceMotion ? undefined : tabContentVariants}
              initial={shouldReduceMotion ? false : 'initial'}
              animate={shouldReduceMotion ? false : 'animate'}
              exit={shouldReduceMotion ? false : 'exit'}
            >
              {/* ======================================================== */}
              {/* STEP 1: What type of organic waste do you have?          */}
              {/* ======================================================== */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-zinc-900">
                      What type of organic waste do you produce?
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Select your main waste stream. Clean food scraps yield the most cooking gas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        title: 'Kitchen food scraps',
                        sub: 'Cooked leftovers, curries, rice, plate scrapings, prep peelings.',
                        benefit: 'Highest cooking gas yield',
                      },
                      {
                        title: 'Market & vegetable peels',
                        sub: 'Raw vegetable trimmings, fruit pulp, greens from stalls.',
                        benefit: 'Clean daily fermentation',
                      },
                      {
                        title: 'Canteen & buffet leftovers',
                        sub: 'Large dining halls, hostels, corporate catering food discards.',
                        benefit: 'Rapid continuous breakdown',
                      },
                      {
                        title: 'Dairy & cattle manure',
                        sub: 'Farm cow dung or livestock slurry. Produces rich bio-slurry.',
                        benefit: 'Steady round-the-clock fuel',
                      },
                    ].map((item) => {
                      const isSelected = formData.wasteType.includes(item.title);
                      return (
                        <div
                          key={item.title}
                          onClick={() => setFormData({ ...formData, wasteType: `${item.title} (${item.sub.split(',')[0]})` })}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                            isSelected
                              ? 'border-forest-900 bg-forest-50/60 shadow-xs'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-zinc-900">{item.title}</span>
                            <span className="text-[10px] font-medium text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 shrink-0">
                              {item.benefit}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed">{item.sub}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 2: How much waste daily?                            */}
              {/* ======================================================== */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-zinc-900">
                      How much waste do you produce per day?
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Pick a typical bin count or enter your estimated kilograms.
                    </p>
                  </div>

                  {/* Bin Presets */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { kg: '50', label: 'Small Kitchen', bins: '1 standard bin' },
                      { kg: '150', label: 'Busy Restaurant', bins: '3 standard bins' },
                      { kg: '300', label: 'Dining Hall', bins: '6 bins / day' },
                      { kg: '500', label: 'Community / Hotel', bins: '10+ bins / day' },
                    ].map((p) => {
                      const isSelected = formData.quantityKg === p.kg;
                      return (
                        <div
                          key={p.kg}
                          onClick={() => setFormData({ ...formData, quantityKg: p.kg })}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer space-y-1 ${
                            isSelected
                              ? 'border-forest-900 bg-forest-900 text-white shadow-xs'
                              : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 text-zinc-800'
                          }`}
                        >
                          <span className="text-lg font-bold block tabular-nums">{p.kg} kg</span>
                          <span className={`text-[11px] block font-medium ${isSelected ? 'text-forest-100' : 'text-zinc-700'}`}>
                            {p.label}
                          </span>
                          <span className={`text-[10px] block ${isSelected ? 'text-forest-200' : 'text-zinc-500'}`}>
                            {p.bins}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Manual Input */}
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <label htmlFor="custom-kg" className="text-xs font-medium text-zinc-700 block">
                      Or type exact kilograms per day:
                    </label>
                    <div className="relative max-w-xs">
                      <input
                        id="custom-kg"
                        type="number"
                        min="10"
                        max="5000"
                        value={formData.quantityKg}
                        onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
                        className="w-full text-base font-semibold px-3 py-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-medium">
                        kg / day
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 3: Where is your kitchen / facility?                */}
              {/* ======================================================== */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-zinc-900">
                      Where is your location?
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Used to match digester operators running daily collection routes in your area.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label htmlFor="loc" className="text-xs font-medium text-zinc-700 block">
                        Neighborhood / City:
                      </label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          id="loc"
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                          placeholder="e.g. Indiranagar, Bengaluru or Kothrud, Pune"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="notes" className="text-xs font-medium text-zinc-700 block">
                        Access details:
                      </label>
                      <input
                        id="notes"
                        type="text"
                        value={formData.siteNotes}
                        onChange={(e) => setFormData({ ...formData, siteNotes: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                        placeholder="e.g. Rear service lane access; ground space for 2 bins"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 4: OUTPUT & SAVINGS (Visual, Tangible, Intuitive!)   */}
              {/* ======================================================== */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-forest-900 uppercase tracking-wider">
                      Your Daily Fuel Output
                    </span>
                    <h2 className="text-lg font-semibold text-zinc-900">
                      Here is what your {formData.quantityKg} kg daily waste produces
                    </h2>
                  </div>

                  {/* VISUAL COMMERCIAL CYLINDERS CARD */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50/80 to-orange-50/40 border border-amber-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/70 pb-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-950 block">
                          Commercial LPG Cylinders Replaced
                        </span>
                        <span className="text-xs text-amber-800">
                          Replaces standard 19 kg commercial gas cylinders every month
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
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                        <Flame size={15} className="text-forest-800 stroke-[2]" />
                        <span>Clean Cooking Flame</span>
                      </div>
                      <span className="text-xl font-bold text-zinc-900 block tabular-nums">
                        ~{burnerHours} <span className="text-xs font-normal text-zinc-500">burner hrs/day</span>
                      </span>
                      <span className="text-[11px] text-zinc-500 block">
                        Piped bio-methane gas
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                        <Utensils size={15} className="text-forest-800 stroke-[2]" />
                        <span>Hot Meals Cooked</span>
                      </div>
                      <span className="text-xl font-bold text-zinc-900 block tabular-nums">
                        {mealsCooked}
                      </span>
                      <span className="text-[11px] text-zinc-500 block">
                        meals cooked on clean flame
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                        <Droplets size={15} className="text-forest-800 stroke-[2]" />
                        <span>Organic Bio-Slurry</span>
                      </div>
                      <span className="text-xl font-bold text-zinc-900 block tabular-nums">
                        {compostKg} <span className="text-xs font-normal text-zinc-500">kg/day</span>
                      </span>
                      <span className="text-[11px] text-zinc-500 block">
                        Free soil fertilizer for gardens
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 5: Nearby Digester Operators                        */}
              {/* ======================================================== */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-zinc-900">
                        Nearby Digester Operators
                      </h2>
                      <p className="text-xs text-zinc-500">
                        Select which operators to request daily collection or on-site survey from.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                      {matchedPlants.length} operators active
                    </span>
                  </div>

                  <div className="space-y-2.5">
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
                              <span className="text-[11px] font-medium bg-forest-100 text-forest-900 px-2 py-0.5 rounded border border-forest-200">
                                Verified Operator
                              </span>
                            </div>
                            <span className="text-xs text-zinc-500 block">
                              Service Coverage: {plant.serviceArea?.slice(0, 3).join(', ')} · Daily Capacity: {plant.capacityMin}–{plant.capacityMax} {plant.capacityUnit}
                            </span>
                          </div>

                          <button
                            type="button"
                            className={`text-xs px-3.5 py-1.5 rounded-lg font-medium border transition-colors cursor-pointer shrink-0 ${
                              isSelected
                                ? 'bg-forest-900 text-white border-forest-900'
                                : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 6: Confirm Contact & Schedule                       */}
              {/* ======================================================== */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-zinc-900">
                      Schedule Collection or Site Visit
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Your request will be delivered directly to the selected plant operators.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-zinc-200 pb-3">
                      <div>
                        <span className="text-[11px] text-zinc-500 block">Daily Waste:</span>
                        <span className="font-semibold text-zinc-900">{formData.quantityKg} kg / day</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-500 block">LPG Saved:</span>
                        <span className="font-semibold text-forest-900">~{computedCylinders} cylinders / mo</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-500 block">Monthly Savings:</span>
                        <span className="font-semibold text-forest-900">₹{computedSavings} / mo</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label htmlFor="phone" className="text-xs font-medium text-zinc-700 block">
                          Phone Number:
                        </label>
                        <input
                          id="phone"
                          type="text"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="email" className="text-xs font-medium text-zinc-700 block">
                          Email Address:
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <label htmlFor="req-notes" className="text-xs font-medium text-zinc-700 block">
                        Logistics or site notes:
                      </label>
                      <input
                        id="req-notes"
                        type="text"
                        value={formData.questions}
                        onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
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
                  onClick={() => navigate('/')}
                  className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  Exit
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
                  <span>{currentStep === 3 ? 'Calculate Fuel Output' : 'Continue'}</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WasteOnboarding;
