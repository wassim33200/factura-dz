import { DocumentData, ClientData, ProductData, CompanyData, PaymentData, DocType } from '../types';

export interface IDocumentRepository {
  getAll(): Promise<DocumentData[]>;
  getById(id: string): Promise<DocumentData | null>;
  save(doc: Partial<DocumentData>): Promise<DocumentData>;
  delete(id: string): Promise<boolean>;
  recordPayment(docId: string, payment: Omit<PaymentData, 'id'>): Promise<DocumentData>;
  convertToFacture(devisId: string): Promise<DocumentData>;
  generateNumber(type: DocType): Promise<string>;
}

export interface IClientRepository {
  getAll(): Promise<ClientData[]>;
  getById(id: string): Promise<ClientData | null>;
  save(client: Partial<ClientData>): Promise<ClientData>;
  delete(id: string): Promise<boolean>;
}

export interface IProductRepository {
  getAll(): Promise<ProductData[]>;
  getById(id: string): Promise<ProductData | null>;
  save(product: Partial<ProductData>): Promise<ProductData>;
  delete(id: string): Promise<boolean>;
}

export interface ICompanyRepository {
  get(): Promise<CompanyData>;
  save(company: Partial<CompanyData>): Promise<CompanyData>;
}

export interface AppRepositories {
  documents: IDocumentRepository;
  clients: IClientRepository;
  products: IProductRepository;
  company: ICompanyRepository;
}
