import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Leaf, ArrowLeft, User, MapPin } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export function Layout({ children }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isHome = location.pathname === '/';
  const { activeProfile } = useProfile();

  const currentTab = searchParams.get('tab') || 'onboarding';

  // Landing page: No navbar as requested
  if (isHome) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-zinc-900 font-sans">
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-zinc-900 font-sans">
      {/* Workflow-Specific Quiet Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 h-13 flex items-center justify-between gap-3">
          {/* Left: Return to Overview / Brand */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-zinc-100 cursor-pointer"
            title="Return to Landing Page"
          >
            <ArrowLeft size={14} className="stroke-[1.75]" />
            <div className="flex items-center gap-1.5 text-zinc-900">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-900" aria-hidden="true" />
              <span className="font-semibold text-sm tracking-tight">BiogasNow</span>
            </div>
          </Link>

          {/* Center: Onboarding & Profile Tabs */}
          <nav className="flex items-center gap-1 text-xs font-medium bg-zinc-100/80 p-0.5 rounded-lg border border-zinc-200/60">
            <Link
              to={location.pathname}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentTab === 'onboarding'
                  ? 'bg-forest-900 text-white shadow-xs font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              Onboarding
            </Link>
            <Link
              to={`${location.pathname}?tab=profile`}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                currentTab === 'profile'
                  ? 'bg-forest-900 text-white shadow-xs font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              Profile & Details
            </Link>
          </nav>

          {/* Right: Active Entity Info */}
          <div className="flex items-center gap-2 text-xs">
            <div className="hidden sm:flex flex-col text-right leading-none max-w-[150px]">
              <span className="font-medium text-zinc-900 truncate">
                {activeProfile.name}
              </span>
              <span className="text-[10px] text-zinc-500 truncate mt-0.5 flex items-center justify-end gap-0.5">
                <MapPin size={9} className="stroke-[1.5]" />
                {activeProfile.location || 'India'}
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-forest-50 border border-forest-200/80 flex items-center justify-center text-forest-900 shrink-0">
              <User size={13} className="stroke-[1.75]" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
