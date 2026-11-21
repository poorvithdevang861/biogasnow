import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ProfileSwitcher } from './ProfileSwitcher';
import {
  Leaf,
  Flame,
  Factory,
  HelpCircle,
  Sparkles,
  MapPin,
  Clock,
  Scale,
  Layers,
  Mail,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { motionTokens } from '../utils/motion';

export function Layout({ children }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const isHome = location.pathname === '/';

  // Understandable metaphors & workflow tabs per role
  const getRoleNav = () => {
    switch (location.pathname) {
      case '/waste-provider':
        return {
          role: 'waste_provider',
          roleLabel: 'Waste Provider',
          roleIcon: Leaf,
          roleBadgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          accentColor: 'text-emerald-700',
          activeIndicatorBg: 'bg-emerald-600',
          defaultTab: 'assessment',
          tabs: [
            { id: 'assessment', label: 'Calculate Yield', shortLabel: 'Yield', icon: Sparkles },
            { id: 'plants', label: 'Nearby Plants', shortLabel: 'Plants', icon: MapPin },
            { id: 'enquiries', label: 'My Bookings', shortLabel: 'Bookings', icon: Clock },
            { id: 'impact', label: 'Green Impact', shortLabel: 'Impact', icon: Leaf },
          ],
        };
      case '/consumer':
        return {
          role: 'consumer',
          roleLabel: 'Biogas Consumer',
          roleIcon: Flame,
          roleBadgeClass: 'bg-amber-50 border-amber-200 text-amber-800',
          accentColor: 'text-amber-700',
          activeIndicatorBg: 'bg-amber-600',
          defaultTab: 'sizing',
          tabs: [
            { id: 'sizing', label: 'Calculate Need', shortLabel: 'Need', icon: Flame },
            { id: 'compare', label: 'Compare Plants', shortLabel: 'Compare', icon: Scale },
            { id: 'enquiries', label: 'My Proposals', shortLabel: 'Proposals', icon: Clock },
            { id: 'scales', label: 'Plant Sizes', shortLabel: 'Sizes', icon: Layers },
          ],
        };
      case '/plant-provider':
        return {
          role: 'plant_provider',
          roleLabel: 'Plant Provider',
          roleIcon: Factory,
          roleBadgeClass: 'bg-teal-50 border-teal-200 text-teal-800',
          accentColor: 'text-teal-700',
          activeIndicatorBg: 'bg-teal-600',
          defaultTab: 'inbox',
          tabs: [
            { id: 'inbox', label: 'Client Requests', shortLabel: 'Requests', icon: Mail },
            { id: 'evidence', label: 'Evidence Manager', shortLabel: 'Evidence', icon: ShieldCheck },
            { id: 'profile', label: 'Plant Specs', shortLabel: 'Specs', icon: Factory },
          ],
        };
      case '/help':
        return {
          role: 'help',
          roleLabel: 'Assisted Entry',
          roleIcon: HelpCircle,
          roleBadgeClass: 'bg-amber-50 border-amber-200 text-amber-800',
          accentColor: 'text-amber-700',
          activeIndicatorBg: 'bg-amber-600',
          defaultTab: 'checklist',
          tabs: [
            { id: 'checklist', label: 'Site Checklist', shortLabel: 'Checklist', icon: FileText },
          ],
        };
      default:
        return null;
    }
  };

  const nav = getRoleNav();
  const currentTab = searchParams.get('tab') || nav?.defaultTab || '';

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const RoleIcon = nav?.roleIcon;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-zinc-900 transition-colors duration-150 relative">
      {/* Top Navbar: ONLY shown when entering any profile (NOT on landing page) */}
      {!isHome && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs">
          <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
            {/* Left: Home link and Role Badge */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/"
                className="flex items-center gap-2 group text-zinc-800 hover:text-emerald-700 transition-colors py-1 focus:outline-none"
                aria-label="Return to role selection"
                title="Return to role selection"
              >
                <Leaf size={18} className="text-emerald-600 stroke-[2.2] group-hover:scale-105 transition-transform duration-150" aria-hidden="true" />
                <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-900">
                  Biogas Trust
                </span>
              </Link>

              {nav && (
                <div className="hidden lg:flex items-center gap-1.5">
                  <span className="text-zinc-300">/</span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${nav.roleBadgeClass}`}
                  >
                    {RoleIcon && <RoleIcon size={12} className="stroke-[2.2]" />}
                    <span>{nav.roleLabel}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Middle: Understandable Workflow Tabs with Motion Sliding Indicator */}
            {nav && (
              <nav
                className="flex items-center gap-1 sm:gap-2 h-full text-xs font-medium shrink-0 relative"
                aria-label="Workflow tabs"
              >
                {nav.tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      className={`relative h-full flex items-center gap-1.5 px-2.5 sm:px-3 text-xs font-medium transition-colors cursor-pointer select-none ${
                        isActive
                          ? `${nav.accentColor} font-semibold`
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <Icon size={15} className="shrink-0 stroke-[2]" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.shortLabel}</span>

                      {/* Smooth spring sliding bottom indicator */}
                      {isActive && (
                        <motion.div
                          layoutId={shouldReduceMotion ? undefined : 'activeRoleTabIndicator'}
                          className={`absolute inset-x-0 bottom-0 h-0.5 ${nav.activeIndicatorBg}`}
                          transition={motionTokens.spring.snappy}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Right: Unified Profile Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              <ProfileSwitcher />
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area - Consistent Max Width Across All Pages */}
      <main
        className={`flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 ${
          isHome ? 'py-8 sm:py-12 flex flex-col justify-center' : 'py-6 sm:py-8'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;
