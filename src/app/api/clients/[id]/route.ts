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

  const client = await prisma.client.findFirst({ where: { id, companyId } });
  if (!client) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 });

  return NextResponse.json(client);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  const { id } = await params;

  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const existing = await prisma.client.findFirst({ where: { id, companyId } });
  if (!existing) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 });

  try {
    const body = await request.json();
    const updated = await prisma.client.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        type: body.type ?? existing.type,
        address: body.address ?? existing.address,
        wilaya: body.wilaya ?? existing.wilaya,
        phone: body.phone ?? existing.phone,
        email: body.email ?? existing.email,
        rc: body.rc ?? existing.rc,
        nif: body.nif ?? existing.nif,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Error updating client:', err);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du client' }, { status: 500 });
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

  // Only delete if this client belongs to this company
  await prisma.client.deleteMany({ where: { id, companyId } });
  return NextResponse.json({ success: true });
}
