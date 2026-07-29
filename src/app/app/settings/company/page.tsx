'use client';

import React, { useEffect, useState } from 'react';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { useRepository } from '@/lib/repository/useRepository';
import { CompanyData } from '@/lib/types';
import { Building, Save, Check } from 'lucide-react';

export default function CompanySettingsPage() {
  const { repositories } = useRepository();
  const [company, setCompany] = useState<CompanyData>({
    id: '',
    name: '',
    logoUrl: '',
    address: '',
    wilaya: '16 - Alger',
    phone: '',
    email: '',
    rc: '',
    nif: '',
    ai: '',
    nis: '',
    rib: '',
  });

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadCompany() {
      try {
        const data = await repositories.company.get();
        if (data) setCompany(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCompany();
  }, [repositories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await repositories.company.save(company);
      setCompany(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <GuestBanner />
      <AppNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C4A3D]">
            Profil Entreprise & Identifiants Légaux
          </h1>
          <p className="text-sm text-slate-600">
            Ces informations obligatoires (RC, NIF, AI, NIS) seront imprimées automatiquement au bas de toutes vos factures.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement des données...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* General Info */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b pb-2">
                Informations Générales
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Raison Sociale / Nom Entreprise *</label>
                  <input
                    type="text"
                    required
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className="w-full border-slate-300 rounded-lg p-2.5 border"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">URL du Logo (Optionnel)</label>
                  <input
                    type="url"
                    placeholder="https://domaine.dz/logo.png"
                    value={company.logoUrl || ''}
                    onChange={(e) => setCompany({ ...company, logoUrl: e.target.value })}
                    className="w-full border-slate-300 rounded-lg p-2.5 border"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={company.phone || ''}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    className="w-full border-slate-300 rounded-lg p-2.5 border"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email professionnel</label>
                  <input
                    type="email"
                    value={company.email || ''}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                    className="w-full border-slate-300 rounded-lg p-2.5 border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Adresse physique</label>
                  <input
                    type="text"
                    value={company.address || ''}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    className="w-full border-slate-300 rounded-lg p-2.5 border"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wilaya</label>
                  <input
                    type="text"
                    value={company.wilaya || ''}
                    onChange={(e) => setCompany({ ...company, wilaya: e.target.value })}
                    className="w-full border-slate-300 rounded-lg p-2.5 border"
                  />
                </div>
              </div>
            </div>

            {/* Algerian Fiscal Legal Identifiers */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b pb-2">
                Identifiants Fiscaux Algériens
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    RC (Registre de Commerce)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 16/00-1234567B26"
                    value={company.rc || ''}
                    onChange={(e) => setCompany({ ...company, rc: e.target.value })}
                    className="w-full border-slate-300 rounded-lg p-2.5 border font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIF (Numéro d&apos;Identification Fiscale)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 002616123456789"
                    value={company.nif || ''}
                    onChange={(e) => setCompany({ ...company, nif: e.target.value })}
                    className="w-full border-slate-300 rounded-lg p-2.5 border font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    AI (Article d&apos;Imposition)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 16011234567"
                    value={company.ai || ''}
                    onChange={(e) => setCompany({ ...company, ai: e.target.value })}
                    className="w-full border-slate-300 rounded-lg p-2.5 border font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIS (Numéro d&apos;Identification Statistique)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 002616011234567"
                    value={company.nis || ''}
                    onChange={(e) => setCompany({ ...company, nis: e.target.value })}
                    className="w-full border-slate-300 rounded-lg p-2.5 border font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bank details RIB */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
              <label className="block font-bold text-slate-800 uppercase tracking-wide">
                Coordonnées Bancaires / RIB CCP (Imprimé sur les factures)
              </label>
              <input
                type="text"
                placeholder="ex: RIB BNA: 001 00810 0300 000123 45 | CCP: 007999999 Clé 99"
                value={company.rib || ''}
                onChange={(e) => setCompany({ ...company, rib: e.target.value })}
                className="w-full border-slate-300 rounded-lg p-2.5 border font-mono"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              {saved ? (
                <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
                  <Check className="w-4 h-4" />
                  <span>Modifications enregistrées !</span>
                </span>
              ) : <span />}

              <button
                type="submit"
                className="bg-[#1C4A3D] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-[#15382e] transition flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer le Profil</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
