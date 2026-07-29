import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const products = await prisma.product.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body = await request.json();
  const product = await prisma.product.create({
    data: {
      companyId,
      designation: body.designation,
      unit: body.unit || 'unité',
      defaultUnitPrice: Number(body.defaultUnitPrice || 0),
      defaultTvaRate: Number(body.defaultTvaRate ?? 19),
    },
  });
  return NextResponse.json(product);
}
