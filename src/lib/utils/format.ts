/**
 * Round a number to 2 decimal places reliably.
 */
export function round2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Format an amount in Algerian Dinars (DA)
 * Example: 34500 -> "34 500,00 DA"
 */
export function formatDA(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0,00 DA';
  }
  const rounded = round2(amount);
  const parts = rounded.toFixed(2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const decimalPart = parts[1];
  return `${integerPart},${decimalPart} DA`;
}

/**
 * Format date in French format: DD/MM/YYYY
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
