import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { ProfileSwitcher } from './ProfileSwitcher';

export function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Supply Waste', path: '/waste-provider' },
    { label: 'Replace Gas', path: '/consumer' },
    { label: 'Plant Network', path: '/plant-provider' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-zinc-900 font-sans">
      {/* Persistent Quiet Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 h-13 flex items-center justify-between gap-3">
          {/* Left: Brand Identity */}
          <Link
            to="/"
            className="flex items-center gap-2 text-zinc-900 hover:text-forest-900 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-forest-50 border border-forest-200/80 flex items-center justify-center text-forest-900 group-hover:scale-105 transition-transform">
              <Leaf size={15} className="stroke-[2]" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-900">
              BiogasNow
            </span>
          </Link>

          {/* Center / Right: Respective Tabs */}
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1 text-xs font-medium bg-zinc-100/80 p-0.5 rounded-lg border border-zinc-200/60">
              {navLinks.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-forest-900 text-white shadow-xs font-medium'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>

            <ProfileSwitcher />
          </div>
        </div>
      </header>

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
