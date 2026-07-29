import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const company = await prisma.company.findUnique({ where: { id: companyId } });
  return NextResponse.json(company);
}

export async function PUT(request: Request) {
  const session = await auth();
  const companyId = (session?.user as any)?.companyId;
  if (!companyId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body = await request.json();
  const updated = await prisma.company.update({
    where: { id: companyId },
    data: {
      name: body.name,
      logoUrl: body.logoUrl,
      address: body.address,
      wilaya: body.wilaya,
      phone: body.phone,
      email: body.email,
      rc: body.rc,
      nif: body.nif,
      ai: body.ai,
      nis: body.nis,
      rib: body.rib,
    },
  });
  return NextResponse.json(updated);
}
