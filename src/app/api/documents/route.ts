import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateDocumentTotals } from '@/lib/calc/tax';
import { amountInWords } from '@/lib/calc/numberToWords';
import { DocType } from '@/lib/types';

const PREFIX_MAP: Record<DocType, string> = {
  FACTURE: 'FAC',
  DEVIS: 'DEV',
  PROFORMA: 'PRO',
  BON_COMMANDE: 'BC',
  BON_LIVRAISON: 'BL',
};

export async function GET() {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;

  if (!companyId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const docs = await prisma.document.findMany({
    where: { companyId },
    include: { lines: true, payments: true },
    orderBy: { createdAt: 'desc' },
  });

  const parsed = docs.map((doc) => ({
    ...doc,
    subtotalHT: Number(doc.subtotalHT),
    totalTVA: Number(doc.totalTVA),
    stampDuty: Number(doc.stampDuty),
    totalTTC: Number(doc.totalTTC),
    amountPaid: Number(doc.amountPaid),
    balanceDue: Number(doc.balanceDue),
    clientSnapshot: JSON.parse(doc.clientSnapshot || '{}'),
    companySnapshot: JSON.parse(doc.companySnapshot || '{}'),
    lines: doc.lines.map((l) => ({
      ...l,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      discountPct: Number(l.discountPct),
      totalHT: Number(l.totalHT),
    })),
    payments: doc.payments.map((p) => ({
      ...p,
      amount: Number(p.amount),
    })),
  }));

  return NextResponse.json(parsed);
}

export async function POST(request: Request) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;

  if (!companyId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      type = 'FACTURE',
      status = 'BROUILLON',
      issueDate = new Date(),
      dueDate,
      clientId,
      paymentMethod,
      notes,
      lines = [],
    } = body;

    const docType: DocType = type;

    // Atomically generate document number using counter
    const year = new Date().getFullYear();
    const prefix = PREFIX_MAP[docType] || 'DOC';
    const counter = await prisma.documentCounter.upsert({
      where: { companyId_docType_year: { companyId, docType, year } },
      update: { lastNumber: { increment: 1 } },
      create: { companyId, docType, year, lastNumber: 1 },
    });
    const seq = String(counter.lastNumber).padStart(4, '0');
    const number = body.number || `${prefix}-${year}-${seq}`;

    // Fetch company & client for frozen snapshots
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    const client = clientId ? await prisma.client.findUnique({ where: { id: clientId } }) : null;

    // Recompute tax server-side — never trust client totals
    const totals = calculateDocumentTotals(lines, paymentMethod, docType, 0);
    const words = amountInWords(totals.netAPayer);

    const created = await prisma.document.create({
      data: {
        companyId,
        type: docType,
        number,
        status,
        issueDate: new Date(issueDate),
        dueDate: dueDate ? new Date(dueDate) : null,
        clientId: clientId || null,
        clientSnapshot: JSON.stringify(client || body.clientSnapshot || {}),
        companySnapshot: JSON.stringify(company || body.companySnapshot || {}),
        paymentMethod: paymentMethod || null,
        notes: notes || null,
        subtotalHT: totals.subtotalHT,
        totalTVA: totals.totalTVA,
        stampDuty: totals.stampDuty,
        totalTTC: totals.totalTTC,
        amountPaid: 0,
        balanceDue: totals.netAPayer,
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

    return NextResponse.json({
      ...created,
      subtotalHT: Number(created.subtotalHT),
      totalTVA: Number(created.totalTVA),
      stampDuty: Number(created.stampDuty),
      totalTTC: Number(created.totalTTC),
      amountPaid: Number(created.amountPaid),
      balanceDue: Number(created.balanceDue),
      clientSnapshot: JSON.parse(created.clientSnapshot),
      companySnapshot: JSON.parse(created.companySnapshot),
      lines: created.lines.map((l) => ({
        ...l,
        quantity: Number(l.quantity),
        unitPrice: Number(l.unitPrice),
        discountPct: Number(l.discountPct),
        totalHT: Number(l.totalHT),
      })),
    });
  } catch (err) {
    console.error('Error creating document:', err);
    return NextResponse.json({ error: 'Erreur lors de la création du document' }, { status: 500 });
  }
}
