import { openDB, IDBPDatabase } from 'idb';
import {
  IDocumentRepository,
  IClientRepository,
  IProductRepository,
  ICompanyRepository,
} from './types';
import { DocumentData, ClientData, ProductData, CompanyData, PaymentData, DocType } from '../types';
import { calculateDocumentTotals } from '../calc/tax';
import { amountInWords } from '../calc/numberToWords';

const DB_NAME = 'factura_dz_db';
const DB_VERSION = 1;

async function getDB(): Promise<IDBPDatabase> {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is only available in browser');
  }

  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('documents')) {
        db.createObjectStore('documents', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('clients')) {
        db.createObjectStore('clients', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('company')) {
        db.createObjectStore('company', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('counters')) {
        db.createObjectStore('counters', { keyPath: 'id' });
      }
    },
  });
}

const PREFIX_MAP: Record<DocType, string> = {
  FACTURE: 'FAC',
  DEVIS: 'DEV',
  PROFORMA: 'PRO',
  BON_COMMANDE: 'BC',
  BON_LIVRAISON: 'BL',
};

const DEFAULT_COMPANY: CompanyData = {
  id: 'guest_company',
  name: 'Mon Entreprise DZ',
  wilaya: '16 - Alger',
  address: '123 Rue Hassiba Ben Bouali, Alger',
  phone: '0550 12 34 56',
  email: 'contact@monentreprise.dz',
  rc: '16/00-1234567B26',
  nif: '002616123456789',
  ai: '16011234567',
  nis: '002616011234567',
  rib: 'CCP 007 9999999 Key 99',
};

export class LocalCompanyRepository implements ICompanyRepository {
  async get(): Promise<CompanyData> {
    const db = await getDB();
    const company = await db.get('company', 'guest_company');
    if (!company) {
      await db.put('company', DEFAULT_COMPANY);
      return DEFAULT_COMPANY;
    }
    return company;
  }

  async save(company: Partial<CompanyData>): Promise<CompanyData> {
    const db = await getDB();
    const current = await this.get();
    const updated = { ...current, ...company, id: 'guest_company' };
    await db.put('company', updated);
    return updated;
  }
}

export class LocalClientRepository implements IClientRepository {
  async getAll(): Promise<ClientData[]> {
    const db = await getDB();
    return db.getAll('clients');
  }

  async getById(id: string): Promise<ClientData | null> {
    const db = await getDB();
    const client = await db.get('clients', id);
    return client || null;
  }

  async save(client: Partial<ClientData>): Promise<ClientData> {
    const db = await getDB();
    const id = client.id || `client_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const fullClient: ClientData = {
      id,
      companyId: 'guest_company',
      type: client.type || 'INDIVIDUAL',
      name: client.name || 'Nouveau Client',
      address: client.address || '',
      wilaya: client.wilaya || '',
      phone: client.phone || '',
      email: client.email || '',
      rc: client.rc || '',
      nif: client.nif || '',
      createdAt: client.createdAt || new Date().toISOString(),
    };
    await db.put('clients', fullClient);
    return fullClient;
  }

  async delete(id: string): Promise<boolean> {
    const db = await getDB();
    await db.delete('clients', id);
    return true;
  }
}

export class LocalProductRepository implements IProductRepository {
  async getAll(): Promise<ProductData[]> {
    const db = await getDB();
    return db.getAll('products');
  }

  async getById(id: string): Promise<ProductData | null> {
    const db = await getDB();
    const product = await db.get('products', id);
    return product || null;
  }

  async save(product: Partial<ProductData>): Promise<ProductData> {
    const db = await getDB();
    const id = product.id || `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const fullProduct: ProductData = {
      id,
      companyId: 'guest_company',
      designation: product.designation || 'Nouveau Produit / Service',
      unit: product.unit || 'unité',
      defaultUnitPrice: Number(product.defaultUnitPrice) || 0,
      defaultTvaRate: Number(product.defaultTvaRate) ?? 19,
      createdAt: product.createdAt || new Date().toISOString(),
    };
    await db.put('products', fullProduct);
    return fullProduct;
  }

  async delete(id: string): Promise<boolean> {
    const db = await getDB();
    await db.delete('products', id);
    return true;
  }
}

export class LocalDocumentRepository implements IDocumentRepository {
  private companyRepo = new LocalCompanyRepository();

  async generateNumber(type: DocType): Promise<string> {
    const db = await getDB();
    const year = new Date().getFullYear();
    const prefix = PREFIX_MAP[type] || 'DOC';
    const counterKey = `${type}_${year}`;

    const counter = (await db.get('counters', counterKey)) || { id: counterKey, lastNumber: 0 };
    const nextNumber = counter.lastNumber + 1;
    await db.put('counters', { id: counterKey, lastNumber: nextNumber });

    const seq = String(nextNumber).padStart(4, '0');
    return `${prefix}-${year}-${seq}`;
  }

