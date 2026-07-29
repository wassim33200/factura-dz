import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { prisma } from '@/lib/prisma';
import { DocumentPdfTemplate } from '@/components/pdf/DocumentPdfTemplate';
import React from 'react';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = await prisma.document.findUnique({
      where: { id },
      include: { lines: true, payments: true },
    });

    if (!doc) {
      return new NextResponse('Document introuvable', { status: 404 });
    }

    const fullDoc = {
      ...doc,
      type: doc.type as any,
      status: doc.status as any,
      paymentMethod: doc.paymentMethod as any,
      clientSnapshot: JSON.parse(doc.clientSnapshot || '{}'),
      companySnapshot: JSON.parse(doc.companySnapshot || '{}'),
    };

    // Render PDF React component to Stream
    const element = DocumentPdfTemplate({ doc: fullDoc as any });
    const stream = await renderToStream(element as any);

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${doc.number}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return new NextResponse('Erreur lors de la génération du PDF', { status: 500 });
  }
}
