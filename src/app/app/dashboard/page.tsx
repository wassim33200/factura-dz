'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { useRepository } from '@/lib/repository/useRepository';
import { DocumentData, DocType } from '@/lib/types';
import { formatDA, formatDate } from '@/lib/utils/format';
import {
  TrendingUp,
  AlertCircle,
  FileText,
  PlusCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Send,
  Eye,
} from 'lucide-react';

export default function DashboardPage() {
  const { repositories } = useRepository();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const list = await repositories.documents.getAll();
        setDocuments(list);
      } catch (err) {
        console.error('Failed to load dashboard docs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [repositories]);

  // Aggregate Metrics
  const factures = documents.filter((d) => d.type === 'FACTURE');
  const totalRevenue = factures.reduce((sum, d) => sum + (d.amountPaid || 0), 0);
  const totalOutstanding = factures.reduce((sum, d) => sum + (d.balanceDue || 0), 0);

  const statusCounts = {
    PAYEE: documents.filter((d) => d.status === 'PAYEE').length,
    PARTIELLEMENT_PAYEE: documents.filter((d) => d.status === 'PARTIELLEMENT_PAYEE').length,
    BROUILLON: documents.filter((d) => d.status === 'BROUILLON').length,
    ENVOYE: documents.filter((d) => d.status === 'ENVOYE').length,
  };

  const recentDocs = documents.slice(0, 8);

  const docTypes: { type: DocType; label: string; desc: string }[] = [
    { type: 'FACTURE', label: 'Facture', desc: 'Vente & prestation' },
    { type: 'DEVIS', label: 'Devis', desc: 'Proposition commerciale' },
    { type: 'PROFORMA', label: 'Proforma', desc: 'Facture préalable' },
    { type: 'BON_COMMANDE', label: 'Bon de commande', desc: 'Achat & commande' },
    { type: 'BON_LIVRAISON', label: 'Bon de livraison', desc: 'Preuve de livraison' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <GuestBanner />
      <AppNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Quick Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C4A3D] tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-sm text-slate-600">
              Aperçu global de votre activité commerciale et financière en Algérie.
            </p>
          </div>

          <Link
            href="/create?type=FACTURE"
            className="self-start md:self-auto bg-[#1C4A3D] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#15382e] transition flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Nouvelle Facture</span>
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Chiffre encaissé</span>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono text-emerald-700">
              {formatDA(totalRevenue)}
            </div>
            <p className="text-xs text-slate-500">Somme des factures payées</p>
          </div>

          {/* Card 2: Outstanding Balance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Reste à recouvrer</span>
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono text-amber-700">
              {formatDA(totalOutstanding)}
            </div>
            <p className="text-xs text-slate-500">Créances clients impayées</p>
          </div>

          {/* Card 3: Paid Docs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Factures réglées</span>
              <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {statusCounts.PAYEE}
            </div>
            <p className="text-xs text-slate-500">
              {statusCounts.PARTIELLEMENT_PAYEE} partiellement payée(s)
            </p>
          </div>

          {/* Card 4: Total Documents */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total documents</span>
              <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{documents.length}</div>
            <p className="text-xs text-slate-500">Factures, devis & bons</p>
          </div>
        </div>

        {/* Document Creation Shortcuts */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Création Rapide par Type de Document
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {docTypes.map((dt) => (
              <Link
                key={dt.type}
                href={`/create?type=${dt.type}`}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1C4A3D]/40 transition group space-y-1 block"
              >
                <div className="font-bold text-slate-900 text-sm group-hover:text-[#1C4A3D] flex items-center justify-between">
                  <span>{dt.label}</span>
                  <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-[#1C4A3D]" />
                </div>
                <p className="text-[11px] text-slate-500">{dt.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Documents Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Documents récents</h2>
              <p className="text-xs text-slate-500">Les 8 derniers documents émis</p>
            </div>
            <Link
              href="/app/documents"
              className="text-xs text-[#1C4A3D] font-bold flex items-center space-x-1 hover:underline"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Chargement des données...</div>
          ) : recentDocs.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-600 font-medium">Aucun document créé pour le moment</p>
              <Link
                href="/create?type=FACTURE"
                className="inline-block bg-[#1C4A3D] text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Créer mon premier document
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-2">Numéro</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Client</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2 text-right">Net à payer</th>
                    <th className="py-3 px-2 text-center">Statut</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentDocs.map((doc) => {
                    const isPaid = doc.status === 'PAYEE';
                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-2 font-mono font-bold text-[#1C4A3D]">
                          {doc.number}
                        </td>
                        <td className="py-3 px-2 font-medium text-slate-700">{doc.type}</td>
                        <td className="py-3 px-2 font-medium text-slate-900">
                          {doc.clientSnapshot?.name || 'Client sans nom'}
                        </td>
                        <td className="py-3 px-2 text-slate-500">{formatDate(doc.issueDate)}</td>
                        <td className="py-3 px-2 text-right font-mono font-bold text-slate-900">
                          {formatDA(doc.stampDuty ? doc.subtotalHT + doc.totalTVA + doc.stampDuty : doc.totalTTC)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block ${
                              isPaid
                                ? 'bg-emerald-100 text-emerald-800'
                                : doc.status === 'BROUILLON'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Link
                            href={`/app/documents/${doc.id}`}
                            className="inline-flex items-center space-x-1 text-[#1C4A3D] font-bold text-xs hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Voir</span>
                          </Link>
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
    </div>
  );
}
