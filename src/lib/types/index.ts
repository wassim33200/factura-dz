export type DocType = 'FACTURE' | 'DEVIS' | 'PROFORMA' | 'BON_COMMANDE' | 'BON_LIVRAISON';

export type DocStatus =
  | 'BROUILLON'
  | 'ENVOYE'
  | 'ACCEPTE'
  | 'REFUSE'
  | 'CONFIRME'
  | 'LIVRE'
  | 'PARTIELLEMENT_PAYEE'
  | 'PAYEE'
  | 'EN_RETARD';

export type PaymentMethod = 'ESPECES' | 'VIREMENT' | 'CHEQUE' | 'CARTE' | 'CCP';

export type ClientType = 'INDIVIDUAL' | 'BUSINESS';

export interface CompanyData {
  id: string;
  name: string;
  logoUrl?: string | null;
  address?: string | null;
  wilaya?: string | null;
  phone?: string | null;
  email?: string | null;
  rc?: string | null;
  nif?: string | null;
  ai?: string | null;
  nis?: string | null;
  rib?: string | null;
}

export interface ClientData {
  id: string;
  companyId?: string;
  type: ClientType;
  name: string;
  address?: string | null;
  wilaya?: string | null;
  phone?: string | null;
  email?: string | null;
  rc?: string | null;
  nif?: string | null;
  createdAt?: string | Date;
}

export interface ProductData {
  id: string;
  companyId?: string;
  designation: string;
  unit: string;
  defaultUnitPrice: number;
  defaultTvaRate: number; // 0 | 9 | 19
  createdAt?: string | Date;
}

export interface DocumentLineData {
  id: string;
  productId?: string | null;
  designation: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPct: number;
  tvaRate: number; // 0 | 9 | 19
  totalHT: number;
  position: number;
}

export interface PaymentData {
  id: string;
  amount: number;
  date: string | Date;
  method: PaymentMethod;
  note?: string | null;
}

export interface DocumentData {
  id: string;
  companyId?: string;
  type: DocType;
  number: string;
  status: DocStatus;
  issueDate: string | Date;
  dueDate?: string | Date | null;
  clientId?: string | null;
  clientSnapshot: Partial<ClientData>;
  companySnapshot: Partial<CompanyData>;
  paymentMethod?: PaymentMethod | null;
  notes?: string | null;
  convertedFromId?: string | null;
  lines: DocumentLineData[];
  payments?: PaymentData[];
  subtotalHT: number;
  totalTVA: number;
  stampDuty: number;
  totalTTC: number;
  amountPaid: number;
  balanceDue: number;
  amountInWords: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
