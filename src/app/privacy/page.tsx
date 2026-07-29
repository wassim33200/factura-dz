'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, Cookie, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = '30 juillet 2026';

  const sections = [
    {
      icon: Database,
      title: '1. Données Collectées',
      content: [
        'Lorsque vous utilisez FacturaDZ, nous pouvons collecter les informations suivantes :',
        '• **En mode invité (sans compte) :** Aucune donnée personnelle n\'est collectée par nos serveurs. Toutes vos informations (entreprise, clients, documents) sont stockées exclusivement dans le navigateur de votre appareil via la technologie IndexedDB.',
        '• **En mode compte :** Nous collectons votre adresse e-mail, le nom de votre entreprise, ainsi que les données commerciales que vous saisissez (clients, produits, factures, devis). Ces données sont nécessaires à la synchronisation de votre espace de travail entre vos appareils.',
        '• **Données de connexion Google :** Si vous vous inscrivez via Google OAuth, nous recevons votre nom et votre adresse e-mail depuis votre compte Google. Nous ne stockons jamais votre mot de passe Google.',
      ],
    },
    {
      icon: Lock,
      title: '2. Utilisation des Données',
      content: [
        'Vos données sont utilisées exclusivement pour :',
        '• Fournir et améliorer le service de facturation FacturaDZ.',
        '• Sauvegarder et synchroniser vos documents commerciaux entre vos appareils.',
        '• Gérer votre authentification et la sécurité de votre compte.',
        '• Générer des documents PDF conformes à la réglementation algérienne.',
        'Nous ne vendons, ne louons et ne partageons jamais vos données personnelles ou commerciales avec des tiers à des fins publicitaires ou commerciales.',
      ],
    },
    {
      icon: Eye,
      title: '3. Stockage et Sécurité',
      content: [
        '• **Mode invité :** Les données restent sur votre appareil. Elles ne sont jamais transmises à nos serveurs. La suppression des données de navigation de votre appareil entraîne la perte définitive de ces informations.',
        '• **Mode compte :** Vos données sont stockées sur des serveurs sécurisés. Les mots de passe sont chiffrés avec l\'algorithme bcrypt et ne sont jamais stockés en clair. Les communications entre votre navigateur et nos serveurs sont protégées par le protocole HTTPS/TLS.',
        '• Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, toute altération ou destruction.',
      ],
    },
    {
      icon: Cookie,
      title: '4. Cookies et Technologies Similaires',
      content: [
        'FacturaDZ utilise des cookies strictement nécessaires au fonctionnement du service :',
        '• **Cookie de session :** Permet de maintenir votre connexion active lorsque vous êtes authentifié.',
        '• **Stockage local (IndexedDB) :** Utilisé pour stocker vos données en mode invité.',
        'Nous n\'utilisons aucun cookie de suivi publicitaire ni de cookie tiers à des fins de profilage.',
      ],
    },
    {
      icon: UserCheck,
      title: '5. Vos Droits',
      content: [
        'Conformément à la législation en vigueur, vous disposez des droits suivants :',
        '• **Droit d\'accès :** Vous pouvez demander une copie de l\'ensemble des données que nous détenons à votre sujet.',
        '• **Droit de rectification :** Vous pouvez modifier vos informations personnelles à tout moment depuis les paramètres de votre compte.',
        '• **Droit de suppression :** Vous pouvez demander la suppression définitive de votre compte et de toutes les données associées.',
        '• **Droit de portabilité :** Vous pouvez exporter vos données dans un format structuré et couramment utilisé.',
        'Pour exercer l\'un de ces droits, contactez-nous à l\'adresse indiquée ci-dessous.',
      ],
    },
    {
      icon: Mail,
      title: '6. Contact',
      content: [
        'Pour toute question relative à cette politique de confidentialité ou au traitement de vos données personnelles, vous pouvez nous contacter :',
        '• **Email :** contact@facturadz.com',
        '• Nous nous engageons à répondre à toute demande dans un délai raisonnable.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-slate-900 font-sans flex flex-col selection:bg-[#1C4A3D] selection:text-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-9 w-9 bg-[#1C4A3D] text-white flex items-center justify-center rounded-xl font-extrabold text-lg shadow-md">
              DZ
            </div>
            <span className="font-extrabold text-xl text-[#1C4A3D] tracking-tight">FacturaDZ</span>
          </Link>

          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#1C4A3D] transition flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l&apos;accueil</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#1C4A3D] to-[#15382e] text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur rounded-2xl border border-white/20 mb-2">
            <Shield className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Politique de Confidentialité</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto">
            Nous prenons la protection de vos données très au sérieux. Voici comment FacturaDZ traite et protège vos informations.
          </p>
          <p className="text-xs text-slate-300/80">
            Dernière mise à jour : {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Intro card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm text-emerald-900">
            <p className="font-semibold mb-1">Résumé rapide :</p>
            <p className="text-xs leading-relaxed text-emerald-800">
              En mode invité, aucune donnée ne quitte votre appareil. En mode compte, nous collectons uniquement ce qui est nécessaire
              au fonctionnement du service. Nous ne vendons jamais vos données. Vous pouvez supprimer votre compte et toutes vos données à tout moment.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4 hover:shadow-md transition">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#1C4A3D]/10 text-[#1C4A3D] flex items-center justify-center rounded-xl shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                </div>
                <div className="space-y-2.5 pl-[52px]">
                  {section.content.map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-xs sm:text-sm text-slate-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: paragraph.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="font-semibold text-slate-900">$1</strong>'
                        ),
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Bottom link */}
          <div className="text-center pt-4 pb-8 space-y-3">
            <p className="text-xs text-slate-500">
              Voir également nos{' '}
              <Link href="/terms" className="text-[#1C4A3D] font-bold hover:underline">
                Conditions Générales d&apos;Utilisation
              </Link>
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-sm font-semibold text-[#1C4A3D] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l&apos;accueil</span>
            </Link>
          </div>
        </div>
      </main>

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

          <div className="flex space-x-6 text-slate-400">
            <Link href="/privacy" className="hover:text-white text-white font-semibold">Confidentialité</Link>
            <Link href="/terms" className="hover:text-white">CGU</Link>
            <Link href="/" className="hover:text-white">Accueil</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
