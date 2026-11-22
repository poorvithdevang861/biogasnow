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
  Scale,
  Calendar,
  Clock,
  Eye,
  Check,
  ChevronDown,
} from 'lucide-react';
import { api } from '../../api/client';
import { useProfile } from '../../context/ProfileContext';
import { CylinderDisplay, CylinderIcon } from '../../components/CylinderIcon';
import { tabContentVariants } from '../../utils/motion';
import { CompareTable } from '../../components/CompareTable';

const STEPS = [
  { id: 1, title: 'Fuel Demand' },
  { id: 2, title: 'Plant Sizing' },
  { id: 3, title: 'Local Providers' },
  { id: 4, title: 'Compare Providers' },
  { id: 5, title: 'Request Survey' },
];

export function ConsumerOnboarding() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { activeProfile } = useProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allPlants, setAllPlants] = useState([]);
  const [selectedPlantIdsToCompare, setSelectedPlantIdsToCompare] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [selectedPlantIdsForEnquiry, setSelectedPlantIdsForEnquiry] = useState([]);
  const [enquirySuccess, setEnquirySuccess] = useState(null);
  const [sentEnquiries, setSentEnquiries] = useState([]);
  const [showSentRequests, setShowSentRequests] = useState(false);

  // Form State
  const [monthlyCylinders, setMonthlyCylinders] = useState(8);
  const [application, setApplication] = useState('Commercial kitchen cooking stoves');
  const [selectedScale, setSelectedScale] = useState('medium');
  const [location, setLocation] = useState(activeProfile?.location || 'Kothrud, Pune');
  const [siteSpace, setSiteSpace] = useState('Private yard / rooftop (~30 m²)');
  const [contactPhone, setContactPhone] = useState('+91 98220 54321');
  const [contactEmail, setContactEmail] = useState('canteen@punehospitality.in');

  // Load plants & sent enquiries
  useEffect(() => {
    api.get('/plants')
      .then((res) => {
        if (res?.data) {
          setAllPlants(res.data);
          if (res.data.length >= 2) {
            setSelectedPlantIdsToCompare([res.data[0].id, res.data[1].id]);
            setSelectedPlantIdsForEnquiry([res.data[0].id]);
          }
        }
      })
      .catch(() => {});

    if (activeProfile?.id) {
      api.get(`/enquiries?fromProfile=${activeProfile.id}`)
        .then((res) => setSentEnquiries(res?.data || []))
        .catch(() => {});
    }
  }, [activeProfile?.id]);

  // Comparison fetch
  const fetchComparison = async (ids) => {
    try {
      const res = await api.post('/plants/compare', { plantIds: ids });
      setComparisonData(res);
    } catch (err) {
      console.error('Comparison failed:', err);
    }
  };

  const nextStep = () => {
    if (currentStep === 3) {
      if (selectedPlantIdsToCompare.length >= 2) {
        fetchComparison(selectedPlantIdsToCompare);
      }
      setCurrentStep(4);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleCompareSelect = (id) => {
    if (selectedPlantIdsToCompare.includes(id)) {
      if (selectedPlantIdsToCompare.length > 2) {
        setSelectedPlantIdsToCompare(selectedPlantIdsToCompare.filter((pid) => pid !== id));
      }
    } else {
      if (selectedPlantIdsToCompare.length < 3) {
        setSelectedPlantIdsToCompare([...selectedPlantIdsToCompare, id]);
      }
    }
  };

  const toggleEnquirySelect = (id) => {
    if (selectedPlantIdsForEnquiry.includes(id)) {
      setSelectedPlantIdsForEnquiry(selectedPlantIdsForEnquiry.filter((pid) => pid !== id));
    } else {
      setSelectedPlantIdsForEnquiry([...selectedPlantIdsForEnquiry, id]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const summaryPayload = {
        role: 'consumer',
        application,
        monthlyCylinders: `${monthlyCylinders} commercial 19kg cylinders/month`,
        scale: selectedScale,
        location,
        siteSpace,
        fuelCostSavings: `₹${(monthlyCylinders * 1850).toLocaleString('en-IN')} / month`,
      };

      const res = await api.post('/enquiries', {
        fromProfile: activeProfile?.id || 'consumer-household-1',
        fromName: activeProfile?.name || 'Commercial Kitchen Offtake',
        toPlantIds: selectedPlantIdsForEnquiry.length > 0 ? selectedPlantIdsForEnquiry : selectedPlantIdsToCompare,
        summary: summaryPayload,
        questions: `Seeking site survey and proposal for replacing ${monthlyCylinders} commercial cylinders/month. Contact: ${contactPhone} / ${contactEmail}`,
        contactPreference: 'Phone callback & Site survey',
      });

      setEnquirySuccess(res.data);
      if (res?.data) {
        setSentEnquiries((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      console.error('Enquiry failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const monthlySavings = (monthlyCylinders * 1850).toLocaleString('en-IN');
  const requiredBiogasM3 = ((monthlyCylinders * 19) / 0.45 / 30).toFixed(1);

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-zinc-900 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900">
            Replace commercial LPG cylinders with clean biogas
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Size your cooking fuel demand, compare verified local plant providers, and request proposals.
          </p>
        </div>

        {sentEnquiries.length > 0 && (
          <button
            type="button"
            onClick={() => setShowSentRequests(!showSentRequests)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors cursor-pointer"
          >
            <Clock size={13} className="text-zinc-500" />
            <span>My Proposals ({sentEnquiries.length})</span>
            <ChevronDown size={13} className={`transition-transform ${showSentRequests ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Sent Requests Drawer */}
      {showSentRequests && (
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Submitted Survey Requests
            </h3>
            <span className="text-xs text-zinc-500">{sentEnquiries.length} active requests</span>
          </div>
          <div className="space-y-2">
            {sentEnquiries.map((req) => (
              <div key={req.id} className="p-3 rounded-lg bg-white border border-zinc-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-zinc-900 block">{req.summary?.application || 'Commercial cooking gas'}</span>
                  <span className="text-[11px] text-zinc-500">
                    Ref: {req.id} · Displacing {req.summary?.monthlyCylinders || '8 cylinders/mo'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-forest-50 text-forest-900 border border-forest-200 font-medium text-[11px]">
                  {req.status === 'answered' ? 'Proposal Ready' : 'Forwarded to Provider'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Progress Bar */}
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

      {/* SUCCESS CONFIRMATION */}
      {enquirySuccess ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-200 flex items-center justify-center mx-auto text-forest-900">
            <CheckCircle2 size={28} className="stroke-[2.2]" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-zinc-900">Survey Request Submitted!</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Your fuel demand profile has been forwarded to the chosen plant provider. Reference ID:{' '}
              <strong className="font-mono text-zinc-900 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">
                {enquirySuccess.id}
              </strong>
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEnquirySuccess(null);
                setShowSentRequests(true);
              }}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              View in My Proposals
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
              {/* STEP 1: Current LPG Cylinder Consumption                 */}
              {/* ======================================================== */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-zinc-900">
                      How many commercial LPG cylinders do you use per month?
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Click your typical monthly 19 kg cylinder count to calculate your biogas savings.
                    </p>
                  </div>

                  {/* VISUAL CYLINDER SELECTOR */}
                  <div className="p-5 rounded-xl bg-forest-50/40 border border-forest-200/80 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest-200/60 pb-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-forest-950 block">
                          Current Monthly 19 kg Cylinder Usage
                        </span>
                        <span className="text-xs text-forest-800">
                          Replaces expensive commercial fossil gas cylinders
                        </span>
                      </div>
                      <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-forest-900 text-white font-semibold text-xs shadow-xs">
                        ₹{monthlySavings} / month cooking fuel spend
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { count: 3, label: '3 Cylinders (Cafe)' },
                        { count: 6, label: '6 Cylinders (Restaurant)' },
                        { count: 12, label: '12 Cylinders (Busy Kitchen)' },
                        { count: 25, label: '25 Cylinders (Canteen)' },
                        { count: 50, label: '50+ Cylinders (Institution)' },
                      ].map((p) => {
                        const isSelected = monthlyCylinders === p.count;
                        return (
                          <button
                            key={p.count}
                            type="button"
                            onClick={() => setMonthlyCylinders(p.count)}
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

                    {/* VISUAL CYLINDER DISPLAY */}
                    <div className="py-2">
                      <CylinderDisplay count={monthlyCylinders} size={30} showLabel={false} cylinderClassName="text-forest-900" />
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-forest-950 tabular-nums">
                        {monthlyCylinders}
                      </span>
                      <span className="text-xs font-medium text-forest-900">
                        commercial 19 kg cylinders to displace (~{requiredBiogasM3} m³ biogas needed daily)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700 block">
                      Cooking application:
                    </label>
                    <input
                      type="text"
                      value={application}
                      onChange={(e) => setApplication(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                      placeholder="e.g. Commercial restaurant cooking stoves, hot water boilers"
                    />
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 2: Recommended Digester Scale                       */}
              {/* ======================================================== */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-zinc-900">
                      Choose your preferred system sizing
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Based on displacing {monthlyCylinders} cylinders/month (~{requiredBiogasM3} m³/day).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'small',
                        title: 'Compact Micro-Digester',
                        ideal: '1–4 cylinders / month',
                        space: '15–25 m² outdoor space',
                        desc: 'Plug-and-play insulated vessel for cafes, bistros, or societies.',
                      },
                      {
                        id: 'medium',
                        title: 'Turnkey Commercial Digester',
                        ideal: '5–20 cylinders / month',
                        space: '40–80 m² service yard',
                        desc: 'Continuous heated reactor with scrubber and pressurized gas bag.',
                      },
                      {
                        id: 'large',
                        title: 'Piped Regional Supply',
                        ideal: '20+ cylinders / month',
                        space: 'Zero footprint on site',
                        desc: 'Direct pipeline connection from a nearby commercial digester plant.',
                      },
                    ].map((s) => {
                      const isSelected = selectedScale === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedScale(s.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                            isSelected
                              ? 'border-forest-900 bg-forest-50/50 shadow-xs'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-zinc-900 block">{s.title}</span>
                            <span className="text-[11px] font-medium text-forest-900 bg-forest-100/80 px-2 py-0.5 rounded inline-block">
                              Best for: {s.ideal}
                            </span>
                            <p className="text-xs text-zinc-500 leading-relaxed pt-1">{s.desc}</p>
                          </div>
                          <span className="text-[11px] text-zinc-400 block pt-1 border-t border-zinc-100">
                            Footprint: {s.space}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 3: Local Providers Near You                         */}
              {/* ======================================================== */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-zinc-900">
                        Local Providers in your Area
                      </h2>
                      <p className="text-xs text-zinc-500">
                        Select 2 providers to inspect side-by-side comparison.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                      {allPlants.length} providers verified
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {allPlants.map((plant) => {
                      const isChecked = selectedPlantIdsToCompare.includes(plant.id);
                      return (
                        <div
                          key={plant.id}
                          onClick={() => toggleCompareSelect(plant.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isChecked
                              ? 'border-forest-900 bg-forest-50/50 shadow-xs'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-zinc-900 text-sm">{plant.organisation}</h4>
                              <span className="text-[11px] font-medium bg-forest-100 text-forest-900 px-2 py-0.5 rounded border border-forest-200">
                                Verified Operator
                              </span>
                            </div>
                            <span className="text-xs text-zinc-500 block">
                              Scale: {plant.scale} · Territory: {plant.serviceArea?.slice(0, 3).join(', ')}
                            </span>
                            <span className="text-[11px] text-zinc-600 block">
                              SLA: {plant.omOffering}
                            </span>
                          </div>

                          <button
                            type="button"
                            className={`text-xs px-3.5 py-1.5 rounded-lg font-medium border transition-colors cursor-pointer shrink-0 ${
                              isChecked
                                ? 'bg-forest-900 text-white border-forest-900'
                                : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                            }`}
                          >
                            {isChecked ? 'Selected for Compare' : 'Compare'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 4: Side-by-Side Comparison                          */}
              {/* ======================================================== */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-zinc-900">
                      Side-by-Side Provider Comparison
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Comparing hardware capacity, warranties, and maintenance response terms.
                    </p>
                  </div>

                  {comparisonData && comparisonData.plants ? (
                    <CompareTable
                      plants={comparisonData.plants}
                      selectedForEnquiry={selectedPlantIdsForEnquiry}
                      onToggleSelect={toggleEnquirySelect}
                    />
                  ) : (
                    <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-500">
                      Loading comparison specifications...
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 5: Request Site Survey                              */}
              {/* ======================================================== */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-zinc-900">
                      Request Site Survey & Commercial Proposal
                    </h2>
                    <p className="text-xs text-zinc-500">
                      An engineer from the selected provider will review your cooking needs and arrange a site visit.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-zinc-200 pb-3">
                      <div>
                        <span className="text-[11px] text-zinc-500 block">Fuel Demand:</span>
                        <span className="font-semibold text-zinc-900">{monthlyCylinders} cylinders / mo</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-500 block">Monthly Savings:</span>
                        <span className="font-semibold text-forest-900">₹{monthlySavings} / mo</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-zinc-500 block">System Type:</span>
                        <span className="font-semibold text-zinc-900 capitalize">{selectedScale} Scale</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700 block">Phone Number:</label>
                        <input
                          type="text"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700 block">Email Address:</label>
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="text-xs font-medium text-zinc-700 block">Site Footprint / Location Notes:</label>
                      <input
                        type="text"
                        value={siteSpace}
                        onChange={(e) => setSiteSpace(e.target.value)}
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
                  disabled={loading}
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-1.5 bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Send size={13} />
                  <span>{loading ? 'Submitting...' : 'Request Site Survey'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={nextStep}
                  className="inline-flex items-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Continue</span>
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

export default ConsumerOnboarding;
