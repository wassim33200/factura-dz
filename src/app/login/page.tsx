'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogIn, ArrowRight } from 'lucide-react';
import { GoogleButton } from '@/components/auth/GoogleButton';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Email ou mot de passe incorrect.');
      setLoading(false);
    } else {
      router.push('/app/dashboard');
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
        <h2 className="text-xl font-extrabold text-slate-900">Se connecter à votre compte</h2>
        <p className="text-xs text-slate-500">
          Accédez à vos factures et clients sauvegardés sur le cloud.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 rounded-2xl sm:px-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          <GoogleButton label="Se connecter avec Google" />

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase absolute">
              OU
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email professionnel</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-slate-300 rounded-lg p-2.5 border text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-slate-300 rounded-lg p-2.5 border text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C4A3D] text-white py-3 rounded-xl font-bold text-sm shadow hover:bg-[#15382e] transition flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Connexion...' : 'Se connecter avec Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-[10px] text-slate-400 leading-relaxed px-2">
            En vous connectant, vous acceptez les{' '}
            <Link href="/terms" target="_blank" className="text-[#1C4A3D] font-semibold hover:underline">
              CGU
            </Link>{' '}
            et la{' '}
            <Link href="/privacy" target="_blank" className="text-[#1C4A3D] font-semibold hover:underline">
              Politique de Confidentialité
            </Link>{' '}
            de FacturaDZ.
          </div>

          <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500">
            Vous n&apos;avez pas de compte ?{' '}
            <Link href="/signup" className="text-[#1C4A3D] font-bold hover:underline">
              Créer un compte gratuit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
