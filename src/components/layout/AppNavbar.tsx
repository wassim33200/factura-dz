'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FileText, LayoutDashboard, Users, Package, Settings, LogOut, Plus, Menu, X } from 'lucide-react';

export const AppNavbar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/app/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/app/documents', label: 'Documents', icon: FileText },
    { href: '/app/clients', label: 'Clients (CRM)', icon: Users },
    { href: '/app/products', label: 'Catalogue', icon: Package },
    { href: '/app/settings/company', label: 'Entreprise', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-[#1C4A3D] text-white flex items-center justify-center rounded-lg font-extrabold text-lg shadow">
                DZ
              </div>
              <span className="font-extrabold text-xl text-[#1C4A3D] tracking-tight">FacturaDZ</span>
            </Link>

            {/* Desktop Links */}
            <nav className="hidden md:flex space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition ${
                      active
                        ? 'bg-[#1C4A3D]/10 text-[#1C4A3D]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/app/documents/new?type=FACTURE"
              className="bg-[#1C4A3D] text-white px-3 sm:px-3.5 py-2 rounded-lg font-semibold text-xs flex items-center space-x-1 hover:bg-[#15382e] shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Créer une facture</span>
              <span className="sm:hidden">Créer</span>
            </Link>

            {session?.user ? (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-2 sm:pl-3">
                <span className="text-xs font-medium text-slate-700 hidden sm:inline">
                  {session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition hidden md:block"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
                >
                  Se connecter
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg md:hidden transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center space-x-3 transition ${
                    active
                      ? 'bg-[#1C4A3D]/10 text-[#1C4A3D]'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#1C4A3D]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-100 pt-3 flex flex-col space-y-2">
            {session?.user ? (
              <>
                <div className="text-xs text-slate-500 font-medium px-3">
                  Connecté: <strong className="text-slate-800">{session.user.email}</strong>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-3 py-2 text-xs font-semibold text-[#1C4A3D] bg-[#1C4A3D]/10 rounded-lg"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
