import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import {
  Leaf,
  Flame,
  Factory,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Droplets,
  RotateCcw,
  CheckCircle2,
  Check,
  Scale,
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { StatusBadge } from '../components/StatusBadge';

export function Home() {
  const { setProfileById } = useProfile();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeCycleStep, setActiveCycleStep] = useState(0);

  const handleRoleSelect = (profileId, routePath) => {
    setProfileById(profileId);
    navigate(routePath);
  };

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  // Circular Bio-Economy Infographic Data (Grounded in MNRE/GOBARdhan benchmarks)
  const lifecycleSteps = [
    {
      step: '01',
      title: 'Segregated organic feedstock',
      subtitle: 'Commercial kitchens and mandis',
      icon: Leaf,
      metric: '100 kg wet waste / day',
      desc: 'Separated vegetable discards, plate scrapings, and grain prep scraps free of non-biodegradable debris.',
      keyFact: '92% moisture · 18% volatile solids content',
    },
    {
      step: '02',
      title: 'Anaerobic digestion reactor',
      subtitle: 'Mesophilic microbial fermentation',
      icon: Factory,
      metric: '37°C controlled digestion',
      desc: 'Methanogenic microbes break down volatile organic solids in an airtight vessel over a 21–30 day retention period.',
      keyFact: 'Zero atmospheric venting · Sealed gas dome',
    },
    {
      step: '03',
      title: 'Scrubbed bio-methane fuel',
      subtitle: 'Thermal cooking and hot water',
      icon: Flame,
      metric: '10–14 m³ biogas generated',
      desc: 'High-calorific fuel (60–65% CH₄) scrubbed of moisture and trace H₂S, piped directly to commercial burners.',
      keyFact: 'Displaces ~1.8 commercial LPG cylinders',
    },
    {
      step: '04',
      title: 'Fermented bio-slurry',
      subtitle: 'Organic soil replenishment',
      icon: Droplets,
      metric: '18–22 kg liquid fertilizer',
      desc: 'Stabilized pathogen-free digestate (PROM/FOM) rich in bioavailable nitrogen, phosphorus, and potassium.',
      keyFact: '100% circular nutrient return · Replaces synthetic urea',
    },
  ];

  const faqs = [
    {
      q: 'What types of organic waste can be processed into biogas?',
      a: 'Most biodegradable materials can be digested anaerobically: commercial kitchen prep scraps, plate discards, vegetable and fruit mandi surplus, canteen leftovers, spent grain pulp, and cattle dung. Woody tree limbs, plastics, grease trap grease, and concentrated chemical sanitizers must be excluded.',
    },
    {
      q: 'How does the platform verify plant provider credentials?',
      a: 'We strictly separate self-reported commercial claims from third-party documented proofs. Every provider profile indicates whether they have submitted PESO safety sign-offs, State Pollution Control Board consent to operate, third-party pressure testing certificates, or accredited laboratory biological yield reports. Missing documents are clearly flagged.',
    },
    {
      q: 'Can a restaurant or residential society install an on-site micro-digester?',
      a: 'Yes. Modular micro-digesters processing 25–250 kg/day require 12–20 m² of outdoor ventilated ground space. They require segregation discipline, regular feeding, and pressure monitoring. In cooler winter months, insulated digestor jackets help maintain consistent bacterial activity.',
    },
    {
      q: 'Does the platform guarantee specific financial savings or biogas yields?',
      a: 'No. All biological yield figures are published benchmark ranges derived from Ministry of New & Renewable Energy (MNRE) guidelines and peer-reviewed literature. Because feedstock moisture and volatile solids vary daily, output figures are explicitly presented as indicative estimates rather than commercial guarantees.',
    },
    {
      q: 'How does an enquiry work between waste generators, consumers, and plant engineers?',
      a: 'Enquiries are structured digital briefs specifying feedstock type, generation frequency, vehicle service lane access, and energy offtake needs. Plant operators review these in their dedicated operations inbox to evaluate technical compatibility before issuing transparent proposals.',
    },
  ];

  const featuredProjects = [
    {
      id: 'proj-1',
      title: 'Bengaluru South Food Waste Hub',
      scale: 'Medium commercial',
      location: 'Bengaluru, Karnataka',
      feedstock: 'Segregated restaurant, fruit and vegetable mandi scraps',
      capacity: '1,200 kg/day',
      output: '~135 m³/day biomethane',
      evidenceStatus: 'verified',
      verifiedSource: 'KSPCB Consent to Operate · MNRE Regional Audit',
      impact: 'Diverts 1.2 tonnes of organic waste daily from municipal dumps; fuels commercial dining kitchens.',
    },
    {
      id: 'proj-2',
      title: 'Vadodara Industrial Bio-CBG Facility',
      scale: 'Large centralized',
      location: 'Vadodara, Gujarat',
      feedstock: 'Agro-processing press-mud and dairy slurry',
      capacity: '2,500 kg/day',
      output: '~260 m³/day compressed bio-gas',
      evidenceStatus: 'verified',
      verifiedSource: 'PESO Cylinder Filling Permit · ISO 9001:2015',
      impact: 'Supplies scrubbed Bio-CNG for local industrial heating and commercial transport fleets under SATAT.',
    },
    {
      id: 'proj-3',
      title: 'Pune Eco-Society Modular Micro-Digester',
      scale: 'Small modular',
      location: 'Pune, Maharashtra',
      feedstock: 'Residential society wet waste and community kitchen',
      capacity: '150 kg/day',
      output: '~16 m³/day biogas (~95 kWh equivalent)',
      evidenceStatus: 'verified',
      verifiedSource: 'Third-Party Pressure Safety Sign-off #2024-MH-44',
      impact: 'Displaces 60% of cooking LPG cylinder consumption with closed-loop community piped biogas.',
    },
  ];

  return (
    <div className="space-y-16 py-4 text-zinc-900 font-sans">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: Exacting, calm, editorial               */}
      {/* ======================================================== */}
      <section className="space-y-8 pt-4">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 tracking-tight">
            <span className="w-2 h-2 rounded-full bg-forest-800" aria-hidden="true" />
            <span>MNRE & GOBARdhan standards architecture</span>
            <span className="text-zinc-300">/</span>
            <span>Est. 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-medium text-zinc-900 tracking-tight leading-[1.12]">
            The verification exchange for organic waste and bio-methane
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl">
            Connecting commercial kitchens, bulk waste generators, thermal consumers, and accredited plant engineers through published engineering baselines and transparent compliance records.
          </p>
        </motion.div>

        {/* Hero Material Moment: Tactile Conversion & Verification Ledger */}
        <div className="rounded-xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-900">
              <Scale size={16} className="text-zinc-500 stroke-[1.5]" />
              <span>Standard biological conversion ledger</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Ref: MNRE-IS 16087 // 100 kg Kitchen Wet Waste
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-500 block">Feedstock input</span>
              <span className="text-lg font-mono font-medium text-zinc-900 block tabular-nums">100 kg</span>
              <span className="text-[11px] text-zinc-600">Segregated kitchen wet waste</span>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-500 block">Mesophilic yield</span>
              <span className="text-lg font-mono font-medium text-forest-900 block tabular-nums">12.4 m³</span>
              <span className="text-[11px] text-zinc-600">60–65% CH₄ scrubbed gas</span>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-500 block">Thermal displacement</span>
              <span className="text-lg font-mono font-medium text-zinc-900 block tabular-nums">~1.8 cylinders</span>
              <span className="text-[11px] text-zinc-600">Commercial 19 kg LPG equivalent</span>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-500 block">Evidence status</span>
              <div className="pt-0.5">
                <StatusBadge status="verified" size="sm" />
              </div>
              <span className="text-[11px] text-zinc-600">CPCB and PESO validated</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. THREE PRIMARY ENTRY POINTS                            */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
            Select your role to begin
          </h2>
          <p className="text-xs text-zinc-500">
            Dedicated workflows designed for each stakeholder group.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Role 1: Waste Generator */}
          <div
            onClick={() => handleRoleSelect('waste-restaurant-1', '/waste-provider')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-colors duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">01 // Generator</span>
                <Leaf size={16} className="text-forest-900 stroke-[1.5]" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-900">
                  I have organic waste
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Characterize commercial kitchen or mandi scraps, calculate daily yield potential, and match with nearby digester plants.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Feedstock characterization wizard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Radius matching by accepted waste types</span>
                </div>
              </div>
            </div>

            <div className="pt-5 space-y-2">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Enter as waste generator</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
              <div className="text-[11px] text-zinc-400 text-center font-mono">
                Annapurna Kitchens · Bengaluru
              </div>
            </div>
          </div>

          {/* Role 2: Biogas Consumer */}
          <div
            onClick={() => handleRoleSelect('consumer-household-1', '/consumer')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-colors duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">02 // Consumer</span>
                <Flame size={16} className="text-forest-900 stroke-[1.5]" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-900">
                  I want to use biogas
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Size thermal cooking and hot water demand, calculate monthly LPG replacement, and compare plant options side by side.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>5-step thermal demand sizing calculator</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Side-by-side audited comparison table</span>
                </div>
              </div>
            </div>

            <div className="pt-5 space-y-2">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Enter as biogas consumer</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
              <div className="text-[11px] text-zinc-400 text-center font-mono">
                Gulmohar Greens Society · Pune
              </div>
            </div>
          </div>

          {/* Role 3: Plant Provider */}
          <div
            onClick={() => handleRoleSelect('plant-apex-1', '/plant-provider')}
            className="p-5 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-400 transition-colors duration-150 flex flex-col justify-between cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">03 // Provider</span>
                <Factory size={16} className="text-forest-900 stroke-[1.5]" />
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-900">
                  I provide biogas solutions
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Publish plant specifications, manage third-party PESO and CPCB evidence, and triage structured customer requests.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Regulatory credential audit manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-zinc-500 stroke-[1.5] shrink-0" />
                  <span>Structured request triage and proposal hub</span>
                </div>
              </div>
            </div>

            <div className="pt-5 space-y-2">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Enter as plant provider</span>
                <ArrowRight size={14} className="stroke-[1.5]" />
              </button>
              <div className="text-[11px] text-zinc-400 text-center font-mono">
                UrjaVeda BioEnergy · Vadodara
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HOW THE PLATFORM WORKS                                */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
            How stakeholders connect
          </h2>
          <p className="text-xs text-zinc-500">
            The platform does not operate physical digesters; it provides the transparent decision architecture to discover, assess, and connect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2">
            <span className="font-mono text-xs text-zinc-400 block">01 // Audit</span>
            <h3 className="text-sm font-medium text-zinc-900">
              Audit feedstock and sizing
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Generators input scrap weight and moisture characteristics. Consumers define thermal requirements without early hardware commitments.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2">
            <span className="font-mono text-xs text-zinc-400 block">02 // Evidence</span>
            <h3 className="text-sm font-medium text-zinc-900">
              Compare verified evidence
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Inspect side-by-side provider capabilities. Commercial claims are separated from third-party commissioning sign-offs with missing files flagged.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2">
            <span className="font-mono text-xs text-zinc-400 block">03 // Connect</span>
            <h3 className="text-sm font-medium text-zinc-900">
              Dispatch structured briefs
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Send detailed requirements specifying access lanes, feedstock segregation, and delivery frequency directly to plant operators.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. WHY TRANSPARENCY MATTERS                              */}
      {/* ======================================================== */}
      <section className="rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-6 space-y-5">
        <div className="max-w-xl space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
            Why transparency matters
          </h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Biogas projects frequently stall because unverified marketing claims are conflated with engineering realities. We enforce published evidence standards across all stakeholders.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="space-y-1">
            <span className="text-2xl font-mono font-medium text-zinc-900 block tabular-nums">100%</span>
            <h4 className="text-xs font-medium text-zinc-900">Landfill diversion</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Wet food scraps diverted from open municipal dumping grounds.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-mono font-medium text-zinc-900 block tabular-nums">~35 kg</span>
            <h4 className="text-xs font-medium text-zinc-900">Avoided CO₂e / 100kg</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Prevents fugitive methane release from unmanaged decomposing waste.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-mono font-medium text-zinc-900 block tabular-nums">6–12 kWh</span>
            <h4 className="text-xs font-medium text-zinc-900">Thermal output / m³</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Displaces fossil LPG cylinders with closed-loop bio-methane.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-mono font-medium text-forest-900 block tabular-nums">Zero</span>
            <h4 className="text-xs font-medium text-zinc-900">Unverified claims</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Every baseline is grounded in documented MNRE and CPCB criteria.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. CLOSED-LOOP BIO-ECONOMY PROCESS FLOW                  */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-base font-medium text-zinc-900">
              The closed-loop bio-economy
            </h2>
            <p className="text-xs text-zinc-500">
              Click any stage to inspect the biological parameters and engineering requirements.
            </p>
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500">
            <RotateCcw size={12} className="stroke-[1.5]" />
            <span>Interactive process audit</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {lifecycleSteps.map((step, idx) => {
              const Icon = step.icon;
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
                      <span className="font-mono text-xs text-zinc-400">
                        {step.step}
                      </span>
                      <Icon size={16} className="text-zinc-600 stroke-[1.5]" />
                    </div>

                    <div>
                      <h3 className="text-xs font-medium text-zinc-900">{step.title}</h3>
                      <span className="text-[11px] text-zinc-500 block">{step.subtitle}</span>
                    </div>

                    <p className="text-[11px] text-zinc-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/80 space-y-0.5">
                    <div className="text-xs font-mono font-medium text-zinc-900">
                      {step.metric}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {step.keyFact}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-forest-900 stroke-[1.5] shrink-0" />
              <div>
                <span className="text-xs font-medium text-zinc-900">
                  Stage {lifecycleSteps[activeCycleStep].step}: {lifecycleSteps[activeCycleStep].title}
                </span>
                <span className="text-zinc-500 block text-[11px]">
                  Output: {lifecycleSteps[activeCycleStep].metric}
                </span>
              </div>
            </div>

            <div className="text-zinc-500 sm:text-right text-[11px]">
              <span className="text-zinc-700">Norm: </span>
              {lifecycleSteps[activeCycleStep].keyFact}. Containment per CPCB guidelines.
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. PHYSICAL 100 KG BENCHMARK CONVERSION                  */}
      {/* ======================================================== */}
      <section className="bg-white rounded-xl p-5 sm:p-6 border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-base font-medium text-zinc-900">
              What 100 kg of kitchen food waste delivers
            </h2>
            <p className="text-xs text-zinc-500">
              Biological calculations grounded in tangible equivalents for commercial kitchens and communities in India.
            </p>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 shrink-0">
            Source: MNRE and IISc published baselines
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
            <span className="text-[11px] text-zinc-500 block">Feedstock input</span>
            <span className="text-2xl font-mono font-medium text-zinc-900 block tabular-nums">100 kg</span>
            <span className="text-xs font-medium text-zinc-800 block">Segregated wet waste</span>
            <p className="text-[11px] text-zinc-500 leading-relaxed pt-0.5">
              Daily vegetable peels, dining discards, and rice and grain scraps collected at source.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
            <span className="text-[11px] text-zinc-500 block">Thermal energy</span>
            <span className="text-2xl font-mono font-medium text-zinc-900 block tabular-nums">10–14 m³</span>
            <span className="text-xs font-medium text-zinc-800 block">~1.8 LPG cylinders displaced</span>
            <p className="text-[11px] text-zinc-500 leading-relaxed pt-0.5">
              Provides ~45–60 kWh thermal equivalent, powering ~4.5 hours of high-heat burner use.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
            <span className="text-[11px] text-zinc-500 block">Organic fertilizer</span>
            <span className="text-2xl font-mono font-medium text-zinc-900 block tabular-nums">~20 kg</span>
            <span className="text-xs font-medium text-zinc-800 block">Liquid nutrient slurry</span>
            <p className="text-[11px] text-zinc-500 leading-relaxed pt-0.5">
              Pathogen-free, nitrogen-rich organic soil conditioner returned to gardens and farms.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
            <span className="text-[11px] text-zinc-500 block">Climate impact</span>
            <span className="text-2xl font-mono font-medium text-forest-900 block tabular-nums">~35 kg</span>
            <span className="text-xs font-medium text-zinc-800 block">Avoided CO₂e emissions</span>
            <p className="text-[11px] text-zinc-500 leading-relaxed pt-0.5">
              Prevents uncaptured fugitive methane escaping from open municipal landfill heaps.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. THE 4-TIER EVIDENCE & TRUST STANDARD                  */}
      {/* ======================================================== */}
      <section className="p-5 sm:p-6 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
        <div className="border-b border-zinc-100 pb-3 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-900">
            <ShieldCheck size={16} className="text-forest-900 stroke-[1.5]" />
            <span>The verification standard</span>
          </div>
          <p className="text-xs text-zinc-500">
            Every technical claim on the platform is categorized into one of four verifiable states:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg bg-forest-50/50 border border-forest-200 space-y-1">
            <StatusBadge status="verified" size="sm" />
            <h4 className="text-xs font-medium text-zinc-900 pt-1">Verified evidence</h4>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Backed by PESO safety inspections, State Pollution Control Board CTO, or accredited laboratory audit reports.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
            <StatusBadge status="self-reported" size="sm" />
            <h4 className="text-xs font-medium text-zinc-900 pt-1">Self-reported claims</h4>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Provided directly by the equipment manufacturer or client without third-party physical inspection.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200 space-y-1">
            <StatusBadge status="pending" size="sm" />
            <h4 className="text-xs font-medium text-zinc-900 pt-1">Pending review</h4>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Submitted documentation currently undergoing administrative verification or test logging.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-rose-50/50 border border-rose-200 space-y-1">
            <StatusBadge status="missing" size="sm" />
            <h4 className="text-xs font-medium text-zinc-900 pt-1">Not provided</h4>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Information unavailable or unverified. Highlighted in red so users know what questions to ask.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. FEATURED REFERENCE FACILITIES IN INDIA                */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-base font-medium text-zinc-900">
              Operating reference projects
            </h2>
            <p className="text-xs text-zinc-500">
              Documented anaerobic digestion installations demonstrating scale feasibility and verified outputs across India.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleRoleSelect('consumer-household-1', '/consumer?tab=compare')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-900 hover:text-forest-900 transition-colors shrink-0 cursor-pointer"
          >
            <span>Compare all facilities</span>
            <ArrowRight size={13} className="stroke-[1.5]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredProjects.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono text-zinc-500">
                    {p.scale}
                  </span>
                  <StatusBadge status={p.evidenceStatus} size="sm" />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-900">{p.title}</h3>
                  <span className="text-[11px] text-zinc-500 block">{p.location}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 text-[11px]">Daily capacity:</span>
                    <span className="font-mono text-zinc-900 tabular-nums">{p.capacity}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 text-[11px]">Biogas output:</span>
                    <span className="font-mono text-zinc-900 tabular-nums">{p.output}</span>
                  </div>
                  <div className="pt-1 text-zinc-600 leading-relaxed text-[11px]">
                    <span className="text-zinc-800">Outcome: </span>{p.impact}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 text-[10px] text-zinc-400 font-mono">
                {p.verifiedSource}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FREQUENTLY ASKED QUESTIONS                            */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-medium text-zinc-900">
            Frequently asked questions
          </h2>
          <p className="text-xs text-zinc-500">
            Key considerations for commercial organic waste and bio-methane adoption.
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

      {/* Note: Footer intentionally removed per user request */}
    </div>
  );
}

export default Home;
