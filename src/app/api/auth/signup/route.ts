import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, companyName } = body;

    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Email, mot de passe et nom d\'entreprise sont requis' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cette adresse email' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        company: {
          create: {
            name: companyName,
            wilaya: '16 - Alger',
          },
        },
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      company: user.company,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Erreur lors de la création du compte' }, { status: 500 });
  }
}
