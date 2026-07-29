'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRepository } from '@/lib/repository/useRepository';
import { ShieldAlert, ArrowRight, X } from 'lucide-react';

export const GuestBanner: React.FC = () => {
  const { isGuest } = useRepository();
  const [dismissed, setDismissed] = useState(false);

  if (!isGuest || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 to-[#1C4A3D] text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-medium">
      <div className="flex items-center space-x-2">
        <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0" />
        <span>
          <strong>Mode Invité :</strong> Vos données sont conservées sur cet appareil. Créez un compte gratuit pour les sauvegarder et y accéder partout.
        </span>
      </div>

      <div className="flex items-center space-x-3 shrink-0">
        <Link
          href="/signup"
          className="bg-white text-[#1C4A3D] font-bold px-3 py-1 rounded shadow hover:bg-amber-50 transition text-xs flex items-center space-x-1"
        >
          <span>Créer un compte</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={() => setDismissed(true)}
          className="text-white/80 hover:text-white p-1"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