  async getAll(): Promise<DocumentData[]> {
    const db = await getDB();
    const docs: DocumentData[] = await db.getAll('documents');
    return docs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getById(id: string): Promise<DocumentData | null> {
    const db = await getDB();
    const doc = await db.get('documents', id);
    return doc || null;
  }

  async save(doc: Partial<DocumentData>): Promise<DocumentData> {
    const db = await getDB();
    const company = await this.companyRepo.get();

    const type: DocType = doc.type || 'FACTURE';
    const number = doc.number || (await this.generateNumber(type));
    const id = doc.id || `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const lines = (doc.lines || []).map((l, index) => ({
      id: l.id || `line_${Date.now()}_${index}`,
      productId: l.productId || null,
      designation: l.designation || '',
      quantity: Number(l.quantity) || 1,
      unit: l.unit || 'unité',
      unitPrice: Number(l.unitPrice) || 0,
      discountPct: Number(l.discountPct) || 0,
      tvaRate: Number(l.tvaRate) ?? 19,
      totalHT: (Number(l.quantity) || 1) * (Number(l.unitPrice) || 0) * (1 - (Number(l.discountPct) || 0) / 100),
      position: index,
    }));

    const payments = doc.payments || [];
    const amountPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    const totals = calculateDocumentTotals(lines, doc.paymentMethod, type, amountPaid);

    const textInWords = amountInWords(totals.netAPayer);

    const fullDoc: DocumentData = {
      id,
      companyId: 'guest_company',
      type,
      number,
      status: doc.status || 'BROUILLON',
      issueDate: doc.issueDate || new Date().toISOString(),
      dueDate: doc.dueDate || null,
      clientId: doc.clientId || null,
      clientSnapshot: doc.clientSnapshot || {},
      companySnapshot: doc.companySnapshot || company,
      paymentMethod: doc.paymentMethod || null,
      notes: doc.notes || '',
      convertedFromId: doc.convertedFromId || null,
      lines,
      payments,
      subtotalHT: totals.subtotalHT,
      totalTVA: totals.totalTVA,
      stampDuty: totals.stampDuty,
      totalTTC: totals.totalTTC,
      amountPaid: totals.netAPayer > 0 && amountPaid >= totals.netAPayer ? totals.netAPayer : amountPaid,
      balanceDue: totals.balanceDue,
      amountInWords: textInWords,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.put('documents', fullDoc);
    return fullDoc;
  }

  async delete(id: string): Promise<boolean> {
    const db = await getDB();
    await db.delete('documents', id);
    return true;
  }

  async recordPayment(docId: string, payment: Omit<PaymentData, 'id'>): Promise<DocumentData> {
    const doc = await this.getById(docId);
    if (!doc) throw new Error('Document not found');

    const newPayment: PaymentData = {
      id: `pay_${Date.now()}`,
      amount: Number(payment.amount),
      date: payment.date || new Date().toISOString(),
      method: payment.method,
      note: payment.note || '',
    };

    const updatedPayments = [...(doc.payments || []), newPayment];

    let newStatus = doc.status;
    const totals = calculateDocumentTotals(doc.lines, doc.paymentMethod, doc.type, 0);
    const newAmountPaid = updatedPayments.reduce((acc, p) => acc + p.amount, 0);

    if (newAmountPaid >= totals.netAPayer) {
      newStatus = 'PAYEE';
    } else if (newAmountPaid > 0) {
      newStatus = 'PARTIELLEMENT_PAYEE';
    }

    return this.save({
      ...doc,
      payments: updatedPayments,
      status: newStatus,
    });
  }

  async convertToFacture(devisId: string): Promise<DocumentData> {
    const devis = await this.getById(devisId);
    if (!devis) throw new Error('Document source introuvable');

    const newNumber = await this.generateNumber('FACTURE');
    const factureData: Partial<DocumentData> = {
      type: 'FACTURE',
      number: newNumber,
      status: 'BROUILLON',
      issueDate: new Date().toISOString(),
      clientId: devis.clientId,
      clientSnapshot: devis.clientSnapshot,
      companySnapshot: devis.companySnapshot,
      paymentMethod: 'VIREMENT',
      notes: `Facture générée depuis le document ${devis.number}`,
      convertedFromId: devis.id,
      lines: devis.lines.map((l, idx) => ({ ...l, id: `line_conv_${Date.now()}_${idx}` })),
    };

    const newFacture = await this.save(factureData);

    // Update devis status to ACCEPTE if needed
    await this.save({
      ...devis,
      status: 'ACCEPTE',
    });

    return newFacture;
  }
}
