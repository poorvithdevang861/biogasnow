import React from 'react';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom';
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

export function Layout({ children }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isHome = location.pathname === '/';

  // Understandable metaphors & workflow tabs per role
  const getRoleNav = () => {
    switch (location.pathname) {
      case '/waste-provider':
        return {
          role: 'waste_provider',
          roleLabel: 'Waste Provider',
          roleIcon: Leaf,
          roleBadgeClass: 'bg-emerald-950/70 border-emerald-800 text-emerald-300',
          accentColor: 'border-emerald-500 text-emerald-400',
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
          roleBadgeClass: 'bg-amber-950/70 border-amber-800 text-amber-300',
          accentColor: 'border-amber-500 text-amber-400',
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
          roleBadgeClass: 'bg-teal-950/70 border-teal-800 text-teal-300',
          accentColor: 'border-teal-500 text-teal-400',
          defaultTab: 'inbox',
          tabs: [
            { id: 'inbox', label: 'Client Requests', shortLabel: 'Requests', icon: Mail },
            { id: 'profile', label: 'Plant Credentials', shortLabel: 'Credentials', icon: ShieldCheck },
          ],
        };
      case '/help':
        return {
          role: 'help',
          roleLabel: 'Assisted Entry',
          roleIcon: HelpCircle,
          roleBadgeClass: 'bg-amber-950/70 border-amber-800 text-amber-300',
          accentColor: 'border-amber-500 text-amber-400',
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
    <div className="min-h-screen flex flex-col bg-[#121214] text-zinc-100">
      {/* Top Navbar: ONLY shown when entering any profile (NOT on landing page) */}
      {!isHome && (
        <header className="sticky top-0 z-40 bg-[#18181b]/95 backdrop-blur-md border-b border-zinc-800 shadow-xs">
          <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
            {/* Left: Home link and Role Badge */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/"
                className="flex items-center gap-2 group text-zinc-200 hover:text-emerald-400 transition-colors py-1 focus:outline-none"
                aria-label="Return to role selection"
                title="Return to role selection"
              >
                <Leaf size={18} className="text-emerald-400 stroke-[2.4]" aria-hidden="true" />
                <span className="font-heading font-bold text-sm sm:text-base tracking-tight text-zinc-100">
                  Biogas Trust
                </span>
              </Link>

              {nav && (
                <div className="hidden lg:flex items-center gap-1.5">
                  <span className="text-zinc-700">/</span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${nav.roleBadgeClass}`}
                  >
                    {RoleIcon && <RoleIcon size={12} className="stroke-[2.2]" />}
                    <span>{nav.roleLabel}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Middle: Understandable Workflow Tabs (NOT SLIDABLE, fixed clean layout) */}
            {nav && (
              <nav
                className="flex items-center gap-0.5 sm:gap-1.5 h-full text-xs font-medium shrink-0"
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
                      className={`h-full flex items-center gap-1.5 px-2 sm:px-3 border-b-2 whitespace-nowrap transition-colors font-medium text-xs ${
                        isActive
                          ? `${nav.accentColor} font-semibold bg-zinc-800/40`
                          : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <Icon size={14} className="shrink-0" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.shortLabel}</span>
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Right: Unified Profile Avatar & Role Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              <ProfileSwitcher />
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area - Consistent Max Width Across All Pages */}
      <main
        className={`flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 ${
          isHome ? 'py-10 sm:py-14 flex flex-col justify-center' : 'py-6 sm:py-8'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;
