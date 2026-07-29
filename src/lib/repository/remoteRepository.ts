import {
  IDocumentRepository,
  IClientRepository,
  IProductRepository,
  ICompanyRepository,
} from './types';
import { DocumentData, ClientData, ProductData, CompanyData, PaymentData, DocType } from '../types';

export class RemoteCompanyRepository implements ICompanyRepository {
  async get(): Promise<CompanyData> {
    const res = await fetch('/api/company');
    if (!res.ok) throw new Error('Failed to fetch company profile');
    return res.json();
  }

  async save(company: Partial<CompanyData>): Promise<CompanyData> {
    const res = await fetch('/api/company', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    });
    if (!res.ok) throw new Error('Failed to save company profile');
    return res.json();
  }
}

export class RemoteClientRepository implements IClientRepository {
  async getAll(): Promise<ClientData[]> {
    const res = await fetch('/api/clients');
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  }

  async getById(id: string): Promise<ClientData | null> {
    const res = await fetch(`/api/clients/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch client');
    return res.json();
  }

  async save(client: Partial<ClientData>): Promise<ClientData> {
    const isEdit = Boolean(client.id);
    const url = isEdit ? `/api/clients/${client.id}` : '/api/clients';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (!res.ok) throw new Error('Failed to save client');
    return res.json();
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    return res.ok;
  }
}

export class RemoteProductRepository implements IProductRepository {
  async getAll(): Promise<ProductData[]> {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  }

  async getById(id: string): Promise<ProductData | null> {
    const res = await fetch(`/api/products/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  }

  async save(product: Partial<ProductData>): Promise<ProductData> {
    const isEdit = Boolean(product.id);
    const url = isEdit ? `/api/products/${product.id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to save product');
    return res.json();
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    return res.ok;
  }
}

export class RemoteDocumentRepository implements IDocumentRepository {
  async generateNumber(type: DocType): Promise<string> {
    const res = await fetch(`/api/documents/next-number?type=${type}`);
    if (!res.ok) throw new Error('Failed to generate document number');
    const data = await res.json();
    return data.number;
  }

  async getAll(): Promise<DocumentData[]> {
    const res = await fetch('/api/documents');
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  }

  async getById(id: string): Promise<DocumentData | null> {
    const res = await fetch(`/api/documents/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch document');
    return res.json();
  }

  async save(doc: Partial<DocumentData>): Promise<DocumentData> {
    const isEdit = Boolean(doc.id);
    const url = isEdit ? `/api/documents/${doc.id}` : '/api/documents';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (!res.ok) throw new Error('Failed to save document');
    return res.json();
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    return res.ok;
  }

  async recordPayment(docId: string, payment: Omit<PaymentData, 'id'>): Promise<DocumentData> {
    const res = await fetch(`/api/documents/${docId}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    });
    if (!res.ok) throw new Error('Failed to record payment');
    return res.json();
  }

  async convertToFacture(devisId: string): Promise<DocumentData> {
    const res = await fetch(`/api/documents/${devisId}/convert`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to convert document to Facture');
    return res.json();
  }
}
