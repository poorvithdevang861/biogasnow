import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import {
  Leaf,
  Flame,
  Factory,
  ArrowRight,
  Check,
  User,
  ShieldCheck,
  HelpCircle,
  Building2,
  Scale,
  Sparkles,
  ChevronDown,
  Clock,
  AlertCircle,
  BookOpen,
  Award,
  Zap,
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { staggerContainer, staggerItem, motionTokens, cardHoverMotion, buttonTapMotion } from '../utils/motion';
import { StatusBadge } from '../components/StatusBadge';

export function Home() {
  const { setProfileById } = useProfile();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleRoleSelect = (profileId, routePath) => {
    setProfileById(profileId);
    navigate(routePath);
  };

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'What types of organic waste can be processed into biogas?',
      a: 'Most biodegradable materials can be digested anaerobically, including pre-consumer commercial kitchen scraps, plate waste, food factory residues, brewery spent grains, and agricultural slurries. Wood, plastics, and high-lignin materials are not suitable for standard mesophilic digesters.',
    },
    {
      q: 'How does the platform verify plant provider claims?',
      a: 'We separate self-reported commercial claims (such as advertised warranties or O&M packages) from independently verified evidence documents (such as CE certification, third-party commissioning sign-offs, and accredited laboratory biological yield reports). Missing or unverified documents are explicitly flagged.',
    },
    {
      q: 'Can a small restaurant or household install an on-site micro-digester?',
      a: 'Yes, micro-digesters (processing 10–250 kg/day) can be installed on sites with 10–15 m² of outdoor ventilated ground space. However, they require daily sorting discipline, gas pressure monitoring, and auxiliary thermal insulation during winter cold snaps to maintain mesophilic bacteria activity.',
    },
    {
      q: 'Does the platform generate guaranteed financial savings or output?',
      a: 'No. All biological yield figures are indicative ranges derived from published peer-reviewed academic benchmarks and research institutions. Because feedstock volatile solids and digestion temperatures vary, output ranges are clearly labelled as estimates, not guaranteed outcomes.',
    },
    {
      q: 'How do enquiries work between waste producers, consumers, and plants?',
      a: 'Enquiries are structured digital requests specifying feedstock mass, collection rhythm, vehicle access constraints, and required energy off-take. Plant providers receive these directly in their dashboard to review technical feasibility and submit transparent proposals.',
    },
  ];

  const featuredProjects = [
    {
      id: 'proj-1',
      title: 'Bristol City Food Waste Hub',
      scale: 'Medium Commercial',
      location: 'Bristol, South West',
      feedstock: 'Segregated restaurant & bakery scraps',
      capacity: '1,200 kg/day',
      output: '~140 m³/day biomethane',
      evidenceStatus: 'verified',
      verifiedSource: 'BioEnergy UK Annual Audit 2024',
      impact: '100% kitchen scraps diverted; 85 local homes supplied with supplemental heating.',
    },
    {
      id: 'proj-2',
      title: 'Apex BioGen Micro-Skid Bistro',
      scale: 'Small Modular',
      location: 'Bath, Somerset',
      feedstock: 'Commercial kitchen prep scraps',
      capacity: '150 kg/day',
      output: '~16 m³/day biogas (~95 kWh/day)',
      evidenceStatus: 'verified',
      verifiedSource: 'TUV Rheinland CE Sign-off #2023-CE-78',
      impact: 'Displaces 65% of commercial kitchen cooking gas with on-site digester.',
    },
    {
      id: 'proj-3',
      title: 'TerraFirm Central Agricultural AD',
      scale: 'Large Centralized',
      location: 'Taunton, Somerset',
      feedstock: 'Dairy slurry & spent brewery grains',
      capacity: '5,000 kg/day',
      output: '~520 m³/day upgraded biomethane',
      evidenceStatus: 'verified',
      verifiedSource: 'Environment Agency Permit EPR/AB1234CD',
      impact: 'Generates continuous renewable electricity and high-nitrogen organic biofertilizer.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: Title & Platform Purpose                */}
      {/* ======================================================== */}
      <section className="text-center space-y-4 max-w-2xl mx-auto pt-2 sm:pt-4">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.out }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80">
            <Leaf size={15} className="stroke-[2.2]" aria-hidden="true" />
            <span>Biogas Trust & Adoption Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-[1.15]">
            Bridging Organic Waste, Clean Biogas & Qualified Plants
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto">
            An evidence-based decision and connection framework bridging organic waste producers, biogas consumers, and qualified plant providers through published benchmarks and transparent verification.
          </p>
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* 2. HOW IT WORKS: 3-Step Circular Ecosystem               */}
      {/* ======================================================== */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
            How the Ecosystem Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            From Organic Waste to Clean Energy
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The platform does not operate physical digesters; it provides the transparent decision architecture to discover, assess, and connect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Assess Feedstock & Demand
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Kitchens, communities, and food businesses input daily scrap volumes. Consumers define their heating and cooking requirements without locking into pre-selected hardware.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Verify Evidence & Compare
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Inspect side-by-side provider capabilities. Marketing claims are explicitly separated from third-party commissioning sign-offs, with missing documents flagged in red.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Connect with Real Proposals
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Dispatch structured enquiries with vehicle access constraints and questions directly to qualified plant operators to schedule site surveys and agreements.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. BENEFITS OF BIOGAS & ORGANIC WASTE UTILISATION        */}
      {/* ======================================================== */}
      <section className="p-8 sm:p-10 rounded-3xl bg-zinc-900 text-white space-y-8 shadow-md">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
            Circularity & Climate Benefits
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why Anaerobic Digestion Matters
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Diverting organic material from landfills prevents fugitive methane release and transforms unavoidable food waste into closed-loop energy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 space-y-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 block">100%</span>
            <h4 className="text-sm font-bold text-zinc-100">Landfill Diversion</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Transforms unavoidable organic waste into biological energy and organic soil regenerator.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 space-y-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 block">~450 kg</span>
            <h4 className="text-sm font-bold text-zinc-100">Avoided CO₂e / Tonne</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Prevents uncaptured fugitive methane emissions caused by open dumping and landfill rotting.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 space-y-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 block">6–12 kWh</span>
            <h4 className="text-sm font-bold text-zinc-100">Thermal Energy / m³</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Displaces high-carbon fossil fuels, LPG canisters, and expensive grid electricity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 space-y-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 block">Zero</span>
            <h4 className="text-sm font-bold text-zinc-100">Unverified Claims</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every technical baseline is tied to documented benchmarks and transparent evidence badges.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FEATURED REFERENCE FACILITIES & CASE STUDIES          */}
      {/* ======================================================== */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
              Real Operating Precedents
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Illustrative Reference Projects
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Documented anaerobic installations demonstrating scale feasibility, feedstock handling, and verified energy outputs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleRoleSelect('consumer-household-1', '/consumer?tab=compare')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
          >
            <span>Compare all facilities</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {p.scale}
                  </span>
                  <StatusBadge status={p.evidenceStatus} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{p.title}</h3>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-0.5">{p.location}</span>
                </div>

                <div className="space-y-1 pt-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500 dark:text-zinc-400">Capacity:</span>
                    <strong className="text-zinc-800 dark:text-zinc-200">{p.capacity}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500 dark:text-zinc-400">Output:</span>
                    <strong className="text-zinc-800 dark:text-zinc-200">{p.output}</strong>
                  </div>
                  <div className="pt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                    <strong>Outcome:</strong> {p.impact}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 dark:text-zinc-500">
                <span>Verified Reference: {p.verifiedSource}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. THE 4-TIER EVIDENCE & TRUST STANDARD                  */}
      {/* ======================================================== */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 max-w-xl space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
            <ShieldCheck size={16} />
            <span>The Trust Standard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Transparent Verification Indicators
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Trust is the core differentiator. We label all technical claims with one of four evidence states:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-1.5">
            <StatusBadge status="verified" size="md" />
            <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 pt-1">Verified Evidence</h4>
            <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
              Backed by third-party certification, safety compliance audits, or accredited commissioning letters.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 space-y-1.5">
            <StatusBadge status="self-reported" size="md" />
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-200 pt-1">Self-Reported Claims</h4>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Provided directly by the provider or generator without independent third-party confirmation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-1.5">
            <StatusBadge status="pending" size="md" />
            <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 pt-1">Pending Review</h4>
            <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
              Submitted documentation undergoing administrative or technical peer review.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 space-y-1.5">
            <StatusBadge status="missing" size="md" />
            <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200 pt-1">Not Provided / Missing</h4>
            <p className="text-[11px] text-rose-900/80 dark:text-rose-300/80 leading-relaxed">
              Information unavailable or unverified. Clearly highlighted so users know what questions to ask.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. EDUCATIONAL RESOURCES & FAQ ACCORDION                 */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Clear Answers to Technical Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                      animate={shouldReduceMotion ? false : { opacity: 1, height: 'auto' }}
                      exit={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden px-4 sm:px-5 pb-5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80 pt-3"
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
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white text-center space-y-6 shadow-lg">
        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to Explore the Biogas Ecosystem?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Choose your stakeholder role to start discovering opportunities, auditing yields, and requesting structured proposals.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => handleRoleSelect('waste-restaurant-1', '/waste-provider')}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm shadow-sm hover:bg-emerald-50 transition-all cursor-pointer"
          >
            <Leaf size={18} className="text-emerald-600 stroke-[2.2]" />
            <span>I Have Organic Waste</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => handleRoleSelect('consumer-household-1', '/consumer')}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white text-amber-950 font-bold text-xs sm:text-sm shadow-sm hover:bg-amber-50 transition-all cursor-pointer"
          >
            <Flame size={18} className="text-amber-600 stroke-[2.2]" />
            <span>I Want to Use Biogas</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => handleRoleSelect('plant-apex-1', '/plant-provider')}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white text-teal-950 font-bold text-xs sm:text-sm shadow-sm hover:bg-teal-50 transition-all cursor-pointer"
          >
            <Factory size={18} className="text-teal-600 stroke-[2.2]" />
            <span>I Provide Biogas Plants</span>
          </motion.button>
        </div>

        <div className="pt-2 text-[11px] text-emerald-100/90 flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
          <span className="flex items-center gap-1.5">
            <Leaf size={12} className="stroke-[2.2]" />
            Wired: Green Fork Bistro (Bristol)
          </span>
          <span className="flex items-center gap-1.5">
            <Flame size={12} className="stroke-[2.2]" />
            Wired: Oakfield Residence (Bristol)
          </span>
          <span className="flex items-center gap-1.5">
            <Factory size={12} className="stroke-[2.2]" />
            Wired: Apex BioGen (South West)
          </span>
        </div>
      </section>
    </div>
  );
}

export default Home;
