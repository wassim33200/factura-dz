'use client';

import React from 'react';
import { DocumentEditor } from '@/components/documents/DocumentEditor';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { AppNavbar } from '@/components/layout/AppNavbar';

export default function CreateDocumentPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <GuestBanner />
      <AppNavbar />
      <div className="flex-1">
        <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Chargement de l'éditeur...</div>}>
          <DocumentEditor />
        </React.Suspense>
      </div>
    </div>
  );
}
