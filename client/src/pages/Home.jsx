import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import {
  Leaf,
  Flame,
  Factory,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Droplets,
  RotateCcw,
  CheckCircle2,
  FileText,
  Info,
  Check,
  Building2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { motionTokens } from '../utils/motion';
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

  // Circular Bio-Economy Infographic Data (Ground in MNRE/GOBARdhan benchmarks)
  const lifecycleSteps = [
    {
      step: '01',
      title: 'Segregated Organic Feedstock',
      subtitle: 'Commercial Kitchens & Mandis',
      icon: Leaf,
      metric: '100 kg wet waste / day',
      desc: 'Separated vegetable discards, cooked food leftovers, and grain pulp free of plastics and inorganic debris.',
      keyFact: '92% moisture · 18% volatile solids content',
    },
    {
      step: '02',
      title: 'Anaerobic Digestion Reactor',
      subtitle: 'Mesophilic Microbial Digestion',
      icon: Factory,
      metric: '37°C controlled digestion',
      desc: 'Methanogenic microbes ferment feedstock in an airtight vessel over a 21–30 day hydraulic retention time.',
      keyFact: 'Zero atmospheric venting · Sealed gas dome',
    },
    {
      step: '03',
      title: 'Clean Bio-Methane Fuel',
      subtitle: 'Thermal Cooking & Hot Water',
      icon: Flame,
      metric: '10–14 m³ biogas generated',
      desc: 'High-calorific fuel (60–65% CH₄) scrubbed of moisture and trace H₂S, piped directly to commercial cooktops.',
      keyFact: 'Displaces ~1.8 commercial LPG cylinders',
    },
    {
      step: '04',
      title: 'Enriched Fermented Bio-Slurry',
      subtitle: 'Organic Soil Rejuvenation',
      icon: Droplets,
      metric: '18–22 kg liquid fertilizer',
      desc: 'Stabilized pathogen-free digestate (FOM/PROM) rich in nitrogen, phosphorus, and potassium returned to soil.',
      keyFact: '100% circular nutrient return · Replaces synthetic urea',
    },
  ];

  const faqs = [
    {
      q: 'What types of organic waste can be processed into biogas?',
      a: 'Most biodegradable materials can be digested anaerobically: commercial kitchen prep scraps, plate waste, vegetable and fruit mandi discards, hostel canteen leftovers, spent brewery grains, and cattle dung. Lignin-rich tree wood, plastics, grease trap oils, and chemical sanitizers are not accepted in standard mesophilic digesters.',
    },
    {
      q: 'How does the platform verify plant provider credentials?',
      a: 'We strictly separate self-reported commercial claims from third-party documented proofs. Every provider profile clearly shows whether they have submitted PESO safety sign-offs, State Pollution Control Board (CPCB/SPCB) consent to operate, third-party pressure testing, or accredited laboratory biological yield reports. Missing documents are flagged openly.',
    },
    {
      q: 'Can a restaurant or residential society install an on-site micro-digester?',
      a: 'Yes. Modular micro-digesters (processing 25–250 kg/day) require 12–20 m² of outdoor ventilated ground space. They require basic segregation discipline, regular feeding, and pressure monitoring. In cooler winter months, insulated digestor jackets help maintain bacterial activity.',
    },
    {
      q: 'Does the platform guarantee specific financial savings or biogas yields?',
      a: 'No. All biological yield figures are published benchmark ranges derived from Ministry of New & Renewable Energy (MNRE) guidelines and peer-reviewed biogas literature. Because feedstock volatile solids and water content vary daily, output figures are explicitly tagged as indicative estimates rather than commercial guarantees.',
    },
    {
      q: 'How does an enquiry work between waste generators, consumers, and plant engineers?',
      a: 'Enquiries are structured digital briefs specifying feedstock type, generation frequency, vehicle service lane access, and energy offtake needs. Plant providers review these in their dedicated operations inbox to evaluate technical compatibility before issuing transparent proposals.',
    },
  ];

  const featuredProjects = [
    {
      id: 'proj-1',
      title: 'Bengaluru South Food Waste Hub',
      scale: 'Medium Commercial',
      location: 'Bengaluru, Karnataka',
      feedstock: 'Segregated restaurant, fruit & vegetable mandi scraps',
      capacity: '1,200 kg/day',
      output: '~135 m³/day biomethane',
      evidenceStatus: 'verified',
      verifiedSource: 'KSPCB Consent to Operate & MNRE Regional Audit',
      impact: 'Diverts 1.2 tonnes of organic waste daily from city landfills; fuels commercial dining kitchens.',
    },
    {
      id: 'proj-2',
      title: 'Vadodara Industrial Bio-CBG Facility',
      scale: 'Large Centralized',
      location: 'Vadodara, Gujarat',
      feedstock: 'Agro-processing press-mud & cattle dairy slurry',
      capacity: '2,500 kg/day',
      output: '~260 m³/day compressed bio-gas',
      evidenceStatus: 'verified',
      verifiedSource: 'PESO Cylinder Filling Permit & ISO 9001:2015',
      impact: 'Supplies scrubbed Bio-CNG for local industrial heating and commercial transport fleets under SATAT.',
    },
    {
      id: 'proj-3',
      title: 'Pune Eco-Society Modular Micro-Digester',
      scale: 'Small Modular',
      location: 'Pune, Maharashtra',
      feedstock: 'Residential society wet waste & community kitchen',
      capacity: '150 kg/day',
      output: '~16 m³/day biogas (~95 kWh equivalent)',
      evidenceStatus: 'verified',
      verifiedSource: 'Third-Party Pressure Safety Sign-off #2024-MH-44',
      impact: 'Displaces 60% of cooking LPG cylinder consumption with closed-loop community piped biogas.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 py-2 sm:py-4 text-zinc-900 font-sans">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: Purpose, clarity, restrained branding   */}
      {/* ======================================================== */}
      <section className="text-center space-y-4 max-w-2xl mx-auto pt-2 sm:pt-4">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.out }}
          className="space-y-3.5"
        >
          <div className="inline-flex items-center gap-2 text-forest-900 font-semibold text-xs tracking-wider uppercase bg-forest-50 px-3.5 py-1.5 rounded-full border border-forest-200">
            <Leaf size={14} className="text-forest-800 stroke-[2.2]" aria-hidden="true" />
            <span>Biogas Trust & Adoption Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-zinc-900 tracking-tight leading-[1.15]">
            Bridging Organic Waste, Clean Biogas & Qualified Plants
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl mx-auto">
            An evidence-based decision and connection architecture connecting organic waste generators, biogas consumers, and accredited plant engineers through published benchmarks and transparent verification.
          </p>
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* 2. THREE PROMINENT ENTRY POINTS                          */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="text-center space-y-1 max-w-md mx-auto">
          <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
            Select Your Role to Begin
          </span>
          <p className="text-xs text-zinc-500">
            Explore dedicated workflows tailored for each stakeholder group.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Role 1: Waste Generator */}
          <div
            onClick={() => handleRoleSelect('waste-restaurant-1', '/waste-provider')}
            className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-forest-700/80 transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-subtle hover:shadow-card group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-800 group-hover:scale-105 transition-transform duration-150">
                  <Leaf size={20} className="stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-semibold text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200">
                  Waste Generator
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-zinc-900 group-hover:text-forest-900 transition-colors">
                  I have organic waste
                </h2>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Evaluate commercial kitchen or mandi scraps, audit daily volumes, calculate indicative biogas yields, and discover nearby digester facilities.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-forest-800 shrink-0 stroke-[2.2]" />
                  <span>Feedstock characterization wizard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-forest-800 shrink-0 stroke-[2.2]" />
                  <span>Nearby plant matching by accepted waste</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <div className="w-full inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-subtle transition-colors">
                <span>Enter as Waste Generator</span>
                <ArrowRight size={14} className="stroke-[2.2] group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
              </div>
              <div className="text-[11px] text-zinc-400 text-center">
                Example profile: Annapurna Kitchens (Bengaluru)
              </div>
            </div>
          </div>

          {/* Role 2: Biogas Consumer */}
          <div
            onClick={() => handleRoleSelect('consumer-household-1', '/consumer')}
            className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-accent-600/80 transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-subtle hover:shadow-card group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 group-hover:scale-105 transition-transform duration-150">
                  <Flame size={20} className="stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Biogas Consumer
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-zinc-900 group-hover:text-amber-800 transition-colors">
                  I want to use biogas
                </h2>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Size thermal cooking and water heating demand, evaluate site footprint needs, and compare plant options with side-by-side verification data.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-amber-700 shrink-0 stroke-[2.2]" />
                  <span>5-step thermal demand sizing calculator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-amber-700 shrink-0 stroke-[2.2]" />
                  <span>Side-by-side provider comparison table</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <div className="w-full inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-subtle transition-colors">
                <span>Enter as Biogas Consumer</span>
                <ArrowRight size={14} className="stroke-[2.2] group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
              </div>
              <div className="text-[11px] text-zinc-400 text-center">
                Example profile: Gulmohar Greens Society (Pune)
              </div>
            </div>
          </div>

          {/* Role 3: Plant Provider */}
          <div
            onClick={() => handleRoleSelect('plant-apex-1', '/plant-provider')}
            className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-teal-700/80 transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-subtle hover:shadow-card group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:scale-105 transition-transform duration-150">
                  <Factory size={20} className="stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-semibold text-teal-900 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Plant Provider
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-zinc-900 group-hover:text-teal-900 transition-colors">
                  I provide biogas solutions
                </h2>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Publish plant specifications, manage third-party PESO/CPCB credentials, and triage structured customer requests in an operations hub.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-teal-700 shrink-0 stroke-[2.2]" />
                  <span>Verified credentials & audit manager</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-teal-700 shrink-0 stroke-[2.2]" />
                  <span>Incoming request triage & proposal hub</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <div className="w-full inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-subtle transition-colors">
                <span>Enter as Plant Provider</span>
                <ArrowRight size={14} className="stroke-[2.2] group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
              </div>
              <div className="text-[11px] text-zinc-400 text-center">
                Example profile: UrjaVeda BioEnergy (Vadodara)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HOW THE PLATFORM WORKS: 3-Step Architecture           */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
            Platform Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            How Stakeholders Connect
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            The platform does not operate physical digesters; it provides the transparent decision architecture to discover, assess, and connect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-subtle space-y-3">
            <div className="w-9 h-9 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-800 font-bold font-mono text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              Audit Feedstock & Sizing
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Kitchens and food businesses input daily scrap volumes. Consumers define their thermal energy requirements without locking into pre-selected hardware.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-subtle space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-bold font-mono text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              Compare Verified Evidence
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Inspect side-by-side provider capabilities. Commercial marketing claims are explicitly separated from third-party commissioning sign-offs, with missing documents flagged in red.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-subtle space-y-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold font-mono text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              Structured Proposals
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Dispatch structured briefs specifying delivery access, vehicle constraints, and questions directly to qualified plant operators to schedule site surveys.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. WHY USE THIS PLATFORM: Core Gaps Addressed            */}
      {/* ======================================================== */}
      <section className="p-7 sm:p-9 rounded-2xl bg-zinc-900 text-white space-y-6 shadow-card">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
            Circularity & Accountability
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why Transparency Matters
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Biogas projects frequently stall because marketing claims are conflated with engineering realities. We enforce evidence standards across all stakeholders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/80 space-y-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 block">100%</span>
            <h4 className="text-xs font-bold text-zinc-100">Landfill Diversion</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Diverts wet food scraps from open city dumping, converting volatile waste into clean cooking energy.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/80 space-y-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 block">~35 kg</span>
            <h4 className="text-xs font-bold text-zinc-100">Avoided CO₂e / 100kg</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Prevents uncaptured fugitive methane escaping from decomposing waste in municipal landfill heaps.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/80 space-y-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 block">6–12 kWh</span>
            <h4 className="text-xs font-bold text-zinc-100">Thermal Output / m³</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Displaces fossil LPG cylinders and expensive grid electric elements with closed-loop bio-methane.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/80 space-y-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 block">Zero</span>
            <h4 className="text-xs font-bold text-zinc-100">Unverified Claims</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every technical baseline is tied to documented MNRE/CPCB benchmarks and transparent evidence badges.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. INFOGRAPHIC 1: Circular Bio-Economy Process Flow      */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 uppercase tracking-wider">
            <RotateCcw size={14} className="stroke-[2.2]" />
            <span>Process Architecture Infographic</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            The Closed-Loop Bio-Economy
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Click any step to inspect the biological parameters and engineering requirements.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-subtle space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifecycleSteps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeCycleStep === idx;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveCycleStep(idx)}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-3.5 ${
                    isSelected
                      ? 'border-forest-800 bg-forest-50/50 shadow-subtle ring-1 ring-forest-800'
                      : 'border-zinc-200 bg-zinc-50/60 hover:border-zinc-300 hover:bg-white'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-zinc-400">
                        {step.step}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-forest-800">
                        <Icon size={15} className="stroke-[2]" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-zinc-900">{step.title}</h3>
                      <span className="text-[11px] text-zinc-500 block mt-0.5">{step.subtitle}</span>
                    </div>

                    <p className="text-[11px] text-zinc-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-200/80 space-y-0.5">
                    <div className="text-xs font-bold text-forest-900">
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

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest-900 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} className="stroke-[2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-forest-900 uppercase tracking-wider block">
                  Stage {lifecycleSteps[activeCycleStep].step} Specification
                </span>
                <span className="text-xs font-bold text-zinc-900">
                  {lifecycleSteps[activeCycleStep].title} &bull; {lifecycleSteps[activeCycleStep].metric}
                </span>
              </div>
            </div>

            <div className="text-zinc-600 sm:text-right text-[11px]">
              <span className="font-semibold text-zinc-900">Technical Standard: </span>
              {lifecycleSteps[activeCycleStep].keyFact}. Non-vented containment per CPCB norms.
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. INFOGRAPHIC 2: Tangible 100 kg Benchmark              */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-subtle space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 uppercase tracking-wider">
              <TrendingUp size={14} className="stroke-[2.2]" />
              <span>Conversion Benchmark Infographic</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              What 100 kg of Kitchen Food Waste Delivers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Grounding biological calculations in tangible real-world equivalents for commercial kitchens and communities in India.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium shrink-0">
            <Info size={13} className="text-forest-800 shrink-0" />
            <span>MNRE & IISc Published Baselines</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Feedstock Input</span>
              <Leaf size={15} className="text-forest-800" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-zinc-900 block tracking-tight font-mono">100 kg</span>
            <span className="text-xs font-bold text-forest-900 block">Segregated Wet Waste</span>
            <p className="text-[11px] text-zinc-600 leading-relaxed pt-0.5">
              Daily vegetable peels, dining discards, and rice/grain prep scraps collected at source.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Thermal Energy</span>
              <Flame size={15} className="text-amber-700" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-amber-900 block tracking-tight font-mono">10–14 m³</span>
            <span className="text-xs font-bold text-amber-800 block">~1.8 LPG Cylinders Displaced</span>
            <p className="text-[11px] text-zinc-600 leading-relaxed pt-0.5">
              Provides ~45–60 kWh thermal equivalent, powering 4.5 hours of continuous high-heat cooking.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Organic Fertilizer</span>
              <Droplets size={15} className="text-teal-700" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-teal-900 block tracking-tight font-mono">~20 kg</span>
            <span className="text-xs font-bold text-teal-800 block">Liquid Nutrient Slurry</span>
            <p className="text-[11px] text-zinc-600 leading-relaxed pt-0.5">
              Pathogen-free, nitrogen-rich organic soil conditioner returned to gardens and farms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Climate Impact</span>
              <ShieldCheck size={15} className="text-forest-800" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-forest-900 block tracking-tight font-mono">~35 kg</span>
            <span className="text-xs font-bold text-forest-900 block">Avoided CO₂e Emissions</span>
            <p className="text-[11px] text-zinc-600 leading-relaxed pt-0.5">
              Prevents uncaptured fugitive methane escaping from open municipal landfill dumps.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. THE 4-TIER EVIDENCE & TRUST STANDARD                  */}
      {/* ======================================================== */}
      <section className="p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200 shadow-subtle space-y-5">
        <div className="border-b border-zinc-200 pb-3 max-w-xl space-y-1">
          <div className="flex items-center gap-1.5 text-forest-800 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck size={16} className="stroke-[2.2]" />
            <span>The Trust Standard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
            Transparent Verification Indicators
          </h2>
          <p className="text-xs text-zinc-600">
            Trust is the core differentiator. We label all technical claims with one of four evidence states:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-forest-50/70 border border-forest-200 space-y-1">
            <StatusBadge status="verified" size="md" />
            <h4 className="text-xs font-bold text-forest-950 pt-1">Verified Evidence</h4>
            <p className="text-[11px] text-forest-900/80 leading-relaxed">
              Backed by PESO safety inspection, State Pollution Control Board CTO, or accredited laboratory audit reports.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <StatusBadge status="self-reported" size="md" />
            <h4 className="text-xs font-bold text-zinc-900 pt-1">Self-Reported Claims</h4>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Provided directly by the equipment manufacturer or client without independent inspection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
            <StatusBadge status="pending" size="md" />
            <h4 className="text-xs font-bold text-amber-950 pt-1">Pending Review</h4>
            <p className="text-[11px] text-amber-900/80 leading-relaxed">
              Submitted documentation currently undergoing administrative verification or test logging.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
            <StatusBadge status="missing" size="md" />
            <h4 className="text-xs font-bold text-rose-950 pt-1">Not Provided / Missing</h4>
            <p className="text-[11px] text-rose-900/80 leading-relaxed">
              Information unavailable or unverified. Clearly highlighted in red so users know what to ask.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. FEATURED REFERENCE FACILITIES IN INDIA                */}
      {/* ======================================================== */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1 max-w-xl">
            <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
              Operating Precedents
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Illustrative Reference Projects
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Documented anaerobic digestion installations demonstrating scale feasibility and verified energy outputs across India.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleRoleSelect('consumer-household-1', '/consumer?tab=compare')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-900 hover:underline shrink-0 cursor-pointer"
          >
            <span>Compare all facilities</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredProjects.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-subtle flex flex-col justify-between space-y-3.5 hover:border-zinc-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    {p.scale}
                  </span>
                  <StatusBadge status={p.evidenceStatus} size="sm" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{p.title}</h3>
                  <span className="text-[11px] text-zinc-500 block mt-0.5">{p.location}</span>
                </div>

                <div className="space-y-1 pt-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 text-[11px]">Daily Capacity:</span>
                    <strong className="text-zinc-900 text-xs">{p.capacity}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500 text-[11px]">Biogas Output:</span>
                    <strong className="text-zinc-900 text-xs">{p.output}</strong>
                  </div>
                  <div className="pt-1.5 text-zinc-600 leading-relaxed text-[11px]">
                    <strong>Outcome:</strong> {p.impact}
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-zinc-100 text-[10px] text-zinc-400">
                <span>Verified Reference: {p.verifiedSource}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. EDUCATIONAL RESOURCES & FAQ ACCORDION                 */}
      {/* ======================================================== */}
      <section className="space-y-5">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
            Technical Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-subtle"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left text-xs sm:text-sm font-bold text-zinc-900 hover:text-forest-800 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-forest-800' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                      animate={shouldReduceMotion ? false : { opacity: 1, height: 'auto' }}
                      exit={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden px-4 sm:px-4.5 pb-4 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-2.5"
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

      {/* ======================================================== */}
      {/* 10. EDITORIAL FOOTER & SOURCE ATTRIBUTION                */}
      {/* ======================================================== */}
      <footer className="pt-10 pb-6 border-t border-zinc-200 space-y-8 text-xs text-zinc-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2.5 md:col-span-2">
            <div className="flex items-center gap-2">
              <Leaf size={16} className="text-forest-800 stroke-[2.2]" />
              <span className="font-bold text-zinc-900 text-sm">Biogas Trust & Adoption Platform</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-sm">
              An evidence-based decision and connection architecture facilitating organic waste utilisation, biogas demand sizing, and accredited plant provider matching across India.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-zinc-400">
              <span>National Biogas Programme</span> &bull;
              <span>GOBARdhan Scheme Aligned</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-zinc-900 block text-xs">Workflows</span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('waste-restaurant-1', '/waste-provider')}
                  className="hover:text-forest-800 transition-colors cursor-pointer text-left"
                >
                  Waste Generator Portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('consumer-household-1', '/consumer')}
                  className="hover:text-forest-800 transition-colors cursor-pointer text-left"
                >
                  Biogas Consumer Portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('plant-apex-1', '/plant-provider')}
                  className="hover:text-forest-800 transition-colors cursor-pointer text-left"
                >
                  Plant Provider Hub
                </button>
              </li>
              <li>
                <Link to="/help" className="hover:text-forest-800 transition-colors">
                  Assisted Entry Checklist
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-zinc-900 block text-xs">Domain References</span>
            <ul className="space-y-1.5 text-xs text-zinc-500">
              <li>
                <a
                  href="https://mnre.gov.in/offerings/schemes-and-services/details/biogas-programme-MzMxIjMtQWa"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-forest-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>MNRE Biogas Programme</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a
                  href="https://biogas.mnre.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-forest-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>MNRE Biogas Portal</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.sbm.gov.in/Gobardhan/Home/aboutus"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-forest-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>GOBARdhan Scheme</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <span>CPCB Waste Guidelines 2016</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
          <span>&copy; {new Date().getFullYear()} Biogas Trust Platform. Independent decision support system.</span>
          <span>All technical figures are published benchmark estimates. Physical plants operated by independent providers.</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
