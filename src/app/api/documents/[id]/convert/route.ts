import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateDocumentTotals } from '@/lib/calc/tax';
import { amountInWords } from '@/lib/calc/numberToWords';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  const { id } = await params;

  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const sourceDoc = await prisma.document.findFirst({
      where: { id, companyId },
      include: { lines: true },
    });

    if (!sourceDoc) return NextResponse.json({ error: 'Document source introuvable' }, { status: 404 });

    // Generate atomic FAC- number
    const year = new Date().getFullYear();
    const counter = await prisma.documentCounter.upsert({
      where: { companyId_docType_year: { companyId, docType: 'FACTURE', year } },
      update: { lastNumber: { increment: 1 } },
      create: { companyId, docType: 'FACTURE', year, lastNumber: 1 },
    });

    const seq = String(counter.lastNumber).padStart(4, '0');
    const newNumber = `FAC-${year}-${seq}`;

    const totals = calculateDocumentTotals(sourceDoc.lines as any, 'VIREMENT', 'FACTURE', 0);
    const words = amountInWords(totals.netAPayer);

    // Create new Facture
    const newFacture = await prisma.document.create({
      data: {
        companyId,
        type: 'FACTURE',
        number: newNumber,
        status: 'BROUILLON',
        issueDate: new Date(),
        clientId: sourceDoc.clientId,
        clientSnapshot: sourceDoc.clientSnapshot,
        companySnapshot: sourceDoc.companySnapshot,
        paymentMethod: 'VIREMENT',
        notes: `Facture générée depuis le document ${sourceDoc.number}`,
        convertedFromId: sourceDoc.id,
        subtotalHT: totals.subtotalHT,
        totalTVA: totals.totalTVA,
        stampDuty: totals.stampDuty,
        totalTTC: totals.totalTTC,
        amountPaid: 0,
        balanceDue: totals.netAPayer,
        amountInWords: words,
        lines: {
          create: sourceDoc.lines.map((l, idx) => ({
            productId: l.productId,
            designation: l.designation,
            quantity: l.quantity,
            unit: l.unit,
            unitPrice: l.unitPrice,
            discountPct: l.discountPct,
            tvaRate: l.tvaRate,
            totalHT: l.totalHT,
            position: idx,
          })),
        },
      },
      include: { lines: true, payments: true },
    });

    // Mark source devis as ACCEPTE
    await prisma.document.update({
      where: { id: sourceDoc.id },
      data: { status: 'ACCEPTE' },
    });

    return NextResponse.json({
      ...newFacture,
      subtotalHT: Number(newFacture.subtotalHT),
      totalTVA: Number(newFacture.totalTVA),
      stampDuty: Number(newFacture.stampDuty),
      totalTTC: Number(newFacture.totalTTC),
      amountPaid: Number(newFacture.amountPaid),
      balanceDue: Number(newFacture.balanceDue),
      clientSnapshot: JSON.parse(newFacture.clientSnapshot),
      companySnapshot: JSON.parse(newFacture.companySnapshot),
      lines: newFacture.lines.map((l) => ({
        ...l,
        quantity: Number(l.quantity),
        unitPrice: Number(l.unitPrice),
        discountPct: Number(l.discountPct),
        totalHT: Number(l.totalHT),
      })),
    });
  } catch (err) {
    console.error('Error converting document:', err);
    return NextResponse.json({ error: 'Erreur lors de la conversion' }, { status: 500 });
  }
}
