'use client';

import React from 'react';
import { DocumentEditor } from '@/components/documents/DocumentEditor';
import { AppNavbar } from '@/components/layout/AppNavbar';

export default function NewDocumentPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AppNavbar />
      <div className="flex-1">
        <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Chargement de l'éditeur...</div>}>
          <DocumentEditor />
        </React.Suspense>
      </div>
    </div>
  );
}
