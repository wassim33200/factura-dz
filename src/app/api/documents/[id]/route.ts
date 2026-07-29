import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateDocumentTotals } from '@/lib/calc/tax';
import { amountInWords } from '@/lib/calc/numberToWords';

function serializeDoc(doc: any) {
  return {
    ...doc,
    subtotalHT: Number(doc.subtotalHT),
    totalTVA: Number(doc.totalTVA),
    stampDuty: Number(doc.stampDuty),
    totalTTC: Number(doc.totalTTC),
    amountPaid: Number(doc.amountPaid),
    balanceDue: Number(doc.balanceDue),
    clientSnapshot: typeof doc.clientSnapshot === 'string'
      ? JSON.parse(doc.clientSnapshot || '{}')
      : doc.clientSnapshot,
    companySnapshot: typeof doc.companySnapshot === 'string'
      ? JSON.parse(doc.companySnapshot || '{}')
      : doc.companySnapshot,
    lines: (doc.lines || []).map((l: any) => ({
      ...l,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      discountPct: Number(l.discountPct),
      totalHT: Number(l.totalHT),
    })),
    payments: (doc.payments || []).map((p: any) => ({
      ...p,
      amount: Number(p.amount),
    })),
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  const { id } = await params;

  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const doc = await prisma.document.findFirst({
    where: { id, companyId },
    include: { lines: true, payments: true },
  });

  if (!doc) return NextResponse.json({ error: 'Document introuvable' }, { status: 404 });

  return NextResponse.json(serializeDoc(doc));
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  const { id } = await params;

  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      type,
      number,
      status,
      issueDate,
      dueDate,
      clientId,
      paymentMethod,
      notes,
      lines = [],
    } = body;

    const existing = await prisma.document.findFirst({
      where: { id, companyId },
      include: { payments: true },
    });

    if (!existing) return NextResponse.json({ error: 'Document introuvable' }, { status: 404 });

    const amountPaid = existing.payments.reduce((acc, p) => acc + Number(p.amount), 0);
    const effectiveType = type || existing.type;
    const effectivePaymentMethod = paymentMethod !== undefined ? paymentMethod : existing.paymentMethod;
    const totals = calculateDocumentTotals(lines, effectivePaymentMethod, effectiveType, amountPaid);
    const words = amountInWords(totals.netAPayer);

    // Refresh clientSnapshot if clientId changed
    let clientSnapshotStr = existing.clientSnapshot;
    if (clientId !== undefined && clientId !== existing.clientId) {
      const newClient = clientId
        ? await prisma.client.findUnique({ where: { id: clientId } })
        : null;
      clientSnapshotStr = JSON.stringify(newClient || {});
    }

    // Delete existing lines and re-create
    await prisma.documentLine.deleteMany({ where: { documentId: id } });

    const updated = await prisma.document.update({
      where: { id },
      data: {
        type: effectiveType,
        number: number || existing.number,
        status: status || existing.status,
        issueDate: issueDate ? new Date(issueDate) : existing.issueDate,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existing.dueDate,
        clientId: clientId !== undefined ? (clientId || null) : existing.clientId,
        clientSnapshot: clientSnapshotStr,
        paymentMethod: effectivePaymentMethod !== undefined ? effectivePaymentMethod : existing.paymentMethod,
        notes: notes !== undefined ? notes : existing.notes,
        subtotalHT: totals.subtotalHT,
        totalTVA: totals.totalTVA,
        stampDuty: totals.stampDuty,
        totalTTC: totals.totalTTC,
        amountPaid,
        balanceDue: totals.balanceDue,
        amountInWords: words,
        lines: {
          create: lines.map((l: any, idx: number) => ({
            productId: l.productId || null,
            designation: l.designation,
            quantity: Number(l.quantity),
            unit: l.unit || 'unité',
            unitPrice: Number(l.unitPrice),
            discountPct: Number(l.discountPct || 0),
            tvaRate: Number(l.tvaRate ?? 19),
            totalHT: Number(l.quantity) * Number(l.unitPrice) * (1 - (Number(l.discountPct) || 0) / 100),
            position: idx,
          })),
        },
      },
      include: { lines: true, payments: true },
    });

    return NextResponse.json(serializeDoc(updated));
  } catch (err) {
    console.error('Error updating document:', err);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  const { id } = await params;

  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  await prisma.document.deleteMany({ where: { id, companyId } });
  return NextResponse.json({ success: true });
}
