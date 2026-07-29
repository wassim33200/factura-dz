'use client';

import React from 'react';
import { DocumentTotals } from '@/lib/calc/tax';
import { formatDA } from '@/lib/utils/format';

interface TotalsPanelProps {
  totals: DocumentTotals;
  paymentMethod?: string | null;
  docType?: string;
  amountInWordsText?: string;
}

export const TotalsPanel: React.FC<TotalsPanelProps> = ({
  totals,
  paymentMethod,
  docType,
  amountInWordsText,
}) => {
  const isCash = paymentMethod === 'ESPECES';
  const isFacture = (docType || 'FACTURE') === 'FACTURE';

  return (
    <div className="bg-slate-900 text-white p-5 rounded-xl shadow-lg border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-400">
          Calcul des Montants
        </h3>
        {isFacture && isCash && (
          <span className="text-[11px] font-medium bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            Droit de timbre (Espèces)
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        {/* Subtotal HT */}
        <div className="flex justify-between text-slate-300">
          <span>Sous-total HT</span>
          <span className="font-mono font-medium">{formatDA(totals.subtotalHT)}</span>
        </div>

        {/* Itemized VAT Breakdown */}
        {totals.vatBreakdown.map((vat) => (
          <div key={vat.rate} className="flex justify-between text-xs text-slate-400 pl-2">
            <span>TVA {vat.rate}% (sur {formatDA(vat.baseHT)})</span>
            <span className="font-mono">{formatDA(vat.amountTVA)}</span>
          </div>
        ))}

        {/* Total TVA */}
        <div className="flex justify-between text-slate-300">
          <span>Total TVA</span>
          <span className="font-mono font-medium">{formatDA(totals.totalTVA)}</span>
        </div>

        {/* Total TTC */}
        <div className="flex justify-between text-slate-300 font-medium pt-1 border-t border-slate-800">
          <span>Total TTC</span>
          <span className="font-mono">{formatDA(totals.totalTTC)}</span>
        </div>

        {/* Stamp Duty */}
        {totals.stampDuty > 0 && (
          <div className="flex justify-between text-amber-300 text-xs bg-amber-950/40 p-2 rounded border border-amber-800/40 font-medium">
            <span>Droit de timbre (LF 2025)</span>
            <span className="font-mono font-semibold">+{formatDA(totals.stampDuty)}</span>
          </div>
        )}

        {/* Net à Payer */}
        <div className="flex justify-between items-center text-lg font-bold text-emerald-400 bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/50 mt-2">
          <span>{totals.stampDuty > 0 ? 'Net à Payer' : 'Total TTC'}</span>
          <span className="font-mono text-xl tracking-tight">{formatDA(totals.netAPayer)}</span>
        </div>
      </div>

      {/* Amount in words summary */}
      {amountInWordsText && (
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-400 italic">
          <span className="font-semibold text-slate-300 block mb-1">Montant en lettres:</span>
          {amountInWordsText}
        </div>
      )}
    </div>
  );
};
