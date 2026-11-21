import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  Leaf,
  Flame,
  Factory,
  ArrowRight,
  Check,
  User,
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { staggerContainer, staggerItem, motionTokens } from '../utils/motion';

export function Home() {
  const { setProfileById } = useProfile();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const handleRoleSelect = (profileId, routePath) => {
    setProfileById(profileId);
    navigate(routePath);
  };

  return (
    <div className="space-y-10 my-auto">
      {/* Title directly above the profile cards */}
      <motion.section
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.out }}
        className="text-center space-y-4 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80">
          <Leaf size={15} className="stroke-[2.2]" aria-hidden="true" />
          <span>Biogas Trust Platform</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-[1.15]">
          Select your role to begin
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto">
          An evidence-based decision framework connecting organic waste producers, biogas consumers, and qualified plant providers.
        </p>
      </motion.section>

      {/* 3 Main Role Cards - Each wired to 1 canonical persona */}
      <section className="space-y-8">
        <motion.div
          variants={shouldReduceMotion ? undefined : staggerContainer}
          initial={shouldReduceMotion ? false : 'initial'}
          animate={shouldReduceMotion ? false : 'animate'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Role 1: Waste Provider (Wired to Green Fork Bistro) */}
          <motion.div
            variants={shouldReduceMotion ? undefined : staggerItem}
            whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
            onClick={() => handleRoleSelect('waste-restaurant-1', '/waste-provider')}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/80 dark:hover:border-emerald-600/80 transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-md group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Leaf size={26} className="text-emerald-600 dark:text-emerald-400 stroke-[2.2] group-hover:scale-105 transition-transform duration-200" aria-hidden="true" />
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Waste Provider
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  I have organic waste
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  Evaluate commercial kitchen or household food waste, calculate realistic biogas yields, find nearby digester plants, and book drop-off slots.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.2]" />
                  <span>Documented yield assumptions with sources</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.2]" />
                  <span>Nearby plant discovery & drop-off booking</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <div className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors group-hover:bg-emerald-500">
                <span>Enter as Waste Provider</span>
                <ArrowRight size={14} className="stroke-[2.2] group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
              </div>

              {/* Single Wired Persona Info */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                <span>Wired profile:</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-300 flex items-center gap-1">
                  <User size={11} className="text-emerald-600 dark:text-emerald-400 stroke-[2]" />
                  Green Fork Bistro (Bristol)
                </span>
              </div>
            </div>
          </motion.div>

          {/* Role 2: Biogas Consumer (Wired to Oakfield Eco-Terrace) */}
          <motion.div
            variants={shouldReduceMotion ? undefined : staggerItem}
            whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
            onClick={() => handleRoleSelect('consumer-household-1', '/consumer')}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/80 dark:hover:border-amber-600/80 transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-md group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Flame size={26} className="text-amber-600 dark:text-amber-400 stroke-[2.2] group-hover:scale-105 transition-transform duration-200" aria-hidden="true" />
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  Consumer
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                  I want to use biogas
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  Clarify cooking and thermal demand, choose a realistic digester scale (Small, Medium, Large), compare plant providers side-by-side, and request proposals.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-amber-600 dark:text-amber-400 shrink-0 stroke-[2.2]" />
                  <span>Choose plant size without default lock-in</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-amber-600 dark:text-amber-400 shrink-0 stroke-[2.2]" />
                  <span>Side-by-side comparison with missing evidence flagged</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <div className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors group-hover:bg-amber-500">
                <span>Enter as Consumer</span>
                <ArrowRight size={14} className="stroke-[2.2] group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
              </div>

              {/* Single Wired Persona Info */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                <span>Wired profile:</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-300 flex items-center gap-1">
                  <User size={11} className="text-amber-600 dark:text-amber-400 stroke-[2]" />
                  Oakfield Residence (Bristol)
                </span>
              </div>
            </div>
          </motion.div>

          {/* Role 3: Biogas Plant Provider (Wired to Apex BioGen) */}
          <motion.div
            variants={shouldReduceMotion ? undefined : staggerItem}
            whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
            onClick={() => handleRoleSelect('plant-apex-1', '/plant-provider')}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-teal-500/80 dark:hover:border-teal-600/80 transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-md group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Factory size={26} className="text-teal-600 dark:text-teal-400 stroke-[2.2] group-hover:scale-105 transition-transform duration-200" aria-hidden="true" />
                <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                  Plant Provider
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                  I provide biogas plants
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  Simple dashboard to review incoming project proposals and waste intake requests from local kitchens, businesses, and homes.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-teal-600 dark:text-teal-400 shrink-0 stroke-[2.2]" />
                  <span>Incoming request triage & fast reply</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-teal-600 dark:text-teal-400 shrink-0 stroke-[2.2]" />
                  <span>Plant credentials & verification checklist</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <div className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors group-hover:bg-teal-500">
                <span>Enter as Plant Provider</span>
                <ArrowRight size={14} className="stroke-[2.2] group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
              </div>

              {/* Single Wired Persona Info */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                <span>Wired profile:</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-300 flex items-center gap-1">
                  <User size={11} className="text-teal-600 dark:text-teal-400 stroke-[2]" />
                  Apex BioGen (South West)
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;