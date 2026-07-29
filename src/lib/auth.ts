import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
          include: { company: true },
        });

        if (!user || !user.passwordHash) return null;

        const isMatch = await bcrypt.compare(String(credentials.password), user.passwordHash);
        if (!isMatch) return null;

        return {
          id: user.id,
          email: user.email,
          companyId: user.company?.id,
          companyName: user.company?.name,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email) {
        const email = user.email.toLowerCase().trim();
        const findResult = await prisma.user.findUnique({
          where: { email },
          include: { company: true },
        });
        let dbUser: NonNullable<typeof findResult> | null = findResult;

        if (!dbUser) {
          const companyName = profile?.name ? `Entreprise ${profile.name}` : 'Mon Entreprise';
          const created = await prisma.user.create({
            data: {
              email,
              company: {
                create: {
                  name: companyName,
                  wilaya: '16 - Alger',
                },
              },
            } as Parameters<typeof prisma.user.create>[0]['data'],
            include: { company: true },
          });
          dbUser = created as NonNullable<typeof findResult>;
        } else if (!dbUser.company) {
          const company = await prisma.company.create({
            data: {
              userId: dbUser.id,
              name: 'Mon Entreprise',
              wilaya: '16 - Alger',
            },
          });
          dbUser.company = company;
        }

        user.id = dbUser!.id;
        (user as any).companyId = dbUser!.company?.id;
        (user as any).companyName = dbUser!.company?.name;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.companyId = (user as any).companyId;
        token.companyName = (user as any).companyName;
      }
      if (token.id && !token.companyId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { company: true },
        });
        if (dbUser?.company) {
          token.companyId = dbUser.company.id;
          token.companyName = dbUser.company.name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).companyId = token.companyId;
        (session.user as any).companyName = token.companyName;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
