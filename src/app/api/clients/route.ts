import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body = await request.json();
  const client = await prisma.client.create({
    data: {
      companyId,
      name: body.name,
      type: body.type || 'INDIVIDUAL',
      address: body.address,
      wilaya: body.wilaya,
      phone: body.phone,
      email: body.email,
      rc: body.rc,
      nif: body.nif,
    },
  });
  return NextResponse.json(client);
}
