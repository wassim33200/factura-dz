import { round2 } from '../utils/format';

export interface LineInput {
  quantity: number;
  unitPrice: number;
  discountPct?: number;
  tvaRate: number; // 0 | 9 | 19
}

export interface VatBreakdown {
  rate: number;
  baseHT: number;
  amountTVA: number;
}

export interface DocumentTotals {
  subtotalHT: number;
  vatBreakdown: VatBreakdown[];
  totalTVA: number;
  totalTTC: number;
  stampDuty: number;
  netAPayer: number;
  balanceDue: number;
}

/**
 * Calculate single line total HT
 */
export function calculateLineTotalHT(quantity: number, unitPrice: number, discountPct: number = 0): number {
  const qty = Number(quantity) || 0;
  const price = Number(unitPrice) || 0;
  const discount = Number(discountPct) || 0;
  const rawTotal = qty * price * (1 - discount / 100);
  return round2(rawTotal);
}

/**
 * Calculate Stamp Duty (Droit de timbre - Loi de Finances 2025)
 * Applies ONLY to Facture paid in cash (ESPECES).
 * Brackets:
 *  - <= 300 DA: 0 (Exempt)
 *  - 300 - 30 000 DA: 1%
 *  - 30 000 - 100 000 DA: 1.5%
 *  - > 100 000 DA: 2%
 * Minimum 5 DA when applicable. Rounded UP to nearest integer DA.
 */
export function calculateStampDuty(totalTTC: number, paymentMethod?: string | null, docType?: string): number {
  if (docType && docType !== 'FACTURE') {
    return 0;
  }
  if (paymentMethod !== 'ESPECES') {
    return 0;
  }
  if (totalTTC <= 300) {
    return 0;
  }

  let rate = 0.01;
  if (totalTTC > 100000) {
    rate = 0.02;
  } else if (totalTTC > 30000) {
    rate = 0.015;
  }

  const rawDuty = Math.ceil(totalTTC * rate);
  return Math.max(rawDuty, 5);
}

/**
 * Calculate complete document totals
 */
export function calculateDocumentTotals(
  lines: LineInput[],
  paymentMethod?: string | null,
  docType: string = 'FACTURE',
  amountPaid: number = 0
): DocumentTotals {
  let subtotalHT = 0;
  const vatMap = new Map<number, number>();

  for (const line of lines) {
    const lineHT = calculateLineTotalHT(line.quantity, line.unitPrice, line.discountPct || 0);
    subtotalHT += lineHT;

    const rate = Number(line.tvaRate) || 0;
    const currentBase = vatMap.get(rate) || 0;
    vatMap.set(rate, currentBase + lineHT);
  }

  subtotalHT = round2(subtotalHT);

  const vatBreakdown: VatBreakdown[] = [];
  let totalTVA = 0;

  // Sort VAT rates descending (19, 9, 0)
  const rates = Array.from(vatMap.keys()).sort((a, b) => b - a);
  for (const rate of rates) {
    const baseHT = round2(vatMap.get(rate) || 0);
    const amountTVA = round2(baseHT * (rate / 100));
    totalTVA += amountTVA;
    vatBreakdown.push({
      rate,
      baseHT,
      amountTVA,
    });
  }

  totalTVA = round2(totalTVA);
  const totalTTC = round2(subtotalHT + totalTVA);

  const stampDuty = calculateStampDuty(totalTTC, paymentMethod, docType);
  const netAPayer = round2(totalTTC + stampDuty);
  const balanceDue = Math.max(0, round2(netAPayer - (amountPaid || 0)));

  return {
    subtotalHT,
    vatBreakdown,
    totalTVA,
    totalTTC,
    stampDuty,
    netAPayer,
    balanceDue,
  };
}
