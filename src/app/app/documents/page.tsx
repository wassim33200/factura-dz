'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { useRepository } from '@/lib/repository/useRepository';
import { DocumentData, DocType, DocStatus, PaymentMethod } from '@/lib/types';
import { formatDA, formatDate } from '@/lib/utils/format';
import { NumberInput } from '@/components/ui/NumberInput';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  CreditCard,
  RefreshCw,
  Trash2,
  Edit,
  CheckCircle2,
} from 'lucide-react';

export default function DocumentsPage() {
  const { repositories } = useRepository();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Record Payment Dialog state
  const [paymentDoc, setPaymentDoc] = useState<DocumentData | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VIREMENT');
  const [paymentNote, setPaymentNote] = useState('');

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const list = await repositories.documents.getAll();
      setDocuments(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [repositories]);

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.clientSnapshot?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || doc.type === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || doc.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Payment Submit Handler
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentDoc || !paymentAmount) return;

    try {
      await repositories.documents.recordPayment(paymentDoc.id, {
        amount: paymentAmount,
        method: paymentMethod,
        note: paymentNote,
        date: new Date().toISOString(),
      });
      setPaymentDoc(null);
      await loadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  // Convert Devis/Proforma to Facture Handler
  const handleConvert = async (docId: string) => {
    try {
      const newFacture = await repositories.documents.convertToFacture(docId);
      await loadDocuments();
      alert(`Facture ${newFacture.number} créée avec succès !`);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Draft
  const handleDelete = async (docId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce brouillon ?')) return;
    await repositories.documents.delete(docId);
    await loadDocuments();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <GuestBanner />
      <AppNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C4A3D]">
              Gestion des Documents
            </h1>
            <p className="text-sm text-slate-600">
              Liste globale de vos factures, devis, proformas et bons commerciaux.
            </p>
          </div>

          <Link
            href="/create?type=FACTURE"
            className="bg-[#1C4A3D] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-[#15382e] transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Document</span>
          </Link>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par n° ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-[#1C4A3D] focus:border-[#1C4A3D]"
            />
          </div>

          {/* Select Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5" />
              <span className="font-semibold">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-xs border-slate-300 rounded-lg p-1.5 border"
              >
                <option value="ALL">Tous les types</option>
                <option value="FACTURE">Factures</option>
                <option value="DEVIS">Devis</option>
                <option value="PROFORMA">Proformas</option>
                <option value="BON_COMMANDE">Bons de commande</option>
                <option value="BON_LIVRAISON">Bons de livraison</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <span className="font-semibold">Statut:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs border-slate-300 rounded-lg p-1.5 border"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="BROUILLON">Brouillon</option>
                <option value="ENVOYE">Envoyé</option>
                <option value="ACCEPTE">Accepté</option>
                <option value="PAYEE">Payée</option>
                <option value="PARTIELLEMENT_PAYEE">Partiellement payée</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Chargement de la liste...</div>
          ) : filteredDocs.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-600">Aucun document trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">Numéro</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-4 text-right">Net à payer</th>
                    <th className="py-3 px-3 text-center">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => {
                    const isPaid = doc.status === 'PAYEE';
                    const netTotal = doc.stampDuty
                      ? doc.subtotalHT + doc.totalTVA + doc.stampDuty
                      : doc.totalTTC;

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1C4A3D]">
                          {doc.number}
                        </td>
                        <td className="py-3.5 px-3 font-medium text-slate-700">{doc.type}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-900">
                          {doc.clientSnapshot?.name || 'Sans client'}
                        </td>
                        <td className="py-3.5 px-3 text-slate-500">{formatDate(doc.issueDate)}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                          {formatDA(netTotal)}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block ${
                              isPaid
                                ? 'bg-emerald-100 text-emerald-800'
                                : doc.status === 'BROUILLON'
                                ? 'bg-slate-100 text-slate-700'
                                : doc.status === 'ACCEPTE'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <Link
                            href={`/app/documents/${doc.id}`}
                            className="p-1.5 text-slate-600 hover:text-[#1C4A3D] rounded hover:bg-slate-100 inline-block"
                            title="Voir"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Devis -> Facture Conversion */}
                          {(doc.type === 'DEVIS' || doc.type === 'PROFORMA') && (
                            <button
                              onClick={() => handleConvert(doc.id)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 inline-block"
                              title="Convertir en Facture"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}

                          {/* Record Payment */}
                          {doc.type === 'FACTURE' && !isPaid && (
                            <button
                              onClick={() => {
                                setPaymentDoc(doc);
                                setPaymentAmount(doc.balanceDue || netTotal);
                              }}
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 rounded hover:bg-emerald-50 inline-block"
                              title="Enregistrer un paiement"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Draft */}
                          {doc.status === 'BROUILLON' && (
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 inline-block"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Record Payment Modal */}
      {paymentDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Saisir un Paiement pour {paymentDoc.number}
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
                  Reste dû : {formatDA(paymentDoc.balanceDue)}
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
                  placeholder="ex: Chèque n° 123456"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full border-slate-300 rounded p-2 border"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setPaymentDoc(null)}
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
