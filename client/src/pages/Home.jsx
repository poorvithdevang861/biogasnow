import React, { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import {
  Leaf,
  Flame,
  Factory,
  ArrowRight,
  ChevronDown,
  Droplets,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { CylinderDisplay } from '../components/CylinderIcon';

export function Home() {
  const { setProfileById } = useProfile();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const sliderId = useId();

  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeCycleStep, setActiveCycleStep] = useState(0);

  // Practical waste-to-energy simulator state
  const [dailyWasteKg, setDailyWasteKg] = useState(100);

  const handleRoleSelect = (profileId, routePath) => {
    setProfileById(profileId);
    navigate(routePath);
  };

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  // Preset operations
  const presets = [
    { label: 'Cafe / Stall', kg: 30 },
    { label: 'Restaurant', kg: 100 },
    { label: 'Canteen', kg: 250 },
    { label: 'Community', kg: 500 },
  ];

  // Calculations based on MNRE conversion benchmarks
  const lpgCylindersMonth = Math.max(1, Math.round((dailyWasteKg * 0.12 * 30 * 0.45) / 19));
  const mealsCooked = Math.round(dailyWasteKg * 3.5);
  const burnerHours = ((dailyWasteKg * 0.12) / 2.6).toFixed(1);
  const monthlySavingsRs = (lpgCylindersMonth * 1850).toLocaleString('en-IN');
  const compostKg = Math.round(dailyWasteKg * 0.2);

  // Closed-loop process stages
  const lifecycleSteps = [
    {
      step: '1',
      title: 'Kitchen scraps',
      desc: 'Peels, meal leftovers, and prep discards collected daily at source.',
    },
    {
      step: '2',
      title: 'Airtight digester',
      desc: 'Microbes ferment organic solids inside a sealed vessel with zero odor.',
    },
    {
      step: '3',
      title: 'Piped blue flame',
      desc: 'Clean bio-methane fuel piped directly to commercial cooking stoves.',
    },
    {
      step: '4',
      title: 'Organic fertilizer',
      desc: 'Nutrient-rich liquid bio-slurry returned to replenish soils and gardens.',
    },
  ];

  const faqs = [
    {
      q: 'Does an on-site biogas plant smell or attract pests?',
      a: 'No. Biogas generation occurs entirely inside a sealed vessel. Odor only happens when waste rots in open air. Because the tank is airtight, smells cannot escape and pests cannot enter.',
    },
    {
      q: 'Can a restaurant or society actually replace commercial LPG cylinders?',
      a: 'Yes. Every 100 kg of daily kitchen food waste generates enough gas to directly displace 5 to 6 commercial 19 kg LPG cylinders every month with continuous piped supply.',
    },
    {
      q: 'What kitchen waste can go into the digester?',
      a: 'Cooked meal leftovers, raw vegetable trimmings, fruit pulp, tea grounds, and grain scraps digest rapidly. Hard wood, coconut shells, plastic wrappers, and chemical sanitizers must be excluded.',
    },
    {
      q: 'How does this platform connect parties together?',
      a: 'Waste producers find nearby digester operators for daily collection or on-site setup. Energy consumers size their cooking needs and receive transparent quotes from verified operators.',
    },
  ];

  return (
    <div className="space-y-14 py-4 text-zinc-900 font-sans max-w-4xl mx-auto">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: Direct, action-oriented                 */}
      {/* ======================================================== */}
      <section className="text-center space-y-3 pt-2">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3 max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 text-xs text-zinc-500 bg-zinc-100/80 px-2.5 py-1 rounded-full border border-zinc-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-800" aria-hidden="true" />
            <span>Clean cooking fuel from daily organic waste</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-medium text-zinc-900 tracking-tight leading-[1.14]">
            Turn daily food scraps into a clean cooking flame
          </h1>

          <p className="text-sm text-zinc-600 leading-relaxed max-w-md mx-auto">
            Calculate your gas output, replace expensive commercial LPG cylinders, and connect with verified local digester operators.
          </p>
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* 2. THREE PRIMARY ENTRY POINTS                            */}
      {/* ======================================================== */}
      <section className="space-y-3">
        <div className="text-center space-y-1">
          <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
            Select an action to get started
          </h2>
          <p className="text-xs text-zinc-500">
            Choose your objective to enter your guided onboarding flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Supply Organic Waste */}
          <div
            onClick={() => handleRoleSelect('waste-restaurant-1', '/waste-provider')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-forest-700 hover:shadow-md transition-all duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.03)] group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200/80">
                  Supply Waste
                </span>
                <div className="w-8 h-8 rounded-lg bg-forest-50 border border-forest-200/60 flex items-center justify-center text-forest-900 group-hover:scale-105 transition-transform">
                  <Leaf size={18} className="stroke-[1.75]" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-zinc-900 group-hover:text-forest-950 transition-colors">
                  I have organic waste
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  For kitchens, canteens, and food processors. Enter daily scrap volume, calculate cylinders replaced, and connect with nearby digesters.
                </p>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Calculate & Supply Waste</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Card 2: Replace Cooking Gas */}
          <div
            onClick={() => handleRoleSelect('consumer-household-1', '/consumer')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-forest-700 hover:shadow-md transition-all duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.03)] group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200/80">
                  Replace Gas
                </span>
                <div className="w-8 h-8 rounded-lg bg-forest-50 border border-forest-200/60 flex items-center justify-center text-forest-900 group-hover:scale-105 transition-transform">
                  <Flame size={18} className="stroke-[1.75]" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-zinc-900 group-hover:text-forest-950 transition-colors">
                  I want clean cooking gas
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  For kitchens, boilers, and heating setups. Size your burner demand, compare verified local plant operators, and cut cylinder expenses.
                </p>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Size Fuel Demand</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Card 3: Supply & Set Up Biogas Plants */}
          <div
            onClick={() => handleRoleSelect('plant-apex-1', '/plant-provider')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-forest-700 hover:shadow-md transition-all duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.03)] group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-900 bg-forest-50 px-2 py-0.5 rounded border border-forest-200/80">
                  Plant Setup
                </span>
                <div className="w-8 h-8 rounded-lg bg-forest-50 border border-forest-200/60 flex items-center justify-center text-forest-900 group-hover:scale-105 transition-transform">
                  <Factory size={18} className="stroke-[1.75]" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-zinc-900 group-hover:text-forest-950 transition-colors">
                  I supply & set up plants
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  For digester fabricators and turnkey installers. Manage customer site survey requests, quote modular plants, and configure installation specifications.
                </p>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Enter Plant Setup Hub</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. LIVE SIMULATOR: Visual LPG Cylinders                  */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200">
            <Sparkles size={13} className="stroke-[2]" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900">
            See your potential output in real-time
          </h2>
          <p className="text-xs text-zinc-500">
            Drag the slider to match your daily kitchen scrap output.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">Quick select:</span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p) => {
                  const isSelected = dailyWasteKg === p.kg;
                  return (
                    <button
                      key={p.kg}
                      type="button"
                      onClick={() => setDailyWasteKg(p.kg)}
                      className={`text-xs py-1 px-3 rounded-lg border transition-all cursor-pointer font-medium ${
                        isSelected
                          ? 'border-forest-900 bg-forest-900 text-white shadow-xs'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      {p.label} ({p.kg} kg)
                    </button>
                  );
                })}
              </div>
            </div>
            <span className="text-xs text-zinc-500 hidden sm:inline">
              100 kg kitchen scraps ≈ 6 commercial cylinders / month
            </span>
          </div>

          {/* Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={sliderId} className="text-zinc-700 font-medium">
                Daily organic scrap volume
              </label>
              <span className="text-base font-semibold text-zinc-900 tabular-nums bg-zinc-100 px-2.5 py-0.5 rounded border border-zinc-200">
                {dailyWasteKg} kg / day
              </span>
            </div>
            <input
              id={sliderId}
              type="range"
              min="20"
              max="1000"
              step="10"
              value={dailyWasteKg}
              onChange={(e) => setDailyWasteKg(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-forest-900"
            />
          </div>

          {/* VISUAL RESULTS WITH CYLINDERS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
            {/* Featured Visual: LPG Cylinders Displaced (Takes 6 cols) */}
            <div className="md:col-span-6 p-4 rounded-xl bg-forest-50/40 border border-forest-200/80 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-forest-950">
                  LPG Cylinders Replaced
                </span>
                <span className="text-xs font-medium text-forest-900 bg-white px-2 py-0.5 rounded-full border border-forest-200">
                  ₹{monthlySavingsRs} / month saved
                </span>
              </div>

              {/* Physical Cylinder Group */}
              <div className="py-1">
                <CylinderDisplay count={lpgCylindersMonth} size={28} showLabel={false} cylinderClassName="text-forest-900" />
              </div>

              <div className="border-t border-forest-200/60 pt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-forest-950 tabular-nums">
                  {lpgCylindersMonth} <span className="text-xs font-normal text-forest-800">commercial 19kg cylinders/mo</span>
                </span>
              </div>
            </div>

            {/* Other 3 metrics (Takes 6 cols) */}
            <div className="md:col-span-6 grid grid-cols-3 gap-3">
              {/* Metric 1: Burner Hours */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between space-y-1">
                <div className="flex items-center gap-1 text-zinc-500 text-[11px] font-medium">
                  <Flame size={14} className="text-forest-800 stroke-[2]" />
                  <span>Flame Hours</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-zinc-900 block tabular-nums">
                    ~{burnerHours}
                  </span>
                  <span className="text-[11px] text-zinc-500 block">
                    burner hrs / day
                  </span>
                </div>
              </div>

              {/* Metric 2: Meals Cooked */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between space-y-1">
                <div className="flex items-center gap-1 text-zinc-500 text-[11px] font-medium">
                  <Utensils size={14} className="text-forest-800 stroke-[2]" />
                  <span>Meals Cooked</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-zinc-900 block tabular-nums">
                    {mealsCooked}
                  </span>
                  <span className="text-[11px] text-zinc-500 block">
                    hot meals / day
                  </span>
                </div>
              </div>

              {/* Metric 3: Bio-fertilizer */}
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between space-y-1">
                <div className="flex items-center gap-1 text-zinc-500 text-[11px] font-medium">
                  <Droplets size={14} className="text-forest-800 stroke-[2]" />
                  <span>Fertilizer</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-zinc-900 block tabular-nums">
                    {compostKg} <span className="text-xs font-normal text-zinc-500">kg</span>
                  </span>
                  <span className="text-[11px] text-zinc-500 block">
                    bio-slurry / day
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. HOW IT WORKS: 3 Practical Steps                       */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">
            How the platform works
          </h2>
          <p className="text-xs text-zinc-500">
            Three simple steps to turn food waste into kitchen fuel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">01</span>
            <h3 className="text-sm font-semibold text-zinc-900">
              Log daily waste volume
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Enter your kitchen scrap kilograms or current monthly LPG cylinder usage to see immediate gas generation potential.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">02</span>
            <h3 className="text-sm font-semibold text-zinc-900">
              Match nearby digesters
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Find verified plant operators serving your postal area who accept your feedstock stream or install on-site plants.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">03</span>
            <h3 className="text-sm font-semibold text-zinc-900">
              Connect & save
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Send a 1-click request to schedule site visits, arrange daily scrap collection, and lock in monthly fuel savings.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. FAQ ACCORDION: Practical questions                    */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">
            Frequently asked questions
          </h2>
          <p className="text-xs text-zinc-500">
            Common questions about on-site biogas adoption and cost savings.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-lg border border-zinc-200/90 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs sm:text-sm font-medium text-zinc-900 hover:text-zinc-700 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    size={15}
                    className={`text-zinc-400 shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180 text-zinc-700' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                      animate={shouldReduceMotion ? false : { opacity: 1, height: 'auto' }}
                      exit={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden px-3.5 pb-3 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-2"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
