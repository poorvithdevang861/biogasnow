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
  Sparkles,
  Zap,
  TrendingUp,
  Droplets,
  RotateCcw,
  CheckCircle2,
  FileCheck,
  Info,
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

  // Circular Bio-Economy Infographic Data
  const lifecycleSteps = [
    {
      step: '01',
      title: 'Segregated Organic Feedstock',
      subtitle: 'Commercial Kitchens & Mandis',
      icon: Leaf,
      metric: '100 kg wet waste / day',
      desc: 'Sorted vegetable discards, cooked food leftovers, and grain pulp separated from plastic and inorganic debris.',
      keyFact: '92% moisture · 18% volatile solids content',
      color: 'emerald',
    },
    {
      step: '02',
      title: 'Anaerobic Digestion Reactor',
      subtitle: 'Mesophilic Microbial Digestion',
      icon: Factory,
      metric: '37°C controlled digestion',
      desc: 'Acidogenic and methanogenic microbes ferment feedstock in an airtight vessel over a 21–30 day hydraulic retention time.',
      keyFact: 'Zero atmospheric venting · Sealed gas dome',
      color: 'teal',
    },
    {
      step: '03',
      title: 'Clean Bio-Methane Fuel',
      subtitle: 'Thermal Cooking & Hot Water',
      icon: Flame,
      metric: '10–14 m³ biogas generated',
      desc: 'High-calorific fuel (60–65% CH₄) scrubbed of moisture and trace H₂S, piped directly into commercial kitchen burners.',
      keyFact: 'Replaces ~1.8 commercial LPG cylinders',
      color: 'amber',
    },
    {
      step: '04',
      title: 'Enriched Fermented Bio-Slurry',
      subtitle: 'Organic Soil Rejuvenation',
      icon: Droplets,
      metric: '18–22 kg liquid fertilizer',
      desc: 'Stabilized pathogen-free digestate rich in nitrogen, phosphorus, and potassium returned to nurseries and farms.',
      keyFact: '100% circular nutrient return · Replaces synthetic urea',
      color: 'emerald',
    },
  ];

  const faqs = [
    {
      q: 'What types of organic waste can be processed into biogas?',
      a: 'Most biodegradable organic matter is suitable: commercial kitchen prep scraps, plate waste, vegetable and fruit mandi discards, canteen leftovers, spent grains, and cattle dung. Lignin-heavy tree wood, plastics, grease trap grease, and inorganic chemicals are not accepted in standard mesophilic digesters.',
    },
    {
      q: 'How does the platform verify plant provider credentials?',
      a: 'We independently separate self-reported commercial claims from third-party documented proofs. Every provider profile clearly shows whether they have submitted PESO safety sign-offs, State Pollution Control Board (CPCB/SPCB) consent to operate, third-party pressure testing, or accredited laboratory biological yield reports. Missing documents are flagged openly.',
    },
    {
      q: 'Can a restaurant or residential society install an on-site micro-digester?',
      a: 'Yes. Modular micro-digesters (processing 25–250 kg/day) require 12–20 m² of outdoor ventilated ground space. They require basic segregation discipline, regular feeding, and pressure monitoring. In regions with cooler winter nights, insulated digestor jackets help maintain bacterial activity.',
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
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-6 text-zinc-900">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: Clean, airy single typography           */}
      {/* ======================================================== */}
      <section className="text-center space-y-4 max-w-2xl mx-auto pt-2 sm:pt-4">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.out }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 text-emerald-800 font-semibold text-xs tracking-wider uppercase bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <Leaf size={14} className="text-emerald-700 stroke-[2.2]" aria-hidden="true" />
            <span>Biogas Trust & Adoption Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-zinc-900 tracking-tight leading-[1.18]">
            Bridging Organic Waste, Clean Biogas & Qualified Plants
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl mx-auto">
            A transparent decision architecture connecting commercial kitchens, residential consumers, and certified plant engineers through published benchmarks and audited credentials.
          </p>
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* 2. INFOGRAPHIC 1: Circular Bio-Economy Lifecycle         */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <RotateCcw size={14} className="stroke-[2.2]" />
            <span>System Architecture Infographic</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            The Closed-Loop Bio-Economy
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            How organic waste transforms into renewable fuel and organic bio-fertilizer through anaerobic digestion.
          </p>
        </div>

        {/* Interactive Lifecycle Flowchart / Infographic Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {lifecycleSteps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeCycleStep === idx;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveCycleStep(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-600'
                      : 'border-zinc-200 bg-zinc-50/60 hover:border-zinc-300 hover:bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-zinc-400">
                        {step.step}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                        <Icon size={16} className="stroke-[2]" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">{step.title}</h3>
                      <span className="text-[11px] text-zinc-500 block mt-0.5">{step.subtitle}</span>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-200/80 space-y-1">
                    <div className="text-xs font-bold text-emerald-800">
                      {step.metric}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {step.keyFact}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Step Visual Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="stroke-[2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Stage {lifecycleSteps[activeCycleStep].step} Breakdown
                </span>
                <span className="text-sm font-bold text-zinc-900">
                  {lifecycleSteps[activeCycleStep].title} &bull; {lifecycleSteps[activeCycleStep].metric}
                </span>
              </div>
            </div>

            <div className="text-xs text-zinc-600 sm:text-right max-w-md">
              <span className="font-semibold text-zinc-900">Technical Standard: </span>
              {lifecycleSteps[activeCycleStep].keyFact}. All stages operate under non-vented sealed containment.
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. INFOGRAPHIC 2: Tangible 100 kg Conversion Benchmark  */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-xs space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <TrendingUp size={14} className="stroke-[2.2]" />
              <span>Conversion Benchmark Infographic</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              What 100 kg of Kitchen Food Waste Delivers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Grounding biological calculations in tangible real-world equivalents for commercial kitchens and residential communities across India.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium shrink-0">
            <Info size={14} className="text-emerald-700 shrink-0" />
            <span>MNRE & IISc Published Baselines</span>
          </div>
        </div>

        {/* 4 Quantitative Conversion Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Feedstock Input</span>
              <Leaf size={16} className="text-emerald-700" />
            </div>
            <span className="text-3xl font-bold text-zinc-900 block tracking-tight">100 kg</span>
            <span className="text-xs font-bold text-emerald-800 block">Segregated Organic Scraps</span>
            <p className="text-xs text-zinc-600 leading-relaxed pt-1">
              Daily vegetable peels, dining discards, and rice/grain leftovers collected at source.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Thermal Energy</span>
              <Flame size={16} className="text-amber-700" />
            </div>
            <span className="text-3xl font-bold text-amber-900 block tracking-tight">10–14 m³</span>
            <span className="text-xs font-bold text-amber-800 block">~1.8 LPG Cylinders Displaced</span>
            <p className="text-xs text-zinc-600 leading-relaxed pt-1">
              Provides ~45–60 kWh thermal equivalent, powering 4.5 hours of continuous high-heat cooking.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Organic Fertilizer</span>
              <Droplets size={16} className="text-teal-700" />
            </div>
            <span className="text-3xl font-bold text-teal-900 block tracking-tight">~20 kg</span>
            <span className="text-xs font-bold text-teal-800 block">Liquid Nutrient Slurry</span>
            <p className="text-xs text-zinc-600 leading-relaxed pt-1">
              Pathogen-free, nitrogen-rich organic soil conditioner returned to gardens and nursery beds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Climate Impact</span>
              <ShieldCheck size={16} className="text-emerald-700" />
            </div>
            <span className="text-3xl font-bold text-emerald-900 block tracking-tight">~35 kg</span>
            <span className="text-xs font-bold text-emerald-800 block">Avoided CO₂e Emissions</span>
            <p className="text-xs text-zinc-600 leading-relaxed pt-1">
              Prevents uncaptured fugitive methane escaping from open municipal landfill dumps.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. THE 4-TIER TRUST & VERIFICATION LADDER                */}
      {/* ======================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-6">
        <div className="border-b border-zinc-200 pb-4 max-w-xl space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider">
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
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
            <StatusBadge status="verified" size="md" />
            <h4 className="text-xs font-bold text-emerald-950 pt-1">Verified Evidence</h4>
            <p className="text-[11px] text-emerald-900/80 leading-relaxed">
              Backed by PESO safety inspection, State Pollution Control Board CTO, or accredited laboratory audit reports.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
            <StatusBadge status="self-reported" size="md" />
            <h4 className="text-xs font-bold text-zinc-900 pt-1">Self-Reported Claims</h4>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Provided directly by the equipment manufacturer or client without independent inspection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <StatusBadge status="pending" size="md" />
            <h4 className="text-xs font-bold text-amber-950 pt-1">Pending Review</h4>
            <p className="text-[11px] text-amber-900/80 leading-relaxed">
              Submitted documentation currently undergoing administrative verification or test logging.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
            <StatusBadge status="missing" size="md" />
            <h4 className="text-xs font-bold text-rose-950 pt-1">Not Provided / Missing</h4>
            <p className="text-[11px] text-rose-900/80 leading-relaxed">
              Information unavailable or unverified. Clearly highlighted in red so users know what to ask.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. FEATURED REFERENCE FACILITIES IN INDIA                */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0"
          >
            <span>Compare all facilities</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {p.scale}
                  </span>
                  <StatusBadge status={p.evidenceStatus} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900">{p.title}</h3>
                  <span className="text-xs text-zinc-500 block mt-0.5">{p.location}</span>
                </div>

                <div className="space-y-1.5 pt-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Daily Capacity:</span>
                    <strong className="text-zinc-900">{p.capacity}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Biogas Output:</span>
                    <strong className="text-zinc-900">{p.output}</strong>
                  </div>
                  <div className="pt-2 text-zinc-600 leading-relaxed text-[11px]">
                    <strong>Outcome:</strong> {p.impact}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 text-[10px] text-zinc-400">
                <span>Verified Reference: {p.verifiedSource}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. EDUCATIONAL RESOURCES & FAQ ACCORDION                 */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Technical Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-zinc-900 hover:text-emerald-700 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-700' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                      animate={shouldReduceMotion ? false : { opacity: 1, height: 'auto' }}
                      exit={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden px-4 sm:px-5 pb-5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3"
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
      {/* 7. BOTTOM GET-STARTED ACTION BANNER                      */}
      {/* ======================================================== */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 text-center space-y-6 shadow-xs">
        <div className="max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Sparkles size={14} className="stroke-[2.2]" />
            <span>Select Your Pathway</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Ready to Explore the Biogas Ecosystem?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Choose your stakeholder role to start discovering opportunities, auditing yields, and requesting structured proposals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2">
          {/* Action 1: Waste Provider */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => handleRoleSelect('waste-restaurant-1', '/waste-provider')}
            className="p-5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200 transition-all text-left space-y-2 cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs group-hover:scale-105 transition-transform">
                <Leaf size={18} className="stroke-[2.2]" />
              </div>
              <ArrowRight size={14} className="text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-bold text-sm text-zinc-900 block group-hover:text-emerald-800 transition-colors">
                I Have Organic Waste
              </span>
              <span className="text-[11px] text-zinc-500 block mt-0.5">
                Annapurna Kitchens (Bengaluru)
              </span>
            </div>
          </motion.button>

          {/* Action 2: Biogas Consumer */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => handleRoleSelect('consumer-household-1', '/consumer')}
            className="p-5 rounded-2xl bg-amber-50/60 hover:bg-amber-50 border border-amber-200 transition-all text-left space-y-2 cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs group-hover:scale-105 transition-transform">
                <Flame size={18} className="stroke-[2.2]" />
              </div>
              <ArrowRight size={14} className="text-amber-700 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-bold text-sm text-zinc-900 block group-hover:text-amber-800 transition-colors">
                I Want to Use Biogas
              </span>
              <span className="text-[11px] text-zinc-500 block mt-0.5">
                Gulmohar Greens Society (Pune)
              </span>
            </div>
          </motion.button>

          {/* Action 3: Plant Provider */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => handleRoleSelect('plant-apex-1', '/plant-provider')}
            className="p-5 rounded-2xl bg-teal-50/60 hover:bg-teal-50 border border-teal-200 transition-all text-left space-y-2 cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-white border border-teal-200 flex items-center justify-center text-teal-700 shadow-2xs group-hover:scale-105 transition-transform">
                <Factory size={18} className="stroke-[2.2]" />
              </div>
              <ArrowRight size={14} className="text-teal-700 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-bold text-sm text-zinc-900 block group-hover:text-teal-800 transition-colors">
                I Provide Biogas Plants
              </span>
              <span className="text-[11px] text-zinc-500 block mt-0.5">
                UrjaVeda BioEnergy (Vadodara)
              </span>
            </div>
          </motion.button>
        </div>
      </section>
    </div>
  );
}

export default Home;
