'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRepository } from '@/lib/repository/useRepository';
import { DocumentData, ClientData, ProductData, DocType, PaymentMethod, DocumentLineData } from '@/lib/types';
import { calculateDocumentTotals, LineInput } from '@/lib/calc/tax';
import { amountInWords } from '@/lib/calc/numberToWords';
import { DocumentPreview } from './DocumentPreview';
import { TotalsPanel } from './TotalsPanel';
import { NumberInput } from '@/components/ui/NumberInput';
import { Plus, Trash2, Save, FileText, Download, UserPlus, Eye, Edit3, ArrowLeft, Building, Sparkles } from 'lucide-react';

const DEFAULT_COMPANY_NAME = 'Mon Entreprise DZ';

interface DocumentEditorProps {
  initialData?: DocumentData | null;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ initialData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { repositories, isGuest } = useRepository();

  const queryType = (searchParams.get('type') as DocType) || 'FACTURE';

  const [docType, setDocType] = useState<DocType>(initialData?.type || queryType);
  const [docNumber, setDocNumber] = useState<string>(initialData?.number || '');
  const [status, setStatus] = useState<string>(initialData?.status || 'BROUILLON');
  const [issueDate, setIssueDate] = useState<string>(
    initialData?.issueDate ? new Date(initialData.issueDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [dueDate, setDueDate] = useState<string>(
    initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 10) : ''
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    (initialData?.paymentMethod as PaymentMethod) || 'VIREMENT'
  );
  const [notes, setNotes] = useState<string>(initialData?.notes || '');

  // Clients & Products from Repository
  const [clients, setClients] = useState<ClientData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [company, setCompany] = useState<any>({});

  // Company Modal State (Guest & Authenticated)
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [companyFormData, setCompanyFormData] = useState<any>({});
  // Guest first-time setup gate
  const [isGuestSetupRequired, setIsGuestSetupRequired] = useState(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);

  const [selectedClientId, setSelectedClientId] = useState<string>(initialData?.clientId || '');
  const [clientSnapshot, setClientSnapshot] = useState<Partial<ClientData>>(initialData?.clientSnapshot || {});

  // Lines
  const [lines, setLines] = useState<DocumentLineData[]>(
    initialData?.lines || [
      {
        id: 'line_1',
        designation: '',
        quantity: 1,
        unit: 'unité',
        unitPrice: 0,
        discountPct: 0,
        tvaRate: 19,
        totalHT: 0,
        position: 0,
      },
    ]
  );

  // New Client Modal State
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState<Partial<ClientData>>({
    name: '',
    type: 'INDIVIDUAL',
    phone: '',
    email: '',
    address: '',
    wilaya: '16 - Alger',
    nif: '',
    rc: '',
  });

  // Mobile View Toggle
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [isSaving, setIsSaving] = useState(false);

  // Load initial options & generated number
  useEffect(() => {
    async function loadData() {
      const [cList, pList, compData] = await Promise.all([
        repositories.clients.getAll(),
        repositories.products.getAll(),
        repositories.company.get(),
      ]);
      setClients(cList);
      setProducts(pList);
      setCompany(compData);

      if (!initialData && !docNumber) {
        const generated = await repositories.documents.generateNumber(docType);
        setDocNumber(generated);
      }

      // Check if guest needs to set up company info first
      if (isGuest && (!compData || compData.name === DEFAULT_COMPANY_NAME)) {
        setCompanyFormData(compData || {});
        setIsGuestSetupRequired(true);
        setShowCompanyModal(true);
      }
      setIsCheckingSetup(false);
    }
    loadData();
  }, [repositories, docType, initialData, isGuest]);

  // When Client selection changes
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const found = clients.find((c) => c.id === clientId);
    if (found) {
      setClientSnapshot(found);
    }
  };

