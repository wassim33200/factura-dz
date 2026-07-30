'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { useRepository } from '@/lib/repository/useRepository';
import { DocumentData, PaymentMethod } from '@/lib/types';
import { formatDA } from '@/lib/utils/format';
import { NumberInput } from '@/components/ui/NumberInput';

import {
  Download,
  Printer,
  Edit,
  ArrowLeft,
  CreditCard,
  RefreshCw,
} from 'lucide-react';

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = use(
    (params && typeof (params as any)?.then === 'function'
      ? params
      : Promise.resolve(params)) as Promise<{ id: string }>
  );
  const id = resolvedParams?.id || '';
  const router = useRouter();
  const { repositories, isGuest } = useRepository();
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VIREMENT');
  const [paymentNote, setPaymentNote] = useState('');

  const loadDoc = async () => {
    try {
      let data = await repositories.documents.getById(id);
      
      // Fallback: if document not found in remote repo but ID has local prefix doc_
      if (!data && id.startsWith('doc_')) {
        const { LocalDocumentRepository } = await import('@/lib/repository/localRepository');
        const localRepo = new LocalDocumentRepository();
        data = await localRepo.getById(id);
      }

      setDoc(data);
      if (data) setPaymentAmount(data.balanceDue);
    } catch (err) {
      console.error('Failed to load document:', err);
      // Secondary fallback if primary getById threw (e.g. API 401/500)
      if (id.startsWith('doc_')) {
        try {
          const { LocalDocumentRepository } = await import('@/lib/repository/localRepository');
          const localRepo = new LocalDocumentRepository();
          const localData = await localRepo.getById(id);
          if (localData) {
            setDoc(localData);
            setPaymentAmount(localData.balanceDue);
          }
        } catch (localErr) {
          console.error('Local fallback failed:', localErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoc();
  }, [id, repositories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Chargement du document...
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 space-y-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Document introuvable</h2>
        <p className="text-sm text-slate-600 max-w-md">
          Ce document n&apos;existe pas ou a été créé sur un autre appareil / navigateur en mode invité.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Retour
          </button>
          <Link
            href="/app/documents"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1C4A3D] rounded-lg hover:bg-[#15382e]"
          >
            Voir tous les documents
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = doc.status === 'PAYEE';
  const isDraft = doc.status === 'BROUILLON';

  // Handle PDF Export

  const handleDownloadPdf = async () => {
    setIsPdfGenerating(true);
    try {
      if (isGuest || doc.id.startsWith('doc_')) {
        // Guest / Local mode: generate PDF blob in-browser via @react-pdf/renderer
        const { pdf } = await import('@react-pdf/renderer');
        const { DocumentPdfTemplate } = await import('@/components/pdf/DocumentPdfTemplate');

        const element = React.createElement(DocumentPdfTemplate, { doc: doc as any });
        const blob = await pdf(element as any).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.number}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        window.open(`/api/documents/${doc.id}/pdf`, '_blank');
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Handle Record Payment
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await repositories.documents.recordPayment(doc.id, {
      amount: paymentAmount,
      method: paymentMethod,
      note: paymentNote,
      date: new Date().toISOString(),
    });
    setShowPaymentModal(false);
    await loadDoc();
  };

  // Convert Devis to Facture
  const handleConvert = async () => {
    try {
      const newFacture = await repositories.documents.convertToFacture(doc.id);
      router.push(`/app/documents/${newFacture.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <div className="print:hidden">
        <GuestBanner />
        <AppNavbar />
      </div>

      {/* Action Bar Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#1C4A3D] flex items-center space-x-2">
              <span>{doc.number}</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isPaid
                    ? 'bg-emerald-100 text-emerald-800'
                    : isDraft
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {doc.status}
              </span>
            </h1>
            <p className="text-xs text-slate-500">Créé le {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('fr-FR') : ''}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit (Drafts only) */}
          {isDraft && (
            <Link
              href={`/app/documents/${doc.id}/edit`}
              className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 flex items-center space-x-1"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Modifier</span>
            </Link>
          )}

          {/* Devis -> Facture Conversion */}
          {(doc.type === 'DEVIS' || doc.type === 'PROFORMA') && (
            <button
              onClick={handleConvert}
              className="px-3.5 py-2 text-xs font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center space-x-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Convertir en Facture</span>
            </button>
          )}

          {/* Record Payment (Facture only) */}
          {doc.type === 'FACTURE' && !isPaid && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 flex items-center space-x-1.5 shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Saisir un Paiement</span>
            </button>
          )}

          {/* Print Sheet */}
          <button
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 flex items-center space-x-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={isPdfGenerating}
            className="px-4 py-2 text-xs font-semibold bg-[#1C4A3D] text-white rounded-lg hover:bg-[#15382e] flex items-center space-x-1.5 shadow-sm disabled:opacity-60 disabled:cursor-wait"
          >
            <Download className="w-4 h-4" />
            <span>{isPdfGenerating ? 'Génération...' : 'Télécharger PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main A4 Document View */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        <DocumentPreview document={doc} isPaid={isPaid} />
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Saisir un Paiement pour {doc.number}
            </h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Montant Réglé (DA) *</label>
                <NumberInput
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(val) => setPaymentAmount(val)}
                  className="w-full border-slate-300 rounded p-2 border font-mono font-bold text-base"
                />
                <p className="text-[11px] text-slate-500 pt-1">
                  Reste dû : {formatDA(doc.balanceDue)}
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mode de Règlement</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full border-slate-300 rounded p-2 border font-medium"
                >
                  <option value="VIREMENT">Virement bancaire</option>
                  <option value="ESPECES">Espèces</option>
                  <option value="CHEQUE">Chèque bancaire</option>
                  <option value="CCP">Chèque CCP</option>
                  <option value="CARTE">Carte CIB / EDAHABIA</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Note / Référence</label>
                <input
                  type="text"
                  placeholder="ex: Reçu d'espèce n° 45"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full border-slate-300 rounded p-2 border"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded font-semibold hover:bg-emerald-800"
                >
                  Valider le Règlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
