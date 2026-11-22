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
    roleTitle: 'Waste generator',
    icon: Leaf,
    badgeClass: 'bg-zinc-100 border-zinc-200 text-zinc-800',
  },
  consumer: {
    roleTitle: 'Biogas consumer',
    icon: Flame,
    badgeClass: 'bg-zinc-100 border-zinc-200 text-zinc-800',
  },
  plant_provider: {
    roleTitle: 'Plant provider',
    icon: Factory,
    badgeClass: 'bg-zinc-100 border-zinc-200 text-zinc-800',
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
    <div className="relative shrink-0 font-sans" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-200/90 rounded-lg px-2.5 py-1.5 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-forest-900 shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer"
        title={`Active: ${activeProfile.name} (${roleConfig.roleTitle})`}
      >
        <div className={`w-5 h-5 rounded ${roleConfig.badgeClass} border flex items-center justify-center shrink-0`}>
          <RoleIcon size={12} className="stroke-[1.5]" />
        </div>

        <div className="hidden sm:flex flex-col text-left leading-none max-w-[130px]">
          <span className="text-[10px] text-zinc-500 capitalize truncate">
            {roleConfig.roleTitle}
          </span>
          <span className="text-xs font-medium text-zinc-900 truncate mt-0.5">
            {activeProfile.name}
          </span>
        </div>

        <ChevronDown
          size={12}
          className={`text-zinc-400 transition-transform duration-150 stroke-[1.5] ${
            isOpen ? 'rotate-180 text-zinc-700' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Account Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : dropdownVariants.initial}
            animate={shouldReduceMotion ? { opacity: 1 } : dropdownVariants.animate}
            exit={shouldReduceMotion ? { opacity: 0 } : dropdownVariants.exit}
            className="absolute right-0 mt-2 w-[260px] bg-white rounded-xl border border-zinc-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)] z-50 p-2.5 space-y-2 text-xs"
          >
            {/* Active User Card */}
            <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1.5">
              <div className="flex items-start gap-2">
                <div className={`w-7 h-7 rounded ${roleConfig.badgeClass} border flex items-center justify-center shrink-0 mt-0.5`}>
                  <RoleIcon size={14} className="stroke-[1.5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-zinc-500 block">
                    Signed in as
                  </span>
                  <span className="font-medium text-zinc-900 text-xs block truncate">
                    {activeProfile.name}
                  </span>
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="shrink-0 stroke-[1.5]" />
                    <span className="truncate">{activeProfile.location || 'India'}</span>
                  </span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-zinc-200/80 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Status</span>
                <span className="inline-flex items-center gap-1 text-forest-900 font-medium">
                  <ShieldCheck size={11} className="stroke-[1.5]" /> Connected
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1 pt-0.5">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full inline-flex items-center justify-center gap-1.5 p-2 rounded-lg font-medium text-xs text-rose-700 bg-rose-50/70 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              >
                <LogOut size={13} className="stroke-[1.5]" />
                <span>Sign out</span>
              </button>

              <Link
                to="/help"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors text-[11px]"
              >
                <HelpCircle size={12} className="stroke-[1.5]" />
                <span>Assisted entry checklist</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileSwitcher;
