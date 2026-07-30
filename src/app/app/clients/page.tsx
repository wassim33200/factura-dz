'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { useRepository } from '@/lib/repository/useRepository';
import { ClientData, DocumentData } from '@/lib/types';
import { formatDA } from '@/lib/utils/format';
import { Users, Search, Plus, Building2, User, Phone, MapPin, Eye, Trash2 } from 'lucide-react';

export default function ClientsPage() {
  const { repositories } = useRepository();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<ClientData>>({
    name: '',
    type: 'BUSINESS',
    wilaya: '16 - Alger',
    address: '',
    phone: '',
    email: '',
    nif: '',
    rc: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [cList, dList] = await Promise.all([
        repositories.clients.getAll(),
        repositories.documents.getAll(),
      ]);
      setClients(cList);
      setDocuments(dList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [repositories]);

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.wilaya || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm)
  );

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    await repositories.clients.save(formData);
    setShowModal(false);
    setFormData({ name: '', type: 'BUSINESS', wilaya: '16 - Alger', address: '', phone: '', email: '', nif: '', rc: '' });
    await loadData();
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Supprimer ce client du CRM ?')) return;
    await repositories.clients.delete(id);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <GuestBanner />
      <AppNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C4A3D]">
              Répertoire Clients (CRM)
            </h1>
            <p className="text-sm text-slate-600">
              Gérez votre fichier clients, leurs identifiants fiscaux (NIF/RC) et leur historique de facturation.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#1C4A3D] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-[#15382e] transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Client</span>
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, ville ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-[#1C4A3D] focus:border-[#1C4A3D]"
            />
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Chargement des clients...</div>
          ) : filteredClients.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-600">Aucun client enregistré</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#1C4A3D] text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Créer le premier client
              </button>
            </div>
          ) : (
            <div>
              {/* Mobile Card View */}
              <div className="space-y-3 p-4 md:hidden">
                {filteredClients.map((client) => {
                  const clientDocs = documents.filter((d) => d.clientId === client.id);
                  const totalInvoiced = clientDocs.reduce((acc, d) => acc + (d.totalTTC || 0), 0);
                  const totalBalance = clientDocs.reduce((acc, d) => acc + (d.balanceDue || 0), 0);

                  return (
                    <div key={client.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{client.name}</div>
                          <div className="text-[11px] text-slate-500 flex flex-wrap gap-2 mt-0.5">
                            {client.nif && <span>NIF: {client.nif}</span>}
                            {client.rc && <span>RC: {client.rc}</span>}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            client.type === 'BUSINESS'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {client.type === 'BUSINESS' ? 'Société' : 'Particulier'}
                        </span>
                      </div>

                      {(client.wilaya || client.phone) && (
                        <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                          {client.wilaya && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{client.wilaya}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Total Facturé</span>
                          <span className="font-mono font-bold text-slate-900">{formatDA(totalInvoiced)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 block text-[10px]">Reste Dû</span>
                          <span className="font-mono font-bold text-amber-700">{formatDA(totalBalance)}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex justify-end">
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-4">Wilaya & Contact</th>
                      <th className="py-3 px-4 text-right">Total Facturé</th>
                      <th className="py-3 px-4 text-right">Reste Dû</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClients.map((client) => {
                      const clientDocs = documents.filter((d) => d.clientId === client.id);
                      const totalInvoiced = clientDocs.reduce((acc, d) => acc + (d.totalTTC || 0), 0);
                      const totalBalance = clientDocs.reduce((acc, d) => acc + (d.balanceDue || 0), 0);

                      return (
                        <tr key={client.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{client.name}</div>
                            <div className="text-[11px] text-slate-500 flex gap-2">
                              {client.nif && <span>NIF: {client.nif}</span>}
                              {client.rc && <span>RC: {client.rc}</span>}
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                client.type === 'BUSINESS'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {client.type === 'BUSINESS' ? 'Société' : 'Particulier'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 text-xs space-y-0.5">
                            {client.wilaya && <div className="flex items-center space-x-1"><MapPin className="w-3 h-3 text-slate-400" /><span>{client.wilaya}</span></div>}
                            {client.phone && <div className="flex items-center space-x-1"><Phone className="w-3 h-3 text-slate-400" /><span>{client.phone}</span></div>}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                            {formatDA(totalInvoiced)}
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-700">
                            {formatDA(totalBalance)}
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleDeleteClient(client.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 inline-block"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Add Client */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Nouveau Client dans le CRM
            </h3>
            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nom / Raison Sociale *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: EURL El Amel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-slate-300 rounded p-2 border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Type Client</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full border-slate-300 rounded p-2 border"
                  >
                    <option value="BUSINESS">Entreprise (SARL/EURL)</option>
                    <option value="INDIVIDUAL">Particulier</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Wilaya</label>
                  <input
                    type="text"
                    placeholder="16 - Alger"
                    value={formData.wilaya || ''}
                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Adresse Complète</label>
                <input
                  type="text"
                  placeholder="Zone Industrielle Rouiba, Alger"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border-slate-300 rounded p-2 border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    placeholder="0550 00 00 00"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="client@domaine.dz"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">NIF (Identifiant Fiscal)</label>
                  <input
                    type="text"
                    placeholder="000000000000000"
                    value={formData.nif || ''}
                    onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">RC (Registre Commerce)</label>
                  <input
                    type="text"
                    placeholder="16/00-0000000B26"
                    value={formData.rc || ''}
                    onChange={(e) => setFormData({ ...formData, rc: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C4A3D] text-white rounded font-semibold hover:bg-[#15382e]"
                >
                  Enregistrer le Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
