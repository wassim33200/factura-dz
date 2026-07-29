'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRepository } from '@/lib/repository/useRepository';
import { UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GoogleButton } from '@/components/auth/GoogleButton';

export default function SignupPage() {
  const router = useRouter();
  const { migrateLocalDataToAccount } = useRepository();

  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l\'inscription');
        setLoading(false);
        return;
      }

      // Automatically sign in
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.ok) {
        // Run guest data migration to account
        await migrateLocalDataToAccount();
        router.push('/app/dashboard');
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="h-10 w-10 bg-[#1C4A3D] text-white flex items-center justify-center rounded-xl font-extrabold text-xl shadow-md">
            DZ
          </div>
          <span className="font-extrabold text-2xl text-[#1C4A3D] tracking-tight">FacturaDZ</span>
        </Link>
        <h2 className="text-xl font-extrabold text-slate-900">Créer un compte gratuit</h2>
        <p className="text-xs text-slate-500">
          Sans carte bancaire. Vos documents créés en mode invité seront importés automatiquement.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 rounded-2xl sm:px-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          <GoogleButton label="S'inscrire avec Google" />

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase absolute">
              OU AVEC UN EMAIL
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nom de votre Entreprise / Activité *
              </label>
              <input
                type="text"
                required
                placeholder="ex: EURL Numidie Tech / Artisan Hamadi"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border-slate-300 rounded-lg p-2.5 border text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email professionnel *</label>
              <input
                type="email"
                required
                placeholder="contact@entreprise.dz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-slate-300 rounded-lg p-2.5 border text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mot de passe *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-slate-300 rounded-lg p-2.5 border text-sm"
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-[11px] text-emerald-800 space-y-1">
              <div className="font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Migration Automatique :</span>
              </div>
              <p>Vos documents et clients saisis avant la création de votre compte seront sauvegardés dans votre espace entreprise.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C4A3D] text-white py-3 rounded-xl font-bold text-sm shadow hover:bg-[#15382e] transition flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Création en cours...' : 'Créer mon compte avec Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-[#1C4A3D] font-bold hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
