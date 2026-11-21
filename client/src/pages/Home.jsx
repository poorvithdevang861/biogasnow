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
  RotateCcw,
  Sparkles,
  IndianRupee,
  Utensils,
  Clock,
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export function Home() {
  const { setProfileById } = useProfile();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const sliderId = useId();

  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeCycleStep, setActiveCycleStep] = useState(0);

  // Gamified tactile waste-to-energy simulator state
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
  const biogasM3 = (dailyWasteKg * 0.12).toFixed(1);
  const lpgCylindersMonth = ((dailyWasteKg * 0.12 * 30 * 0.45) / 19).toFixed(1);
  const mealsCooked = Math.round(dailyWasteKg * 3.5);
  const burnerHours = ((dailyWasteKg * 0.12) / 2.6).toFixed(1);
  const monthlySavingsRs = Math.round(((dailyWasteKg * 0.12 * 30 * 0.45) / 19) * 1850).toLocaleString('en-IN');
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
      desc: 'High-calorific bio-methane gas piped directly to cooking stoves.',
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
      a: 'No. Biogas generation occurs entirely inside a hermetically sealed chamber. Odors only occur when organic waste rots in open air. Because the tank is airtight, smells cannot escape and pests cannot enter.',
    },
    {
      q: 'Can a restaurant or society replace commercial LPG cylinders?',
      a: 'Yes. Every 100 kg of kitchen food waste yields ~12 m³ of biogas, directly displacing 5 to 6 commercial 19 kg LPG cylinders per month with continuous piped supply.',
    },
    {
      q: 'What kitchen waste can go into the digester?',
      a: 'Cooked meal leftovers, raw vegetable trimmings, fruit pulp, tea grounds, and grain scraps digest rapidly. Hard wood, coconut shells, plastic wrappers, and chemical sanitizers must be excluded.',
    },
    {
      q: 'How does this platform connect parties together?',
      a: 'Waste producers are matched with local collectors and digesters. Energy consumers size their cooking needs and receive transparent proposals from verified plant operators.',
    },
  ];

  return (
    <div className="space-y-16 py-4 text-zinc-900 font-sans max-w-4xl mx-auto">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: Centered, clean, high-signal            */}
      {/* ======================================================== */}
      <section className="text-center space-y-4 pt-2">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3 max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-800" aria-hidden="true" />
            <span>Clean cooking fuel from daily organic waste</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-medium text-zinc-900 tracking-tight leading-[1.14]">
            Turn daily food scraps into a clean cooking flame
          </h1>

          <p className="text-sm text-zinc-600 leading-relaxed max-w-md mx-auto">
            Calculate your bio-methane potential, compare verified local digesters, and replace expensive commercial LPG cylinders.
          </p>
        </motion.div>

        {/* ======================================================== */}
        {/* 2. LIVE SIMULATOR: Centered, tactile, concise            */}
        {/* ======================================================== */}
        <div className="rounded-xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-5 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-900">
              <Sparkles size={15} className="text-forest-800 stroke-[1.5]" />
              <span>Waste-to-energy calculator</span>
            </div>
            <span className="text-xs text-zinc-400">
              100 kg kitchen waste delivers ~12 m³ clean fuel
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs text-zinc-500 mr-1">Select scale:</span>
            {presets.map((p) => {
              const isSelected = dailyWasteKg === p.kg;
              return (
                <button
                  key={p.kg}
                  type="button"
                  onClick={() => setDailyWasteKg(p.kg)}
                  className={`text-xs py-1 px-3 rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-forest-900 bg-forest-900 text-white font-medium'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  {p.label} ({p.kg} kg)
                </button>
              );
            })}
          </div>

          {/* Range Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={sliderId} className="text-zinc-600">
                Daily organic scrap volume
              </label>
              <span className="text-sm font-semibold text-zinc-900 tabular-nums">
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
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-forest-900"
            />
          </div>

          {/* Calculated Output Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                <Flame size={13} className="text-forest-800 stroke-[1.5]" />
                <span>Biogas output</span>
              </div>
              <span className="text-xl font-medium text-zinc-900 block tabular-nums">
                {biogasM3} m³
              </span>
              <span className="text-[11px] text-zinc-500 block">
                ~{burnerHours} burner hours
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                <Utensils size={13} className="text-forest-800 stroke-[1.5]" />
                <span>Daily hot meals</span>
              </div>
              <span className="text-xl font-medium text-zinc-900 block tabular-nums">
                {mealsCooked}
              </span>
              <span className="text-[11px] text-zinc-500 block">
                Cooked on clean flame
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                <IndianRupee size={13} className="text-forest-800 stroke-[1.5]" />
                <span>Monthly savings</span>
              </div>
              <span className="text-xl font-medium text-forest-900 block tabular-nums">
                ₹{monthlySavingsRs}
              </span>
              <span className="text-[11px] text-zinc-500 block">
                ~{lpgCylindersMonth} LPG cylinders
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-0.5">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                <Droplets size={13} className="text-forest-800 stroke-[1.5]" />
                <span>Bio-fertilizer</span>
              </div>
              <span className="text-xl font-medium text-zinc-900 block tabular-nums">
                {compostKg} kg
              </span>
              <span className="text-[11px] text-zinc-500 block">
                Liquid soil nutrients
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. THREE PRIMARY ENTRY POINTS: Clean, reduced text       */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
            Choose your starting point
          </h2>
          <p className="text-xs text-zinc-500">
            Dedicated workflows for waste producers, gas consumers, and plant operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Waste Generator */}
          <div
            onClick={() => handleRoleSelect('waste-restaurant-1', '/waste-provider')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-colors duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Waste Generator</span>
                <Leaf size={16} className="text-forest-900 stroke-[1.5]" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-900">
                  I have organic waste
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  For kitchens, canteens, and communities. Audit scrap volume, calculate yields, and match with nearby digesters.
                </p>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Enter as generator</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Card 2: Biogas Consumer */}
          <div
            onClick={() => handleRoleSelect('consumer-household-1', '/consumer')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-colors duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Biogas Consumer</span>
                <Flame size={16} className="text-forest-900 stroke-[1.5]" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-900">
                  I want clean cooking fuel
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  For restaurants, canteens, and boilers. Size burner needs, compare audited providers, and cut LPG expenses.
                </p>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Enter as consumer</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Card 3: Plant Provider */}
          <div
            onClick={() => handleRoleSelect('plant-apex-1', '/plant-provider')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-colors duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Plant Provider</span>
                <Factory size={16} className="text-forest-900 stroke-[1.5]" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-900">
                  I operate biogas plants
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  For digester fabricators and operators. Publish plant capacity, showcase safety proofs, and triage buyer enquiries.
                </p>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Enter as provider</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. HOW IT WORKS: 3 Simple Steps (Centered header)        */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
            How it works
          </h2>
          <p className="text-xs text-zinc-500">
            Three simple steps to connect waste, fuel, and digester infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-1.5 text-center sm:text-left">
            <span className="text-xs text-zinc-400 block font-medium">01</span>
            <h3 className="text-sm font-medium text-zinc-900">
              Calculate your volume
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Enter daily kitchen scrap volume or monthly LPG cylinder usage to get realistic estimates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-1.5 text-center sm:text-left">
            <span className="text-xs text-zinc-400 block font-medium">02</span>
            <h3 className="text-sm font-medium text-zinc-900">
              Inspect verified plants
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Compare nearby digesters by distance, accepted waste types, and validated safety credentials.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-1.5 text-center sm:text-left">
            <span className="text-xs text-zinc-400 block font-medium">03</span>
            <h3 className="text-sm font-medium text-zinc-900">
              Schedule and connect
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Send a structured enquiry directly to qualified operators to schedule site surveys or collections.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. THE CLOSED-LOOP JOURNEY: Clean interactive strip       */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
            The closed-loop cycle
          </h2>
          <p className="text-xs text-zinc-500">
            From food scraps to clean energy and organic soil replenishment.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {lifecycleSteps.map((step, idx) => {
              const isSelected = activeCycleStep === idx;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveCycleStep(idx)}
                  className={`p-3 rounded-lg border transition-colors duration-150 cursor-pointer space-y-1 ${
                    isSelected
                      ? 'border-forest-900 bg-forest-50/40'
                      : 'border-zinc-200/90 bg-zinc-50/50 hover:bg-zinc-50'
                  }`}
                >
                  <span className="text-xs text-zinc-400 block">
                    Stage {step.step}
                  </span>
                  <h3 className="text-xs font-medium text-zinc-900">{step.title}</h3>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. FREQUENTLY ASKED QUESTIONS: Clean accordion            */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
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
