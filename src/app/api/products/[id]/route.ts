import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  const { id } = await params;

  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const product = await prisma.product.findFirst({ where: { id, companyId } });
  if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });

  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  const { id } = await params;

  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const existing = await prisma.product.findFirst({ where: { id, companyId } });
  if (!existing) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });

  try {
    const body = await request.json();
    const updated = await prisma.product.update({
      where: { id },
      data: {
        designation: body.designation ?? existing.designation,
        unit: body.unit ?? existing.unit,
        defaultUnitPrice: body.defaultUnitPrice !== undefined
          ? Number(body.defaultUnitPrice)
          : existing.defaultUnitPrice,
        defaultTvaRate: body.defaultTvaRate !== undefined
          ? Number(body.defaultTvaRate)
          : existing.defaultTvaRate,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du produit' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  const { id } = await params;

  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  // Safe delete: document lines use their own designation/price snapshot,
  // so deleting a product never corrupts historical document lines.
  await prisma.product.deleteMany({ where: { id, companyId } });
  return NextResponse.json({ success: true });
}
