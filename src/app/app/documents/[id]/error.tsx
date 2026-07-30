'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function DocumentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error loading document detail page:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl mb-2">
        !
      </div>
      <h2 className="text-xl font-bold text-slate-800">Impossible de charger ce document</h2>
      <p className="text-sm text-slate-600 max-w-md">
        Le document demandé n&apos;est pas disponible ou sa session locale a été réinitialisée.
      </p>

      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <button
          onClick={() => reset()}
          className="px-4 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition"
        >
          Réessayer
        </button>
        <Link
          href="/app/documents"
          className="px-4 py-2 text-xs font-semibold bg-[#1C4A3D] text-white rounded-lg hover:bg-[#15382e] shadow-sm transition"
        >
          Retour à la liste des documents
        </Link>
      </div>
    </div>
  );
}
