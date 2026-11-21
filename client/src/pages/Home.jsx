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
  Check,
  Sparkles,
  IndianRupee,
  Utensils,
  Clock,
  ShieldCheck,
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

  // Preset operations for rapid exploration
  const presets = [
    { label: 'Tea stall or cafe', kg: 30 },
    { label: 'Restaurant kitchen', kg: 100 },
    { label: 'Canteen or banquet', kg: 250 },
    { label: 'Apartment cluster', kg: 500 },
  ];

  // Dynamic simulation calculations grounded in MNRE standards
  // 100 kg waste ≈ 12 m³ gas; 1 m³ gas displaces ~0.45 kg LPG; 19 kg commercial cylinder ≈ ₹1,850
  const biogasM3 = (dailyWasteKg * 0.12).toFixed(1);
  const lpgCylindersMonth = ((dailyWasteKg * 0.12 * 30 * 0.45) / 19).toFixed(1);
  const mealsCooked = Math.round(dailyWasteKg * 3.5);
  const burnerHours = ((dailyWasteKg * 0.12) / 2.6).toFixed(1);
  const monthlySavingsRs = Math.round(((dailyWasteKg * 0.12 * 30 * 0.45) / 19) * 1850).toLocaleString('en-IN');
  const compostKg = Math.round(dailyWasteKg * 0.2);
  const co2AvoidedKg = Math.round(dailyWasteKg * 0.35);

  // Simplified everyday closed-loop story
  const lifecycleSteps = [
    {
      step: '1',
      title: 'Kitchen & vegetable scraps',
      subtitle: 'Raw ingredients',
      desc: 'Peels, leftover food, tea leaves, and prep discards collected daily instead of tossed in a plastic bag.',
      metaphor: 'Nothing wasted, nothing dumped',
    },
    {
      step: '2',
      title: 'Microbial bio-cooker',
      subtitle: 'Airtight digester tank',
      desc: 'Beneficial bacteria break down the organic matter inside a sealed chamber with zero foul smell.',
      metaphor: 'Natural fermentation at work',
    },
    {
      step: '3',
      title: 'Clean blue cooking flame',
      subtitle: 'Pipeline-ready gas',
      desc: 'Continuous bio-methane gas piped straight to high-heat stoves, replacing heavy commercial LPG cylinders.',
      metaphor: 'Piped fuel that never runs out',
    },
    {
      step: '4',
      title: 'Enriched plant food',
      subtitle: 'Organic bio-fertilizer',
      desc: 'The leftover liquid slurry is a chemical-free organic fertilizer that revitalizes soil, gardens, and farms.',
      metaphor: 'Nutrients returned to nature',
    },
  ];

  const faqs = [
    {
      q: 'Does an on-site biogas plant smell or attract pests?',
      a: 'No. Biogas generation happens entirely inside a sealed, airtight digestion vessel. Odors only occur when organic waste rots in open air. Because the tank is completely closed, smells cannot escape and flies or rodents cannot get inside.',
    },
    {
      q: 'Can a restaurant or housing society really replace commercial LPG?',
      a: 'Yes. 100 kg of daily kitchen food scraps produces approximately 12 m³ of biogas, which directly replaces about 5 to 6 commercial 19 kg LPG cylinders every month. That represents steady monthly fuel savings without cylinder delivery hassles.',
    },
    {
      q: 'What food scraps can and cannot go into the digester?',
      a: 'Cooked meal leftovers, vegetable and fruit trimmings, tea grounds, eggshells, and rice or grain scraps digest rapidly. Hard coconut shells, large tree branches, plastics, chemical detergents, and excessive cooking oil should be kept out.',
    },
    {
      q: 'How does the platform help me connect with local plants?',
      a: 'If you produce food waste, the platform matches you with local digesters that can collect it. If you need cooking gas, the platform helps you size your requirement and request proposals from nearby verified plant operators.',
    },
    {
      q: 'What if we do not produce enough waste for our own full-size plant?',
      a: 'Smaller food businesses can either install modular micro-digesters (designed for 25–100 kg/day) or simply schedule waste collection to supply a nearby neighborhood centralized plant.',
    },
  ];

  return (
    <div className="space-y-16 py-4 text-zinc-900 font-sans">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: Understandable Metaphors & Editorial Tone */}
      {/* ======================================================== */}
      <section className="space-y-6 pt-2">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-forest-800" aria-hidden="true" />
            <span>Biogas trust and discovery network</span>
            <span className="text-zinc-300">/</span>
            <span>Clean cooking energy from organic waste</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-medium text-zinc-900 tracking-tight leading-[1.12]">
            Turn daily kitchen food scraps into a clean cooking flame
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl">
            Stop throwing away valuable kitchen waste while paying high monthly gas bills. Connect with verified local biogas plants, calculate your exact energy yield, and make the switch with confidence.
          </p>
        </motion.div>

        {/* ======================================================== */}
        {/* 2. GAMEIFIED TACTILE SIMULATOR: Live Waste-to-Flame Meter*/}
        {/* ======================================================== */}
        <div className="rounded-xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-900">
                <Sparkles size={15} className="text-forest-800 stroke-[1.5]" />
                <span>Interactive waste-to-energy calculator</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Move the slider or tap a business size to see your live daily energy output
              </p>
            </div>
            <div className="text-xs text-zinc-500">
              Benchmark: 100 kg wet waste delivers ~12 m³ clean gas
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 mr-1">Quick pick:</span>
            {presets.map((p) => {
              const isSelected = dailyWasteKg === p.kg;
              return (
                <button
                  key={p.kg}
                  type="button"
                  onClick={() => setDailyWasteKg(p.kg)}
                  className={`text-xs py-1.5 px-3 rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-forest-900 bg-forest-900 text-white font-medium'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {p.label} ({p.kg} kg)
                </button>
              );
            })}
          </div>

          {/* Tactile Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={sliderId} className="font-medium text-zinc-700">
                Daily organic food scrap volume
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
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>20 kg (Small food stall)</span>
              <span>500 kg (Community cluster)</span>
              <span>1,000 kg (Commercial mandi)</span>
            </div>
          </div>

          {/* Real-time Tangible Outcome Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                <Flame size={14} className="text-forest-800 stroke-[1.5]" />
                <span>Cooking gas generated</span>
              </div>
              <span className="text-xl sm:text-2xl font-medium text-zinc-900 block tabular-nums">
                {biogasM3} m³
              </span>
              <span className="text-[11px] text-zinc-500 block">
                ~{burnerHours} hours of high-heat stove flame
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                <Utensils size={14} className="text-forest-800 stroke-[1.5]" />
                <span>Meals cooked daily</span>
              </div>
              <span className="text-xl sm:text-2xl font-medium text-zinc-900 block tabular-nums">
                {mealsCooked}
              </span>
              <span className="text-[11px] text-zinc-500 block">
                Fresh hot meals prepared on clean gas
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                <IndianRupee size={14} className="text-forest-800 stroke-[1.5]" />
                <span>Monthly fuel savings</span>
              </div>
              <span className="text-xl sm:text-2xl font-medium text-forest-900 block tabular-nums">
                ₹{monthlySavingsRs}
              </span>
              <span className="text-[11px] text-zinc-500 block">
                Displaces ~{lpgCylindersMonth} commercial LPG cylinders
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                <Droplets size={14} className="text-forest-800 stroke-[1.5]" />
                <span>Organic garden fertilizer</span>
              </div>
              <span className="text-xl sm:text-2xl font-medium text-zinc-900 block tabular-nums">
                {compostKg} kg
              </span>
              <span className="text-[11px] text-zinc-500 block">
                Rich liquid plant nutrients returned to soil
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. THREE STAKEHOLDER ENTRY POINTS (Archetypes only, no place/company names) */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
            Choose your starting point
          </h2>
          <p className="text-xs text-zinc-500">
            Tailored tools designed for generators, energy consumers, and plant engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Food Waste Generator */}
          <div
            onClick={() => handleRoleSelect('waste-restaurant-1', '/waste-provider')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-colors duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">I have organic waste</span>
                <Leaf size={16} className="text-forest-900 stroke-[1.5]" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-900">
                  Waste generator portal
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  For commercial kitchens, food stalls, canteens, vegetable vendors, and residential societies producing daily food scraps.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Audit daily scrap weights and gas potential</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Discover local plants ready to accept waste</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Track pickup status and environmental impact</span>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Enter as waste generator</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Card 2: Biogas Consumer */}
          <div
            onClick={() => handleRoleSelect('consumer-household-1', '/consumer')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-colors duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">I want clean cooking fuel</span>
                <Flame size={16} className="text-forest-900 stroke-[1.5]" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-900">
                  Biogas consumer portal
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  For restaurants, canteens, laundry boilers, and communities seeking affordable, uninterrupted piped cooking fuel.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Calculate daily burner needs & LPG replacement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Compare plant specs, yields, and verified permits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Request formal site survey proposals</span>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Enter as biogas consumer</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Card 3: Plant Provider */}
          <div
            onClick={() => handleRoleSelect('plant-apex-1', '/plant-provider')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-colors duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">I build or operate plants</span>
                <Factory size={16} className="text-forest-900 stroke-[1.5]" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-900">
                  Plant provider hub
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  For digester operators, bio-energy fabricators, and turnkey engineers looking for reliable feedstock and energy buyers.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Publish plant design capacity and accepted waste</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Manage safety sign-offs and pollution certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Review structured enquiries and dispatch quotes</span>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Enter as plant provider</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. HOW IT WORKS: 3 Simple Connected Steps                 */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
            How the platform works
          </h2>
          <p className="text-xs text-zinc-500">
            Simple, transparent steps to connect waste, energy, and infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2">
            <span className="text-xs text-zinc-400 block">Step 01</span>
            <h3 className="text-sm font-medium text-zinc-900">
              Calculate your numbers
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Answer a few simple questions about your kitchen waste volume or thermal cooking needs to see realistic gas outputs and costs.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2">
            <span className="text-xs text-zinc-400 block">Step 02</span>
            <h3 className="text-sm font-medium text-zinc-900">
              Inspect verified proofs
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Compare nearby plants by actual operating capacity, safety approvals, and pollution control clearances. Missing documents are clearly noted.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2">
            <span className="text-xs text-zinc-400 block">Step 03</span>
            <h3 className="text-sm font-medium text-zinc-900">
              Connect and schedule
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Send a structured brief directly to qualified operators to arrange waste collection or schedule an engineering site survey.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. THE CLOSED-LOOP JOURNEY (Metaphor-driven story)         */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-base font-medium text-zinc-900">
              The closed-loop food scrap journey
            </h2>
            <p className="text-xs text-zinc-500">
              Tap any stage to understand how everyday waste becomes clean fuel.
            </p>
          </div>
          <div className="inline-flex items-center gap-1 text-xs text-zinc-500">
            <RotateCcw size={13} className="stroke-[1.5]" />
            <span>Interactive cycle overview</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {lifecycleSteps.map((step, idx) => {
              const isSelected = activeCycleStep === idx;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveCycleStep(idx)}
                  className={`p-3.5 rounded-lg border transition-colors duration-150 cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-forest-900 bg-forest-50/40'
                      : 'border-zinc-200/90 bg-zinc-50/50 hover:bg-zinc-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">
                        Stage {step.step}
                      </span>
                      <span className="text-[11px] text-forest-800 font-medium">
                        {step.subtitle}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-medium text-zinc-900">{step.title}</h3>
                      <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/80 text-[11px] text-zinc-500">
                    {step.metaphor}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <span className="font-medium text-zinc-900">
                Stage {lifecycleSteps[activeCycleStep].step}: {lifecycleSteps[activeCycleStep].title}
              </span>
              <p className="text-zinc-600 text-[11px]">
                {lifecycleSteps[activeCycleStep].desc}
              </p>
            </div>
            <div className="text-forest-900 font-medium shrink-0 text-xs">
              {lifecycleSteps[activeCycleStep].metaphor}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. WHY IT MATTERS: Tangible Everyday Gains                */}
      {/* ======================================================== */}
      <section className="rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-6 space-y-5">
        <div className="max-w-xl space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
            Why this matters for your kitchen and community
          </h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Biogas solves two major everyday headaches at the same time: wet waste disposal and rising cooking fuel costs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="space-y-1">
            <span className="text-2xl font-medium text-zinc-900 block tabular-nums">100%</span>
            <h4 className="text-xs font-medium text-zinc-900">Landfill diversion</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Wet food waste converted into clean energy instead of rotting in open city dumps.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-medium text-forest-900 block tabular-nums">Up to 60%</span>
            <h4 className="text-xs font-medium text-zinc-900">LPG displacement</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Drastically cut commercial LPG cylinder consumption with continuous piped bio-gas.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-medium text-zinc-900 block tabular-nums">Zero</span>
            <h4 className="text-xs font-medium text-zinc-900">Open foul odor</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Airtight anaerobic containment keeps pests, flies, and rotten smell away.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-medium text-zinc-900 block tabular-nums">Verified</span>
            <h4 className="text-xs font-medium text-zinc-900">Factual evidence</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Transparent plant capacity figures with real government and safety sign-offs.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FREQUENTLY ASKED QUESTIONS                            */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
            Frequently asked questions
          </h2>
          <p className="text-xs text-zinc-500">
            Straightforward answers for kitchen owners, housing societies, and energy consumers.
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
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left text-xs sm:text-sm font-medium text-zinc-900 hover:text-zinc-700 transition-colors cursor-pointer"
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
                      className="overflow-hidden px-3.5 sm:px-4 pb-3.5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-2"
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
