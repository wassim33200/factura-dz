import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DocType } from '@/lib/types';

const PREFIX_MAP: Record<DocType, string> = {
  FACTURE: 'FAC',
  DEVIS: 'DEV',
  PROFORMA: 'PRO',
  BON_COMMANDE: 'BC',
  BON_LIVRAISON: 'BL',
};

export async function GET(request: Request) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;

  if (!companyId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const docType = (searchParams.get('type') as DocType) || 'FACTURE';
  const year = new Date().getFullYear();
  const prefix = PREFIX_MAP[docType] || 'DOC';

  try {
    const counter = await prisma.documentCounter.upsert({
      where: {
        companyId_docType_year: {
          companyId,
          docType,
          year,
        },
      },
      update: {
        lastNumber: { increment: 1 },
      },
      create: {
        companyId,
        docType,
        year,
        lastNumber: 1,
      },
    });

    const seq = String(counter.lastNumber).padStart(4, '0');
    const number = `${prefix}-${year}-${seq}`;

    return NextResponse.json({ number });
  } catch (err) {
    console.error('Error generating document number:', err);
    return NextResponse.json({ error: 'Erreur lors de la génération du numéro' }, { status: 500 });
  }
}