  const handleOpenCompanyModal = () => {
    setCompanyFormData(company || {});
    setShowCompanyModal(true);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await repositories.company.save(companyFormData);
      setCompany(updated);
      setShowCompanyModal(false);
      setIsGuestSetupRequired(false);
    } catch (err) {
      console.error('Failed to save company profile:', err);
    }
  };

  // Add / Remove Line
  const handleAddLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: `line_${Date.now()}_${prev.length}`,
        designation: '',
        quantity: 1,
        unit: 'unité',
        unitPrice: 0,
        discountPct: 0,
        tvaRate: 19,
        totalHT: 0,
        position: prev.length,
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, field: keyof DocumentLineData, value: any) => {
    setLines((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      if (field === 'productId') {
        const prod = products.find((p) => p.id === value);
        if (prod) {
          item.designation = prod.designation;
          item.unit = prod.unit;
          item.unitPrice = prod.defaultUnitPrice;
          item.tvaRate = prod.defaultTvaRate;
        }
      }

      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const discount = Number(item.discountPct) || 0;
      item.totalHT = qty * price * (1 - discount / 100);

      updated[index] = item;
      return updated;
    });
  };

  // Inline Save New Client
  const handleSaveNewClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientData.name) return;
    const created = await repositories.clients.save(newClientData);
    setClients((prev) => [...prev, created]);
    setSelectedClientId(created.id);
    setClientSnapshot(created);
    setShowClientModal(false);
    setNewClientData({ name: '', type: 'INDIVIDUAL', phone: '', email: '', address: '', wilaya: '16 - Alger' });
  };

  // Recalculate totals live
  const lineInputs: LineInput[] = useMemo(
    () =>
      lines.map((l) => ({
        quantity: Number(l.quantity) || 0,
        unitPrice: Number(l.unitPrice) || 0,
        discountPct: Number(l.discountPct) || 0,
        tvaRate: Number(l.tvaRate) ?? 19,
      })),
    [lines]
  );

  const totals = useMemo(
    () => calculateDocumentTotals(lineInputs, paymentMethod, docType, initialData?.amountPaid || 0),
    [lineInputs, paymentMethod, docType, initialData?.amountPaid]
  );

  const wordsText = useMemo(() => amountInWords(totals.netAPayer), [totals.netAPayer]);

  // Construct current doc state for live preview
  const liveDocumentState: Partial<DocumentData> = {
    id: initialData?.id,
    type: docType,
    number: docNumber,
    status: status as any,
    issueDate,
    dueDate,
    clientId: selectedClientId,
    clientSnapshot,
    companySnapshot: company,
    paymentMethod: docType === 'FACTURE' ? paymentMethod : null,
    notes,
    lines,
    subtotalHT: totals.subtotalHT,
    totalTVA: totals.totalTVA,
    stampDuty: totals.stampDuty,
    totalTTC: totals.totalTTC,
    amountPaid: initialData?.amountPaid || 0,
    balanceDue: totals.balanceDue,
    amountInWords: wordsText,
  };

  // Save handler
  const handleSave = async (targetStatus?: string) => {
    setIsSaving(true);
    try {
      const docToSave: Partial<DocumentData> = {
        ...liveDocumentState,
        status: (targetStatus || status) as any,
      };

      const saved = await repositories.documents.save(docToSave);
      router.push(`/app/documents/${saved.id}`);
    } catch (err) {
      console.error('Error saving document:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Show a loading screen while checking setup status
  if (isCheckingSetup) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Chargement de l&apos;éditeur...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-24 sm:pb-16">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            title="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#1C4A3D]">
              {initialData ? 'Éditer le document' : 'Créer un nouveau document'}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-mono">{docNumber}</p>
          </div>
        </div>

        {/* Mobile View Selector */}
        <div className="flex md:hidden bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setMobileTab('form')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center space-x-1 ${
              mobileTab === 'form' ? 'bg-white shadow text-[#1C4A3D]' : 'text-slate-600'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Éditeur</span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center space-x-1 ${
              mobileTab === 'preview' ? 'bg-white shadow text-[#1C4A3D]' : 'text-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu</span>
          </button>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={() => handleSave('BROUILLON')}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm"
          >
            Brouillon
          </button>
          <button
            onClick={() => handleSave('ENVOYE')}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold bg-[#1C4A3D] text-white rounded-lg hover:bg-[#15382e] transition shadow-md flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer le document</span>
          </button>
        </div>
      </header>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Editor */}
          <div
            className={`lg:col-span-6 space-y-6 ${
              mobileTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* General Info Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b pb-2">
                Informations du Document
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Doc Type */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Type de Document</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocType)}
                    className="w-full text-sm border-slate-300 rounded-lg shadow-sm focus:border-[#1C4A3D] focus:ring-[#1C4A3D] p-2 border"
                  >
                    <option value="FACTURE">Facture</option>
                    <option value="DEVIS">Devis</option>
                    <option value="PROFORMA">Facture Proforma</option>
                    <option value="BON_COMMANDE">Bon de commande</option>
                    <option value="BON_LIVRAISON">Bon de livraison</option>
                  </select>
                </div>

                {/* Number */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Numéro</label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full text-sm border-slate-300 rounded-lg shadow-sm focus:border-[#1C4A3D] focus:ring-[#1C4A3D] p-2 border font-mono font-semibold"
                  />
                </div>

                {/* Dates */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date d&apos;Émission</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full text-sm border-slate-300 rounded-lg shadow-sm focus:border-[#1C4A3D] focus:ring-[#1C4A3D] p-2 border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date d&apos;Échéance</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-sm border-slate-300 rounded-lg shadow-sm focus:border-[#1C4A3D] focus:ring-[#1C4A3D] p-2 border"
                  />
                </div>
              </div>

              {/* Payment Method (Driven Stamp Duty for Facture) */}
              {docType === 'FACTURE' && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mode de Paiement (Détermine le Droit de Timbre)
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full text-sm border-slate-300 rounded-lg shadow-sm focus:border-[#1C4A3D] focus:ring-[#1C4A3D] p-2 border bg-amber-50/50 font-medium"
                  >
                    <option value="VIREMENT">Virement bancaire (Sans droit de timbre)</option>
                    <option value="ESPECES">Espèces (Droit de timbre appliqué)</option>
                    <option value="CHEQUE">Chèque (Sans droit de timbre)</option>
                    <option value="CCP">Chèque CCP (Sans droit de timbre)</option>
                    <option value="CARTE">Carte bancaire / CIB (Sans droit de timbre)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Company Info Card (Émetteur) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Émetteur (Votre Entreprise)
                </h2>
                <button
                  type="button"
                  onClick={handleOpenCompanyModal}
                  className="text-xs text-[#1C4A3D] font-semibold flex items-center space-x-1 hover:underline bg-[#1C4A3D]/10 px-2.5 py-1 rounded-lg"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Éditer Mon Entreprise</span>
                </button>
              </div>

              <div className="flex justify-between items-start text-xs text-slate-700">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{company?.name || 'Mon Entreprise DZ'}</div>
                  {company?.address && <div className="text-slate-600">{company.address}</div>}
                  {company?.wilaya && <div className="text-slate-600">{company.wilaya}</div>}
                  <div className="text-slate-500 pt-0.5 flex flex-wrap gap-x-3 gap-y-1">
                    {company?.phone && <span>Tél: {company.phone}</span>}
                    {company?.rc && <span>RC: {company.rc}</span>}
                    {company?.nif && <span>NIF: {company.nif}</span>}
                  </div>
                </div>
                {company?.logoUrl && (
                  <img src={company.logoUrl} alt="Logo" className="h-10 w-10 object-contain rounded border border-slate-200 bg-white" />
                )}
              </div>
            </div>

            {/* Client Picker Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Sélection du Client
                </h2>
                <button
                  type="button"
                  onClick={() => setShowClientModal(true)}
                  className="text-xs text-[#1C4A3D] font-semibold flex items-center space-x-1 hover:underline"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Nouveau Client</span>
                </button>
              </div>

              <select
                value={selectedClientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full text-sm border-slate-300 rounded-lg shadow-sm focus:border-[#1C4A3D] focus:ring-[#1C4A3D] p-2 border"
              >
                <option value="">-- Choisir un client dans le CRM --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.wilaya ? `(${c.wilaya})` : ''}
                  </option>
                ))}
              </select>

              {/* Client Snapshot Summary */}
              {selectedClientId && clientSnapshot.name && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{clientSnapshot.name}</div>
                  {clientSnapshot.address && <div className="text-slate-600">{clientSnapshot.address}</div>}
                  {clientSnapshot.wilaya && <div className="text-slate-600">{clientSnapshot.wilaya}</div>}
                  <div className="text-slate-500 pt-0.5 flex flex-wrap gap-3">
                    {clientSnapshot.nif && <span>NIF: {clientSnapshot.nif}</span>}
                    {clientSnapshot.rc && <span>RC: {clientSnapshot.rc}</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Line Items Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Articles / Prestations ({lines.length})
                </h2>
                <button
                  type="button"
                  onClick={handleAddLine}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une ligne</span>
                </button>
              </div>

              <div className="space-y-4">
                {lines.map((line, idx) => (
                  <div
                    key={line.id || idx}
                    className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 relative group space-y-3"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-bold text-[#1C4A3D]">Ligne #{idx + 1}</span>
                      {lines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          className="text-red-500 hover:text-red-700 p-1 transition"
                          title="Supprimer la ligne"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Catalog Autocomplete & Designation */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-medium text-slate-600">Désignation</label>
                        {products.length > 0 && (
                          <select
                            onChange={(e) => handleLineChange(idx, 'productId', e.target.value)}
                            className="text-[11px] text-[#1C4A3D] font-medium bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                          >
                            <option value="">Remplir depuis catalogue...</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.designation} ({p.defaultUnitPrice} DA)
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Description du produit ou service..."
                        value={line.designation}
                        onChange={(e) => handleLineChange(idx, 'designation', e.target.value)}
                        className="w-full text-sm border-slate-300 rounded-md p-2 border bg-white"
                      />
                    </div>

                    {/* Line Quantities & Prices */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-medium text-slate-600 mb-1">Quantité</label>
                        <NumberInput
                          step="0.01"
                          value={line.quantity}
                          onChange={(val) => handleLineChange(idx, 'quantity', val)}
                          className="w-full border-slate-300 rounded-md p-1.5 border bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-slate-600 mb-1">Unité</label>
                        <input
                          type="text"
                          value={line.unit}
                          onChange={(e) => handleLineChange(idx, 'unit', e.target.value)}
                          className="w-full border-slate-300 rounded-md p-1.5 border bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-slate-600 mb-1">Prix U. HT (DA)</label>
                        <NumberInput
                          step="0.01"
                          value={line.unitPrice}
                          onChange={(val) => handleLineChange(idx, 'unitPrice', val)}
                          className="w-full border-slate-300 rounded-md p-1.5 border bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-slate-600 mb-1">Remise %</label>
                        <NumberInput
                          step="0.01"
                          min={0}
                          max={100}
                          value={line.discountPct}
                          onChange={(val) => handleLineChange(idx, 'discountPct', val)}
                          className="w-full border-slate-300 rounded-md p-1.5 border bg-white font-mono"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-slate-600 mb-1">Taux TVA</label>
                        <select
                          value={line.tvaRate}
                          onChange={(e) => handleLineChange(idx, 'tvaRate', parseInt(e.target.value))}
                          className="w-full border-slate-300 rounded-md p-1.5 border bg-white font-medium"
                        >
                          <option value={19}>19% (Standard)</option>
                          <option value={9}>9% (Réduit)</option>
                          <option value={0}>0% (Exonéré)</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <div className="w-full bg-slate-100 rounded-md p-1.5 text-right">
                          <span className="block text-[10px] text-slate-500 mb-0.5">Total HT</span>
                          <span className="font-mono font-bold text-slate-800 text-xs">
                            {line.totalHT.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Notes & Conditions Particulières
              </label>
              <textarea
                rows={3}
                placeholder="Renseignez ici des conditions de paiement, coordonnées RIB, ou mentions légales particulières..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs border-slate-300 rounded-lg p-2.5 border"
              />
            </div>

            {/* Totals Panel Widget */}
            <TotalsPanel
              totals={totals}
              paymentMethod={paymentMethod}
              docType={docType}
              amountInWordsText={wordsText}
            />
          </div>

          {/* Right Column: Live A4 Preview */}
          <div
            className={`lg:col-span-6 ${
              mobileTab === 'form' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Aperçu du document A4 (Temps réel)
                </span>
              </div>
              <DocumentPreview document={liveDocumentState} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 p-3 sm:hidden shadow-lg flex items-center justify-between gap-3">
        <button
          onClick={() => handleSave('BROUILLON')}
          disabled={isSaving}
          className="flex-1 py-2.5 px-3 text-xs font-bold border border-slate-300 rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm text-center"
        >
          Brouillon
        </button>
        <button
          onClick={() => handleSave('ENVOYE')}
          disabled={isSaving}
          className="flex-1 py-2.5 px-3 text-xs font-bold bg-[#1C4A3D] text-white rounded-xl hover:bg-[#15382e] transition shadow-md flex items-center justify-center space-x-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer</span>
        </button>
      </div>

      {/* Modal: New Client Inline Dialog */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              Ajouter un Nouveau Client
            </h3>
            <form onSubmit={handleSaveNewClient} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nom / Raison Sociale *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: SARL Djazair Tech"
                  value={newClientData.name}
                  onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                  className="w-full border-slate-300 rounded p-2 border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Type Client</label>
                  <select
                    value={newClientData.type}
                    onChange={(e) => setNewClientData({ ...newClientData, type: e.target.value as any })}
                    className="w-full border-slate-300 rounded p-2 border"
                  >
                    <option value="INDIVIDUAL">Particulier</option>
                    <option value="BUSINESS">Entreprise (SARL/EURL)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Wilaya</label>
                  <input
                    type="text"
                    placeholder="16 - Alger"
                    value={newClientData.wilaya || ''}
                    onChange={(e) => setNewClientData({ ...newClientData, wilaya: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  placeholder="Adresse complète"
                  value={newClientData.address || ''}
                  onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                  className="w-full border-slate-300 rounded p-2 border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">NIF (Fiscal)</label>
                  <input
                    type="text"
                    value={newClientData.nif || ''}
                    onChange={(e) => setNewClientData({ ...newClientData, nif: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">RC (Commerce)</label>
                  <input
                    type="text"
                    value={newClientData.rc || ''}
                    onChange={(e) => setNewClientData({ ...newClientData, rc: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C4A3D] text-white rounded font-semibold hover:bg-[#15382e]"
                >
                  Créer & Sélectionner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Company Profile Inline Dialog */}
      {showCompanyModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isGuestSetupRequired
            ? 'bg-gradient-to-br from-[#1C4A3D]/95 to-slate-900/95 backdrop-blur-md'
            : 'bg-slate-900/50 backdrop-blur-sm'
        }`}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                {isGuestSetupRequired ? (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Première utilisation
                    </span>
                  </div>
                ) : null}
                <h3 className="text-base font-bold text-slate-900">
                  {isGuestSetupRequired ? 'Configurez votre entreprise' : 'Informations de votre Entreprise'}
                </h3>
                {isGuestSetupRequired && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ces informations apparaîtront sur toutes vos factures et documents.
                  </p>
                )}
              </div>
              {!isGuestSetupRequired && (
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  Émetteur des factures
                </span>
              )}
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Raison Sociale / Nom Entreprise *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: EURL Mon Entreprise DZ"
                  value={companyFormData.name || ''}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                  className="w-full border-slate-300 rounded p-2 border font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">URL du Logo</label>
                  <input
                    type="url"
                    placeholder="https://.../logo.png"
                    value={companyFormData.logoUrl || ''}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, logoUrl: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wilaya</label>
                  <input
                    type="text"
                    placeholder="16 - Alger"
                    value={companyFormData.wilaya || ''}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, wilaya: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Adresse physique</label>
                <input
                  type="text"
                  placeholder="Zone industrielle, Alger"
                  value={companyFormData.address || ''}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, address: e.target.value })}
                  className="w-full border-slate-300 rounded p-2 border"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    placeholder="0550 00 00 00"
                    value={companyFormData.phone || ''}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, phone: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email professionnel</label>
                  <input
                    type="email"
                    placeholder="contact@entreprise.dz"
                    value={companyFormData.email || ''}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, email: e.target.value })}
                    className="w-full border-slate-300 rounded p-2 border"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="block font-bold text-slate-800 uppercase tracking-wide text-[11px] mb-2">
                  Identifiants Fiscaux Algériens
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">RC (Registre Commerce)</label>
                    <input
                      type="text"
                      placeholder="16/00-1234567B26"
                      value={companyFormData.rc || ''}
                      onChange={(e) => setCompanyFormData({ ...companyFormData, rc: e.target.value })}
                      className="w-full border-slate-300 rounded p-2 border font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">NIF (Identification Fiscale)</label>
                    <input
                      type="text"
                      placeholder="002616123456789"
                      value={companyFormData.nif || ''}
                      onChange={(e) => setCompanyFormData({ ...companyFormData, nif: e.target.value })}
                      className="w-full border-slate-300 rounded p-2 border font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">AI (Article Imposition)</label>
                    <input
                      type="text"
                      placeholder="16011234567"
                      value={companyFormData.ai || ''}
                      onChange={(e) => setCompanyFormData({ ...companyFormData, ai: e.target.value })}
                      className="w-full border-slate-300 rounded p-2 border font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">NIS (Identification Statistique)</label>
                    <input
                      type="text"
                      placeholder="002616011234567"
                      value={companyFormData.nis || ''}
                      onChange={(e) => setCompanyFormData({ ...companyFormData, nis: e.target.value })}
                      className="w-full border-slate-300 rounded p-2 border font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coordonnées Bancaires / RIB / CCP</label>
                <input
                  type="text"
                  placeholder="ex: RIB BNA: 001 00810 0300 000123 45 | CCP: 007999999 Clé 99"
                  value={companyFormData.rib || ''}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, rib: e.target.value })}
                  className="w-full border-slate-300 rounded p-2 border font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                {!isGuestSetupRequired && (
                  <button
                    type="button"
                    onClick={() => setShowCompanyModal(false)}
                    className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Annuler
                  </button>
                )}
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded font-bold shadow transition ${
                    isGuestSetupRequired
                      ? 'bg-[#1C4A3D] hover:bg-[#15382e] w-full py-3 text-sm'
                      : 'bg-[#1C4A3D] hover:bg-[#15382e]'
                  }`}
                >
                  {isGuestSetupRequired ? '✓ Commencer à créer mes documents' : 'Enregistrer l\'Entreprise'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
