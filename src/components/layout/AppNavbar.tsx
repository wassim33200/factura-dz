'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FileText, LayoutDashboard, Users, Package, Settings, LogOut, Plus, Shield } from 'lucide-react';

export const AppNavbar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { href: '/app/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/app/documents', label: 'Documents', icon: FileText },
    { href: '/app/clients', label: 'Clients (CRM)', icon: Users },
    { href: '/app/products', label: 'Catalogue', icon: Package },
    { href: '/app/settings/company', label: 'Entreprise', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
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
          <div className="flex items-center space-x-3">
            <Link
              href="/app/documents/new?type=FACTURE"
              className="bg-[#1C4A3D] text-white px-3.5 py-2 rounded-lg font-semibold text-xs flex items-center space-x-1 hover:bg-[#15382e] shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une facture</span>
            </Link>

            {session?.user ? (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                <span className="text-xs font-medium text-slate-700 hidden sm:inline">
                  {session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
