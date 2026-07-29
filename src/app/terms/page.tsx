'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Scale,
  FileText,
  AlertTriangle,
  Ban,
  Gavel,
  RefreshCw,
  Globe,
  ShieldCheck,
} from 'lucide-react';

export default function TermsOfServicePage() {
  const lastUpdated = '30 juillet 2026';

  const sections = [
    {
      icon: FileText,
      title: '1. Objet du Service',
      content: [
        'FacturaDZ est un logiciel en ligne (SaaS) de facturation et de gestion commerciale conçu pour les indépendants, les auto-entrepreneurs et les PME exerçant en Algérie.',
        'Le service permet de créer, gérer et exporter des documents commerciaux (factures, devis, factures proforma, bons de commande, bons de livraison) conformes à la réglementation fiscale algérienne en vigueur, notamment le calcul automatique de la TVA (19%/9%) et du droit de timbre (Loi de Finances 2025).',
        'Le service est proposé en deux modes d\'utilisation :',
        '• **Mode invité (sans compte) :** Utilisation immédiate sans inscription. Les données sont stockées localement sur votre appareil.',
        '• **Mode compte :** Inscription gratuite permettant la synchronisation des données entre plusieurs appareils et la sauvegarde sur le cloud.',
      ],
    },
    {
      icon: ShieldCheck,
      title: '2. Acceptation des Conditions',
      content: [
        'L\'utilisation de FacturaDZ, que ce soit en mode invité ou en mode compte, implique l\'acceptation pleine et entière des présentes Conditions Générales d\'Utilisation (CGU) ainsi que de notre Politique de Confidentialité.',
        'Si vous créez un compte, vous confirmez expressément votre acceptation en cochant la case prévue à cet effet lors de l\'inscription.',
        'Si vous utilisez le service en mode invité (sans compte), l\'utilisation du service vaut acceptation tacite des présentes CGU.',
        'FacturaDZ se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle.',
      ],
    },
    {
      icon: Globe,
      title: '3. Accès au Service',
      content: [
        '• Le service est accessible gratuitement et sans limitation de volume (nombre de factures, de clients, etc.).',
        '• FacturaDZ s\'engage à mettre en œuvre les moyens nécessaires pour assurer la disponibilité et le bon fonctionnement du service 24h/24, 7j/7. Toutefois, aucune garantie de disponibilité permanente ne peut être assurée en raison des contraintes techniques inhérentes à Internet.',
        '• FacturaDZ se réserve le droit d\'interrompre temporairement l\'accès au service pour des raisons de maintenance, de mise à jour ou d\'amélioration, sans engagement de préavis.',
        '• En mode invité, la disponibilité de vos données dépend de votre appareil et de votre navigateur. FacturaDZ décline toute responsabilité en cas de perte de données stockées localement.',
      ],
    },
    {
      icon: Ban,
      title: '4. Obligations de l\'Utilisateur',
      content: [
        'En utilisant FacturaDZ, vous vous engagez à :',
        '• Fournir des informations exactes et à jour lors de la création de votre compte et dans vos documents commerciaux.',
        '• Ne pas utiliser le service à des fins frauduleuses, illégales ou contraires aux bonnes mœurs.',
        '• Ne pas tenter de perturber, compromettre ou altérer le fonctionnement du service.',
        '• Respecter la propriété intellectuelle de FacturaDZ (code source, design, marque).',
        '• Conserver la confidentialité de vos identifiants de connexion et ne pas les partager avec des tiers.',
        'Tout manquement à ces obligations pourra entraîner la suspension ou la suppression immédiate de votre compte sans préavis.',
      ],
    },
    {
      icon: AlertTriangle,
      title: '5. Limitation de Responsabilité',
      content: [
        '• FacturaDZ est un outil d\'aide à la facturation. Il ne constitue en aucun cas un conseil juridique, fiscal ou comptable.',
        '• L\'utilisateur est seul responsable de la conformité de ses documents commerciaux avec la législation applicable. FacturaDZ ne saurait être tenu responsable des erreurs résultant de données inexactes saisies par l\'utilisateur.',
        '• FacturaDZ ne saurait être tenu responsable des dommages directs ou indirects résultant de l\'utilisation ou de l\'impossibilité d\'utiliser le service.',
        '• Les calculs automatiques (TVA, droit de timbre, montant en lettres) sont fournis à titre indicatif et doivent être vérifiés par l\'utilisateur avant émission.',
        '• En mode invité, FacturaDZ ne saurait être tenu responsable de la perte de données liée à la suppression du cache navigateur ou au changement d\'appareil.',
      ],
    },
    {
      icon: Gavel,
      title: '6. Propriété Intellectuelle',
      content: [
        '• L\'ensemble du contenu du service FacturaDZ (code source, interface, logo, textes, design) est protégé par les lois relatives à la propriété intellectuelle.',
        '• L\'utilisateur conserve la pleine propriété de ses données commerciales (informations d\'entreprise, listes de clients, documents). FacturaDZ ne revendique aucun droit sur ces données.',
        '• Il est strictement interdit de reproduire, copier, modifier ou distribuer tout élément du service sans autorisation écrite préalable de FacturaDZ.',
      ],
    },
    {
      icon: RefreshCw,
      title: '7. Résiliation et Suppression de Compte',
      content: [
        '• Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre espace. La suppression entraîne la suppression définitive et irréversible de l\'ensemble de vos données.',
        '• FacturaDZ se réserve le droit de suspendre ou supprimer un compte en cas de violation des présentes CGU, sans obligation de préavis ni d\'indemnisation.',
        '• En cas de cessation définitive du service, FacturaDZ s\'engage à informer les utilisateurs dans un délai raisonnable et à leur permettre d\'exporter leurs données.',
      ],
    },
    {
      icon: Scale,
      title: '8. Droit Applicable et Juridiction',
      content: [
        '• Les présentes CGU sont régies par le droit algérien.',
        '• En cas de litige relatif à l\'interprétation ou à l\'exécution des présentes conditions, les parties s\'efforceront de trouver une solution amiable.',
        '• À défaut de résolution amiable, les tribunaux compétents d\'Alger seront seuls compétents.',
        '• Pour toute question relative aux présentes CGU, vous pouvez nous contacter à : **contact@facturadz.com**',
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
            <Scale className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Conditions Générales d&apos;Utilisation</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto">
            Veuillez lire attentivement les conditions suivantes avant d&apos;utiliser FacturaDZ. L&apos;utilisation du service implique l&apos;acceptation de ces conditions.
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
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900">
            <p className="font-semibold mb-1">Important :</p>
            <p className="text-xs leading-relaxed text-amber-800">
              En utilisant FacturaDZ — avec ou sans compte — vous acceptez les présentes Conditions Générales d&apos;Utilisation
              et notre Politique de Confidentialité. FacturaDZ est un outil d&apos;aide à la facturation et ne se substitue pas
              aux conseils d&apos;un expert-comptable ou d&apos;un conseiller fiscal.
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
              Voir également notre{' '}
              <Link href="/privacy" className="text-[#1C4A3D] font-bold hover:underline">
                Politique de Confidentialité
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
            <Link href="/privacy" className="hover:text-white">Confidentialité</Link>
            <Link href="/terms" className="hover:text-white text-white font-semibold">CGU</Link>
            <Link href="/" className="hover:text-white">Accueil</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
