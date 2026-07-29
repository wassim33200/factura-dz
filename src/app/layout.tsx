import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FacturaDZ | Invoicing & Devis conforme pour entreprises en Algérie',
  description:
    'Logiciel de facturation et devis gratuit pour indépendants et PME en Algérie. Calcul automatique de la TVA (19%/9%), du droit de timbre et montant en lettres.',
  keywords: [
    'facturation algerie',
    'facture algerienne',
    'devis algerie',
    'droit de timbre 2025',
    'tva 19 algerie',
    'logiciel facture gratuit',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full bg-slate-50">
      <body className={`${inter.className} min-h-full flex flex-col antialiased text-slate-900`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
