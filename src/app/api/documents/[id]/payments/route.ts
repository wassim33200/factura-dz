import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateDocumentTotals } from '@/lib/calc/tax';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  const { id } = await params;

  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { amount, method = 'VIREMENT', note, date } = await request.json();

    const doc = await prisma.document.findFirst({
      where: { id, companyId },
      include: { lines: true, payments: true },
    });

    if (!doc) return NextResponse.json({ error: 'Document introuvable' }, { status: 404 });

    const paymentAmount = Number(amount);

    await prisma.payment.create({
      data: {
        documentId: id,
        amount: paymentAmount,
        method,
        note: note || '',
        date: date ? new Date(date) : new Date(),
      },
    });

    const updatedPayments = await prisma.payment.findMany({ where: { documentId: id } });
    // Use Number() to avoid Prisma Decimal + number type mismatch
    const newAmountPaid = updatedPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    const totals = calculateDocumentTotals(
      doc.lines.map((l) => ({
        quantity: Number(l.quantity),
        unitPrice: Number(l.unitPrice),
        discountPct: Number(l.discountPct),
        tvaRate: Number(l.tvaRate),
      })),
      doc.paymentMethod,
      doc.type,
      newAmountPaid
    );

    let newStatus = doc.status;
    if (newAmountPaid >= totals.netAPayer) {
      newStatus = 'PAYEE';
    } else if (newAmountPaid > 0) {
      newStatus = 'PARTIELLEMENT_PAYEE';
    }

    const updatedDoc = await prisma.document.update({
      where: { id },
      data: {
        amountPaid: newAmountPaid,
        balanceDue: totals.balanceDue,
        status: newStatus,
      },
      include: { lines: true, payments: true },
    });

    return NextResponse.json({
      ...updatedDoc,
      subtotalHT: Number(updatedDoc.subtotalHT),
      totalTVA: Number(updatedDoc.totalTVA),
      stampDuty: Number(updatedDoc.stampDuty),
      totalTTC: Number(updatedDoc.totalTTC),
      amountPaid: Number(updatedDoc.amountPaid),
      balanceDue: Number(updatedDoc.balanceDue),
      clientSnapshot: JSON.parse(updatedDoc.clientSnapshot || '{}'),
      companySnapshot: JSON.parse(updatedDoc.companySnapshot || '{}'),
      lines: updatedDoc.lines.map((l) => ({
        ...l,
        quantity: Number(l.quantity),
        unitPrice: Number(l.unitPrice),
        discountPct: Number(l.discountPct),
        totalHT: Number(l.totalHT),
      })),
      payments: updatedDoc.payments.map((p) => ({
        ...p,
        amount: Number(p.amount),
      })),
    });
  } catch (err) {
    console.error('Error recording payment:', err);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement du paiement" }, { status: 500 });
  }
}
