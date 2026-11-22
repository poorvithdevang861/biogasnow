import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Leaf,
  Flame,
  Factory,
  ArrowLeft,
} from 'lucide-react';
import { ProfileSwitcher } from './ProfileSwitcher';

export function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const getRoleHeader = () => {
    switch (location.pathname) {
      case '/waste-provider':
        return {
          title: 'Waste Generator Onboarding',
          badge: 'Generator',
          badgeClass: 'bg-forest-50 text-forest-900 border-forest-200',
          icon: Leaf,
        };
      case '/consumer':
        return {
          title: 'Biogas Consumer Sizing',
          badge: 'Consumer',
          badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
          icon: Flame,
        };
      case '/plant-provider':
        return {
          title: 'Plant Operator Setup',
          badge: 'Plant Operator',
          badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
          icon: Factory,
        };
      case '/help':
        return {
          title: 'Practical Help & Checklist',
          badge: 'Guide',
          badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
          icon: Leaf,
        };
      default:
        return null;
    }
  };

  const header = getRoleHeader();
  const Icon = header?.icon;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-zinc-900 font-sans">
      {/* Top Navbar: ONLY shown when in a role workflow */}
      {!isHome && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 h-13 flex items-center justify-between gap-3">
            {/* Left: Back to Home + Role Indicator */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-zinc-100"
                title="Return to Home"
              >
                <ArrowLeft size={14} className="stroke-[1.75]" />
                <span className="hidden sm:inline">Overview</span>
              </Link>

              {header && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-300">/</span>
                  <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${header.badgeClass}`}>
                    {Icon && <Icon size={12} className="stroke-[2]" />}
                    <span>{header.title}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Quick Role Links & Profile */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium">
                <Link
                  to="/waste-provider"
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    location.pathname === '/waste-provider'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  Generator
                </Link>
                <Link
                  to="/consumer"
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    location.pathname === '/consumer'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  Consumer
                </Link>
                <Link
                  to="/plant-provider"
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    location.pathname === '/plant-provider'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  Operator
                </Link>
              </div>

              <ProfileSwitcher />
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 ${
          isHome ? 'py-8 sm:py-12 flex flex-col justify-center' : 'py-6 sm:py-8'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;
