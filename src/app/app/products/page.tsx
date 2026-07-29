'use client';

import React, { useEffect, useState } from 'react';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { useRepository } from '@/lib/repository/useRepository';
import { ProductData } from '@/lib/types';
import { formatDA } from '@/lib/utils/format';
import { NumberInput } from '@/components/ui/NumberInput';
import { Package, Search, Plus, Trash2, Edit2 } from 'lucide-react';

export default function ProductsPage() {
  const { repositories } = useRepository();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductData>>({
    designation: '',
    unit: 'unité',
    defaultUnitPrice: 0,
    defaultTvaRate: 19,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const list = await repositories.products.getAll();
      setProducts(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [repositories]);

  const filteredProducts = products.filter((p) =>
    p.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.designation) return;
    await repositories.products.save(formData);
    setShowModal(false);
    setFormData({ designation: '', unit: 'unité', defaultUnitPrice: 0, defaultTvaRate: 19 });
    await loadProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit du catalogue ? (Vos factures existantes ne seront pas altérées)')) return;
    await repositories.products.delete(id);
    await loadProducts();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <GuestBanner />
      <AppNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C4A3D]">
              Catalogue Produits & Prestations
            </h1>
            <p className="text-sm text-slate-600">
              Prédéfinissez vos tarifs HT, unités et taux de TVA (19%/9%) pour préremplir vos factures en un clic.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#1C4A3D] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-[#15382e] transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par désignation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-[#1C4A3D] focus:border-[#1C4A3D]"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Chargement du catalogue...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-600">Aucun article au catalogue</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#1C4A3D] text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Ajouter un premier article
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">Désignation</th>
                    <th className="py-3 px-3">Unité</th>
                    <th className="py-3 px-4 text-right">Prix Unitaire HT</th>
                    <th className="py-3 px-3 text-center">Taux TVA</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{product.designation}</td>
                      <td className="py-3.5 px-3 text-slate-500">{product.unit}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#1C4A3D]">
                        {formatDA(product.defaultUnitPrice)}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                        {product.defaultTvaRate}%
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 inline-block"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Ajouter au Catalogue
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Désignation du Produit / Service *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Développement application Web / Licence annuelle"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full border-slate-300 rounded p-2 border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unité</label>
                  <input
                    type="text"
                    placeholder="unité / jour / heure"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Taux TVA Défaillance</label>
                  <select
                    value={formData.defaultTvaRate}
                    onChange={(e) => setFormData({ ...formData, defaultTvaRate: parseInt(e.target.value) })}
                    className="w-full border-slate-300 rounded p-2 border font-medium"
                  >
                    <option value={19}>19% (Standard)</option>
                    <option value={9}>9% (Réduit)</option>
                    <option value={0}>0% (Exonéré)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Prix Unitaire HT (DA) *</label>
                <NumberInput
                  step="0.01"
                  required
                  value={formData.defaultUnitPrice || 0}
                  onChange={(val) => setFormData({ ...formData, defaultUnitPrice: val })}
                  className="w-full border-slate-300 rounded p-2 border font-mono font-bold text-sm"
                />
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
                  Ajouter au Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
