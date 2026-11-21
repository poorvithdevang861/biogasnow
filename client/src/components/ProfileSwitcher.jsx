import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import {
  Leaf,
  Flame,
  Factory,
  ChevronDown,
  Check,
  MapPin,
  HelpCircle,
  Home,
  User,
} from 'lucide-react';

const WIRED_ROLES = [
  {
    roleKey: 'waste_provider',
    profileId: 'waste-restaurant-1',
    roleTitle: 'Waste Provider',
    personaName: 'Green Fork Bistro',
    shortName: 'Green Fork',
    personaDetail: 'Urban Restaurant · 150 kg/day',
    location: 'Bristol Central',
    icon: Leaf,
    route: '/waste-provider',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
  },
  {
    roleKey: 'consumer',
    profileId: 'consumer-household-1',
    roleTitle: 'Biogas Consumer',
    personaName: 'Oakfield Eco-Terrace',
    shortName: 'Oakfield',
    personaDetail: 'Domestic Residence · Cooking & Heat',
    location: 'Bristol East',
    icon: Flame,
    route: '/consumer',
    accentColor: 'text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300',
  },
  {
    roleKey: 'plant_provider',
    profileId: 'plant-apex-1',
    roleTitle: 'Plant Provider',
    personaName: 'Apex BioGen Engineering',
    shortName: 'Apex BioGen',
    personaDetail: 'Commercial Turnkey AD Systems',
    location: 'South West & Midlands',
    icon: Factory,
    route: '/plant-provider',
    accentColor: 'text-teal-600 dark:text-teal-400',
    badgeClass: 'bg-teal-50 dark:bg-teal-950/80 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300',
  },
];

export function ProfileSwitcher() {
  const { activeProfile, setProfileById } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Find currently active role definition
  const currentRole = WIRED_ROLES.find(
    (r) => r.roleKey === activeProfile.role || r.profileId === activeProfile.id
  ) || WIRED_ROLES[0];

  const RoleIcon = currentRole.icon;

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

  const handleSelectRole = (roleDef) => {
    setProfileById(roleDef.profileId);
    setIsOpen(false);
    navigate(roleDef.route);
  };

  return (
    <div className="relative shrink-0" ref={containerRef}>
      {/* Compact profile icon & switcher trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl px-2 sm:px-2.5 py-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 shadow-xs"
        title={`Profile: ${currentRole.personaName} (${currentRole.roleTitle})`}
      >
        <div className={`w-6 h-6 rounded-lg ${currentRole.badgeClass} border flex items-center justify-center shrink-0`}>
          <RoleIcon size={13} className="stroke-[2.2]" />
        </div>

        <div className="hidden sm:flex flex-col text-left leading-none max-w-[100px] md:max-w-[130px]">
          <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider truncate">
            {currentRole.roleTitle}
          </span>
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 truncate mt-0.5">
            {currentRole.shortName}
          </span>
        </div>

        <ChevronDown
          size={12}
          className={`text-zinc-400 dark:text-zinc-500 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-zinc-700 dark:text-zinc-300' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Unified Profile & Role Switcher Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Switch active role and persona"
          className="absolute right-0 mt-2 w-[290px] sm:w-[320px] bg-white dark:bg-[#18181b] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 p-2 space-y-2 text-xs"
        >
          {/* Active Profile Info Header */}
          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-2.5">
            <div className={`w-8 h-8 rounded-lg ${currentRole.badgeClass} border flex items-center justify-center shrink-0 mt-0.5`}>
              <RoleIcon size={16} className="stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                Active Persona
              </span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs block truncate">
                {currentRole.personaName}
              </span>
              <span className="text-[11px] text-zinc-600 dark:text-zinc-400 block truncate">
                {currentRole.personaDetail}
              </span>
            </div>
          </div>

          {/* Switch Role Options */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 pt-1 block">
              Switch Role
            </span>
            {WIRED_ROLES.map((roleDef) => {
              const Icon = roleDef.icon;
              const isSelected = activeProfile.role === roleDef.roleKey;

              return (
                <button
                  key={roleDef.roleKey}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectRole(roleDef)}
                  className={`w-full text-left p-2 rounded-xl transition-colors flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold border border-zinc-300 dark:border-zinc-700'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon size={15} className={`${roleDef.accentColor} shrink-0 stroke-[2.2]`} aria-hidden="true" />
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 block truncate">
                        {roleDef.roleTitle}
                      </span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block truncate">
                        {roleDef.personaName} · {roleDef.location}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400 stroke-[2.5] shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Useful Quick Links inside Profile Menu */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
            <Link
              to="/help"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <HelpCircle size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Assisted Data Entry Checklist</span>
            </Link>

            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <Home size={14} className="shrink-0" />
              <span>Back to Role Selection</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSwitcher;
