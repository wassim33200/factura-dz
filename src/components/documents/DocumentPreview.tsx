'use client';

import React from 'react';
import { DocumentData } from '@/lib/types';
import { formatDA, formatDate } from '@/lib/utils/format';

const DOC_TITLES: Record<string, string> = {
  FACTURE: 'FACTURE',
  DEVIS: 'DEVIS',
  PROFORMA: 'FACTURE PROFORMA',
  BON_COMMANDE: 'BON DE COMMANDE',
  BON_LIVRAISON: 'BON DE LIVRAISON',
};

interface DocumentPreviewProps {
  document: Partial<DocumentData>;
  isPaid?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document: doc, isPaid }) => {
  const company = doc.companySnapshot || {};
  const client = doc.clientSnapshot || {};
  const lines = doc.lines || [];
  const status = doc.status;
  const showPaidStamp = isPaid || status === 'PAYEE';

  const isFacture = (doc.type || 'FACTURE') === 'FACTURE';

  return (
    <div className="relative w-full max-w-[800px] mx-auto bg-white text-slate-900 shadow-xl border border-slate-200 p-4 sm:p-8 md:p-12 font-sans text-xs sm:text-sm select-none leading-relaxed transition-all rounded-sm print:shadow-none print:border-none print:p-0">
      {/* PAYÉ Stamp Overlay */}
      {showPaidStamp && (
        <div className="absolute top-28 right-6 sm:top-36 sm:right-16 z-20 transform rotate-[-15deg] border-4 border-amber-600/80 text-amber-700 font-extrabold text-2xl sm:text-4xl tracking-widest px-4 py-1 sm:px-6 sm:py-2 rounded-lg opacity-85 shadow-lg select-none pointer-events-none">
          PAYÉ
        </div>
      )}

      {/* Header: Company Info + Logo */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 mb-6 gap-6">
        <div className="space-y-1 max-w-[60%]">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1C4A3D] tracking-tight">
            {company.name || 'Mon Entreprise DZ'}
          </h1>
          {company.address && <p className="text-slate-600">{company.address}</p>}
          {company.wilaya && <p className="text-slate-600">{company.wilaya}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500 pt-1">
            {company.phone && <span>Tél: {company.phone}</span>}
            {company.email && <span>Email: {company.email}</span>}
          </div>
        </div>

        {company.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={company.logoUrl}
            alt="Logo entreprise"
            className="h-16 w-auto object-contain max-w-[160px]"
          />
        ) : (
          <div className="h-14 w-14 bg-[#1C4A3D]/10 text-[#1C4A3D] flex items-center justify-center rounded font-bold text-lg border border-[#1C4A3D]/20">
            {(company.name || 'DZ').slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Document Meta & Client Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Document Metadata */}
        <div className="bg-slate-50/80 p-4 rounded border border-slate-200 space-y-1.5">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            {DOC_TITLES[doc.type || 'FACTURE'] || 'DOCUMENT'}
          </div>
          <div className="text-lg font-bold text-[#1C4A3D]">{doc.number || 'FAC-2026-0000'}</div>
          <div className="text-xs text-slate-600 pt-1 space-y-0.5">
            <div>Date d&apos;émission: <span className="font-medium text-slate-900">{formatDate(doc.issueDate)}</span></div>
            {doc.dueDate && (
              <div>Date d&apos;échéance: <span className="font-medium text-slate-900">{formatDate(doc.dueDate)}</span></div>
            )}
            {doc.paymentMethod && isFacture && (
              <div>Mode de paiement: <span className="font-medium text-slate-900">{doc.paymentMethod}</span></div>
            )}
          </div>
        </div>

        {/* Client Header */}
        <div className="bg-slate-50/80 p-4 rounded border border-slate-200 space-y-1">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Client / Doit :
          </div>
          <div className="text-base font-bold text-slate-900">{client.name || 'Nom du Client'}</div>
          {client.address && <p className="text-slate-600 text-xs">{client.address}</p>}
          {client.wilaya && <p className="text-slate-600 text-xs">{client.wilaya}</p>}
          <div className="text-xs text-slate-500 pt-1 space-y-0.5">
            {client.phone && <div>Tél: {client.phone}</div>}
            {client.email && <div>Email: {client.email}</div>}
            {client.nif && <div>NIF: {client.nif}</div>}
            {client.rc && <div>RC: {client.rc}</div>}
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1C4A3D] text-white text-xs uppercase tracking-wider">
              <th className="p-2.5 font-semibold rounded-tl">Désignation</th>
              <th className="p-2.5 font-semibold text-center w-16">Qté</th>
              <th className="p-2.5 font-semibold text-center w-16">Unité</th>
              <th className="p-2.5 font-semibold text-right w-24">Prix U. HT</th>
              <th className="p-2.5 font-semibold text-center w-14">Remise</th>
              <th className="p-2.5 font-semibold text-center w-14">TVA</th>
              <th className="p-2.5 font-semibold text-right w-28 rounded-tr">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {lines.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-slate-400 italic">
                  Aucun article ajouté
                </td>
              </tr>
            ) : (
              lines.map((line, idx) => (
                <tr key={line.id || idx} className="hover:bg-slate-50/50">
                  <td className="p-2.5 text-slate-900 font-medium">{line.designation || '-'}</td>
                  <td className="p-2.5 text-center text-slate-700">{line.quantity}</td>
                  <td className="p-2.5 text-center text-slate-500 text-xs">{line.unit}</td>
                  <td className="p-2.5 text-right font-mono text-slate-800">{formatDA(line.unitPrice)}</td>
                  <td className="p-2.5 text-center text-slate-500 text-xs">
                    {line.discountPct > 0 ? `${line.discountPct}%` : '-'}
                  </td>
                  <td className="p-2.5 text-center font-mono text-slate-600 text-xs">{line.tvaRate}%</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-slate-900">
                    {formatDA(line.totalHT || line.quantity * line.unitPrice)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6 mb-6">
        {/* Left: Notes & Legal Footers */}
        <div className="w-full sm:w-1/2 space-y-4">
          {doc.notes && (
            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap">
              <span className="font-semibold block text-slate-900 mb-1">Notes & Conditions:</span>
              {doc.notes}
            </div>
          )}
        </div>

        {/* Right: Tax Breakdown */}
        <div className="w-full sm:w-1/2 bg-slate-50/50 p-4 rounded border border-slate-200 space-y-2">
          <div className="flex justify-between text-xs text-slate-600 pb-1 border-b border-slate-200">
            <span>Sous-total HT</span>
            <span className="font-mono font-semibold text-slate-900">{formatDA(doc.subtotalHT)}</span>
          </div>

          {/* TVA Breakdown */}
          {doc.totalTVA !== undefined && (
            <div className="flex justify-between text-xs text-slate-600">
              <span>Total TVA</span>
              <span className="font-mono text-slate-800">{formatDA(doc.totalTVA)}</span>
            </div>
          )}

          {/* Stamp Duty */}
          {Boolean(doc.stampDuty && doc.stampDuty > 0) && (
            <div className="flex justify-between text-xs text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200/60 font-medium">
              <span>Droit de Timbre (Espèces)</span>
              <span className="font-mono font-semibold">{formatDA(doc.stampDuty)}</span>
            </div>
          )}

          {/* Total TTC / Net à payer */}
          <div className="flex justify-between text-sm sm:text-base font-bold text-white bg-[#1C4A3D] p-2.5 rounded shadow-sm">
            <span>{doc.stampDuty ? 'Net à Payer' : 'Total TTC'}</span>
            <span className="font-mono tracking-tight">{formatDA((doc.totalTTC || 0) + (doc.stampDuty || 0))}</span>
          </div>

          {/* Payments & Balance */}
          {doc.amountPaid && doc.amountPaid > 0 ? (
            <div className="pt-1 space-y-1 text-xs border-t border-slate-200">
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Montant Réglé</span>
                <span className="font-mono">{formatDA(doc.amountPaid)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold">
                <span>Reste à Payer</span>
                <span className="font-mono">{formatDA(doc.balanceDue)}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Amount in Words */}
      <div className="bg-slate-100/80 p-3 rounded text-xs text-slate-800 font-medium italic border border-slate-200 mb-8">
        {doc.amountInWords || 'Arrêté la présente facture à la somme de : zéro dinar algérien.'}
      </div>

      {/* Company Legal Identifiers Footer */}
      <div className="border-t border-slate-200 pt-4 text-[10px] sm:text-xs text-slate-500 text-center space-y-1">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {company.rc && <span><strong>RC:</strong> {company.rc}</span>}
          {company.nif && <span><strong>NIF:</strong> {company.nif}</span>}
          {company.ai && <span><strong>AI:</strong> {company.ai}</span>}
          {company.nis && <span><strong>NIS:</strong> {company.nis}</span>}
        </div>
        {company.rib && (
          <div className="text-slate-600 font-mono">
            <strong>RIB / Compte bancaire:</strong> {company.rib}
          </div>
        )}
      </div>
    </div>
  );
};
