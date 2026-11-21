import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useProfile } from '../context/ProfileContext';
import {
  Leaf,
  Flame,
  Factory,
  ChevronDown,
  MapPin,
  HelpCircle,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { dropdownVariants } from '../utils/motion';

const ROLE_CONFIGS = {
  waste_provider: {
    roleTitle: 'Waste Provider',
    icon: Leaf,
    badgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    accentColor: 'text-emerald-700',
  },
  consumer: {
    roleTitle: 'Biogas Consumer',
    icon: Flame,
    badgeClass: 'bg-amber-50 border-amber-200 text-amber-800',
    accentColor: 'text-amber-700',
  },
  plant_provider: {
    roleTitle: 'Plant Provider',
    icon: Factory,
    badgeClass: 'bg-teal-50 border-teal-200 text-teal-800',
    accentColor: 'text-teal-700',
  },
};

export function ProfileSwitcher() {
  const { activeProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const roleConfig = ROLE_CONFIGS[activeProfile.role] || ROLE_CONFIGS.waste_provider;
  const RoleIcon = roleConfig.icon;

  // Close on click outside or escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSignOut = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="relative shrink-0" ref={containerRef}>
      {/* User Avatar & Menu Trigger */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-2.5 py-1.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs cursor-pointer"
        title={`Active: ${activeProfile.name} (${roleConfig.roleTitle})`}
      >
        <div className={`w-6 h-6 rounded-lg ${roleConfig.badgeClass} border flex items-center justify-center shrink-0`}>
          <RoleIcon size={13} className="stroke-[2.2]" />
        </div>

        <div className="hidden sm:flex flex-col text-left leading-none max-w-[120px] md:max-w-[140px]">
          <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider truncate">
            {roleConfig.roleTitle}
          </span>
          <span className="text-xs font-semibold text-zinc-900 truncate mt-0.5">
            {activeProfile.name}
          </span>
        </div>

        <ChevronDown
          size={12}
          className={`text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-zinc-700' : ''
          }`}
          aria-hidden="true"
        />
      </motion.button>

      {/* Clean User Account Dropdown (Sign Out ONLY, no clutter of other profiles) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : dropdownVariants.initial}
            animate={shouldReduceMotion ? { opacity: 1 } : dropdownVariants.animate}
            exit={shouldReduceMotion ? { opacity: 0 } : dropdownVariants.exit}
            className="absolute right-0 mt-2 w-[270px] sm:w-[290px] bg-white rounded-2xl border border-zinc-200 shadow-xl z-50 p-3 space-y-3 text-xs"
          >
            {/* Active User Card */}
            <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/80 space-y-2">
              <div className="flex items-start gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${roleConfig.badgeClass} border flex items-center justify-center shrink-0 mt-0.5`}>
                  <RoleIcon size={16} className="stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Signed in as
                  </span>
                  <span className="font-bold text-zinc-900 text-xs block truncate">
                    {activeProfile.name}
                  </span>
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="shrink-0" />
                    <span className="truncate">{activeProfile.location || 'India'}</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Account Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck size={11} /> Connected
                </span>
              </div>
            </div>

            {/* Sign Out Action Button */}
            <div className="space-y-1.5 pt-1">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSignOut}
                className="w-full inline-flex items-center justify-center gap-2 p-2.5 rounded-xl font-semibold text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs cursor-pointer"
              >
                <LogOut size={14} className="stroke-[2.2]" />
                <span>Sign out</span>
              </motion.button>

              <Link
                to="/help"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors text-[11px]"
              >
                <HelpCircle size={12} className="text-amber-600 shrink-0" />
                <span>Assisted Entry Checklist</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileSwitcher;
