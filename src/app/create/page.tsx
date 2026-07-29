'use client';

import React from 'react';
import Link from 'next/link';
import { DocumentEditor } from '@/components/documents/DocumentEditor';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { Shield } from 'lucide-react';

export default function CreateDocumentPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <GuestBanner />
      <AppNavbar />
      <div className="flex-1">
        <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Chargement de l&apos;éditeur...</div>}>
          <DocumentEditor />
        </React.Suspense>
      </div>

      {/* Legal consent footer for guest users */}
      <footer className="bg-slate-50 border-t border-slate-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-1.5 text-[10px] text-slate-400">
          <Shield className="w-3 h-3 shrink-0" />
          <span>
            En utilisant FacturaDZ, vous acceptez automatiquement nos{' '}
            <Link href="/terms" target="_blank" className="text-[#1C4A3D] font-semibold hover:underline">
              CGU
            </Link>{' '}
            et notre{' '}
            <Link href="/privacy" target="_blank" className="text-[#1C4A3D] font-semibold hover:underline">
              Politique de Confidentialité
            </Link>.
          </span>
        </div>
      </footer>
    </div>
  );
}

