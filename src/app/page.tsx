'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  Zap,
  CheckCircle,
  ArrowRight,
  Calculator,
  Building,
  Users,
  Package,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { formatDA } from '@/lib/utils/format';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Est-ce vraiment 100% gratuit et sans frais cachés ?",
      a: "Oui, FacturaDZ est totalement gratuit et illimité. Aucun abonnement, aucune carte bancaire requise, aucun filigrane sur vos factures PDF."
    },
    {
      q: "Faut-il obligatoirement créer un compte pour l'utiliser ?",
      a: "Non ! Vous pouvez créer vos factures immédiatement en mode invité. Vos données restent enregistrées sur votre appareil. Vous ne créez un compte que si vous souhaitez synchroniser vos factures entre plusieurs appareils."
    },
    {
      q: "Le droit de timbre (Loi de Finances 2025) est-il calculé automatiquement ?",
      a: "Absolument. Dès que vous sélectionnez un paiement en espèces pour une facture, le droit de timbre (1%, 1.5% ou 2% selon la tranche, min. 5 DA) est automatiquement calculé et ajouté au Net à Payer."
    },
    {
      q: "La somme totale en lettres (en français) est-elle générée automatiquement ?",
      a: "Oui ! Le montant net à payer est traduit instantanément en lettres en français avec la mention légale complète ('Arrêté la présente facture à la somme de... dinars algériens') conformément aux règles de grammaire et d'accord."
    },
    {
      q: "Mes données d'entreprise et de clients sont-elles en sécurité ?",
      a: "Vos données restent strictement confidentielles. En mode invité, elles sont stockées uniquement dans le navigateur de votre appareil (IndexedDB). En mode compte, vos données sont chiffrées et sauvegardées sur des serveurs sécurisés."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-slate-900 font-sans flex flex-col selection:bg-[#1C4A3D] selection:text-white">
      {/* Sticky Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-9 w-9 bg-[#1C4A3D] text-white flex items-center justify-center rounded-xl font-extrabold text-lg shadow-md">
              DZ
            </div>
            <span className="font-extrabold text-xl text-[#1C4A3D] tracking-tight">FacturaDZ</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#1C4A3D] transition hidden sm:inline-block"
            >
              Se connecter
            </Link>
            <Link
              href="/create?type=FACTURE"
              className="bg-[#1C4A3D] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-[#15382e] hover:shadow-lg transition flex items-center space-x-1.5"
            >
              <span>Créer une facture</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#1C4A3D]/10 text-[#1C4A3D] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#1C4A3D]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Facturation Conforme Algérie • Loi de Finances 2025</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Vos factures &amp; devis conformes en <span className="text-[#1C4A3D] underline decoration-amber-500 decoration-4">60 secondes</span>.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Le logiciel de facturation gratuit conçu pour les indépendants et PME algériennes.
              TVA (19%/9%), droit de timbre sur espèces et montant en lettres calculés automatiquement sans aucune erreur.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/create?type=FACTURE"
                className="bg-[#1C4A3D] text-white px-7 py-3.5 rounded-2xl text-sm font-bold shadow-xl hover:bg-[#15382e] transition flex items-center justify-center space-x-2 hover:scale-[1.02]"
              >
                <span>Créer une facture sans compte</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="bg-white border-2 border-slate-300 text-slate-800 px-7 py-3.5 rounded-2xl text-sm font-bold hover:bg-slate-50 transition text-center"
              >
                Créer un compte gratuit
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap gap-6 text-xs font-semibold text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>100% Gratuit &amp; Illimité</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sans carte bancaire</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>PDF A4 Instantané</span>
              </div>
            </div>
          </div>

          {/* Right Hero Live Interactive Mock Invoice Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 space-y-4 transform rotate-1 hover:rotate-0 transition duration-300">
              {/* PAYÉ Stamp */}
              <div className="absolute top-10 right-8 transform rotate-[-15deg] border-4 border-amber-600/80 text-amber-700 font-black text-2xl tracking-widest px-4 py-1 rounded-md opacity-85 shadow-md">
                PAYÉ
              </div>

              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <div className="text-lg font-black text-[#1C4A3D]">SARL Djazair Services</div>
                  <p className="text-[11px] text-slate-500">123 Rue Hassiba Ben Bouali, Alger</p>
                  <p className="text-[10px] text-slate-400 font-mono">RC: 16/00-1234567B26 | NIF: 002616123456789</p>
                </div>
                <div className="h-10 w-10 bg-[#1C4A3D]/10 text-[#1C4A3D] font-bold text-sm flex items-center justify-center rounded-lg">
                  DZ
                </div>
              </div>

              {/* Doc Title */}
              <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-[#1C4A3D] block text-sm">FACTURE N° FAC-2026-0042</span>
                  <span className="text-slate-500">Date: 29/07/2026</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Réglée
                </span>
              </div>

              {/* Client Box */}
              <div className="text-xs bg-slate-50/60 p-2.5 rounded border border-slate-100 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Doit :</span>
                <div className="font-bold text-slate-900">EURL El Amel Tech</div>
                <div className="text-slate-500 text-[11px]">Zone Industrielle Rouiba, Alger</div>
              </div>

              {/* Lines Table */}
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-[#1C4A3D] text-white text-[10px] uppercase">
                    <th className="p-1.5">Prestation</th>
                    <th className="p-1.5 text-center">Qté</th>
                    <th className="p-1.5 text-right">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-[11px]">
                  <tr>
                    <td className="p-1.5 font-medium">Développement Web SaaS</td>
                    <td className="p-1.5 text-center">1</td>
                    <td className="p-1.5 text-right font-mono font-semibold">34 500,00 DA</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Sous-total HT</span>
                  <span className="font-mono">34 500,00 DA</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>TVA 19%</span>
                  <span className="font-mono">6 555,00 DA</span>
                </div>
                <div className="flex justify-between text-amber-300 text-[11px]">
                  <span>Droit de timbre (Espèces 1.5%)</span>
                  <span className="font-mono">616,00 DA</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-400 pt-1 border-t border-slate-800">
                  <span>Net à Payer</span>
                  <span className="font-mono">41 671,00 DA</span>
                </div>
              </div>

              {/* Words */}
              <div className="bg-slate-100 p-2 rounded text-[10px] italic text-slate-700">
                Arrêté la présente facture à la somme de : Quarante et un mille six cent soixante-onze dinars algériens.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#1C4A3D] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">5</div>
            <div className="text-xs sm:text-sm font-medium text-slate-200 mt-1">Types de documents conformes</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">0 DA</div>
            <div className="text-xs sm:text-sm font-medium text-slate-200 mt-1">Gratuit pour toujours</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">100%</div>
            <div className="text-xs sm:text-sm font-medium text-slate-200 mt-1">Automatisation fiscale TVA &amp; Timbre</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">1 Clic</div>
            <div className="text-xs sm:text-sm font-medium text-slate-200 mt-1">Conversion Devis vers Facture</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tout ce dont vous avez besoin pour facturer en Algérie
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Gagnez du temps et évitez les erreurs de calcul fiscal grâce à notre moteur automatisé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-10 h-10 bg-[#1C4A3D]/10 text-[#1C4A3D] flex items-center justify-center rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">5 Documents Commerciaux</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Créez des Factures, Devis, Factures Proforma, Bons de Commande et Bons de Livraison partageant un même répertoire.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-700 flex items-center justify-center rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Fiscalité Algérienne Intégrée</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              TVA (19%/9%), droit de timbre (espèces Loi de Finances 2025) et montant en lettres rédigé en français automatique.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-500/10 text-purple-700 flex items-center justify-center rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Répertoire Clients (CRM)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stockez les identifiants fiscaux de vos clients (NIF, RC, Adresse, Wilaya) et suivez le solde dû par client.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-10 h-10 bg-blue-500/10 text-blue-700 flex items-center justify-center rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Catalogue Produits &amp; Tarifs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enregistrez vos articles, prestations et taux de TVA par défaut pour préremplir vos factures en un seul clic.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-700 flex items-center justify-center rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Conversion Devis vers Facture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Un devis accepté par un client ? Convertissez-le en facture officielle avec numérotation atomique en un clic.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-10 h-10 bg-rose-500/10 text-rose-700 flex items-center justify-center rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Mode Invité &amp; Export PDF</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Utilisable sans inscription. Vos données restent sur votre appareil (IndexedDB). Export PDF A4 imprimable instantané.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Comment ça marche ?</h2>
            <p className="text-xs sm:text-sm text-slate-600">3 étapes simples pour émettre vos factures</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-10 h-10 bg-[#1C4A3D] text-white rounded-full flex items-center justify-center font-extrabold mx-auto">1</div>
              <h3 className="font-bold text-slate-900">Choisissez le type</h3>
              <p className="text-xs text-slate-600">Facture, devis, proforma ou bon de commande/livraison.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-10 h-10 bg-[#1C4A3D] text-white rounded-full flex items-center justify-center font-extrabold mx-auto">2</div>
              <h3 className="font-bold text-slate-900">Remplissez les lignes</h3>
              <p className="text-xs text-slate-600">Sélectionnez vos articles et clients. Les montants et taxes se calculent en direct.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-10 h-10 bg-[#1C4A3D] text-white rounded-full flex items-center justify-center font-extrabold mx-auto">3</div>
              <h3 className="font-bold text-slate-900">Téléchargez le PDF</h3>
              <p className="text-xs text-slate-600">Téléchargez votre PDF A4 conforme ou imprimez-le directement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Questions Fréquentes (FAQ)</h2>
          <p className="text-xs sm:text-sm text-slate-600">Tout savoir sur l&apos;utilisation de FacturaDZ</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex justify-between items-center font-bold text-sm text-slate-900 hover:bg-slate-50"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    openFaq === idx ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Band */}
      <section className="bg-[#1C4A3D] text-white py-16 px-4 text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Prêt à créer votre première facture conforme ?
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm">
            Aucun compte requis pour démarrer. Gratuit et illimité.
          </p>
        </div>

        <div>
          <Link
            href="/create?type=FACTURE"
            className="inline-flex items-center space-x-2 bg-amber-500 text-slate-950 font-black px-8 py-4 rounded-2xl text-sm shadow-xl hover:bg-amber-400 transition transform hover:scale-105"
          >
            <span>Commencer maintenant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 bg-[#1C4A3D] text-white font-bold flex items-center justify-center rounded-lg text-xs">
              DZ
            </div>
            <span className="font-bold text-white text-sm">FacturaDZ</span>
            <span className="text-slate-500">| Conçu pour les entreprises en Algérie</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-slate-400">
            <Link href="/login" className="hover:text-white transition">Se connecter</Link>
            <Link href="/signup" className="hover:text-white transition">Créer un compte</Link>
            <Link href="/create?type=FACTURE" className="hover:text-white transition">Créer une facture</Link>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <Link href="/privacy" className="hover:text-white transition">Confidentialité</Link>
            <Link href="/terms" className="hover:text-white transition">CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
