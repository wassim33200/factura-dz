/**
 * French Number to Words Converter for Algerian Dinars
 * Strictly compliant with French grammar rules (80="quatre-vingts", 1000="mille", 41055="quarante et un mille cinquante-cinq")
 */

const UNITS = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'
];

const TENS: { [key: number]: string } = {
  10: 'dix',
  20: 'vingt',
  30: 'trente',
  40: 'quarante',
  50: 'cinquante',
  60: 'soixante',
  70: 'soixante-dix',
  80: 'quatre-vingt',
  90: 'quatre-vingt-dix',
};

function convertLessThanThousand(n: number): string {
  if (n === 0) return '';
  let words = '';

  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;

  if (hundreds > 0) {
    if (hundreds === 1) {
      words += 'cent';
    } else {
      words += `${UNITS[hundreds]} cent`;
      if (remainder === 0) {
        words += 's';
      }
    }
  }

  if (remainder > 0) {
    if (words.length > 0) words += ' ';

    if (remainder <= 16) {
      words += UNITS[remainder];
    } else if (remainder < 20) {
      words += `dix-${UNITS[remainder - 10]}`;
    } else if (remainder < 70) {
      const tensDigit = Math.floor(remainder / 10) * 10;
      const unitDigit = remainder % 10;
      if (unitDigit === 0) {
        words += TENS[tensDigit];
      } else if (unitDigit === 1) {
        words += `${TENS[tensDigit]} et un`;
      } else {
        words += `${TENS[tensDigit]}-${UNITS[unitDigit]}`;
      }
    } else if (remainder < 80) {
      // 70-79: soixante + (10..19)
      const unitDigit = remainder - 60;
      if (unitDigit === 11) {
        words += 'soixante et onze';
      } else if (unitDigit <= 16) {
        words += `soixante-${UNITS[unitDigit]}`;
      } else {
        words += `soixante-dix-${UNITS[unitDigit - 10]}`;
      }
    } else if (remainder === 80) {
      words += 'quatre-vingts';
    } else if (remainder < 90) {
      // 81-89: quatre-vingt-un..neuf (no "et")
      const unitDigit = remainder - 80;
      words += `quatre-vingt-${UNITS[unitDigit]}`;
    } else {
      // 90-99: quatre-vingt-dix..seize / dix-sept..dix-neuf
      const unitDigit = remainder - 80;
      if (unitDigit <= 16) {
        words += `quatre-vingt-${UNITS[unitDigit]}`;
      } else {
        words += `quatre-vingt-dix-${UNITS[unitDigit - 10]}`;
      }
    }
  }

  return words;
}

export function numberToFrenchWords(num: number): string {
  if (isNaN(num) || num < 0) return 'zéro';
  const integerPart = Math.floor(num);
  if (integerPart === 0) return 'zéro';

  let remaining = integerPart;

  const billions = Math.floor(remaining / 1_000_000_000);
  remaining %= 1_000_000_000;

  const millions = Math.floor(remaining / 1_000_000);
  remaining %= 1_000_000;

  const thousands = Math.floor(remaining / 1_000);
  remaining %= 1_000;

  const units = remaining;

  const parts: string[] = [];

  if (billions > 0) {
    if (billions === 1) {
      parts.push('un milliard');
    } else {
      parts.push(`${convertLessThanThousand(billions)} milliards`);
    }
  }

  if (millions > 0) {
    if (millions === 1) {
      parts.push('un million');
    } else {
      parts.push(`${convertLessThanThousand(millions)} millions`);
    }
  }

  if (thousands > 0) {
    if (thousands === 1) {
      parts.push('mille');
    } else {
      parts.push(`${convertLessThanThousand(thousands)} mille`);
    }
  }

  if (units > 0) {
    parts.push(convertLessThanThousand(units));
  }

  let text = parts.join(' ').trim();
  return text;
}

/**
 * Format full amount in words for Algerian Dinars
 * e.g., 41055 -> "quarante et un mille cinquante-cinq dinars algériens"
 */
export function amountInWords(amount: number): string {
  if (amount === null || amount === undefined || isNaN(amount) || amount <= 0) {
    return 'Arrêté la présente facture à la somme de : zéro dinar algérien.';
  }

  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  const integerPart = Math.floor(rounded);
  const cents = Math.round((rounded - integerPart) * 100);

  const integerWords = numberToFrenchWords(integerPart);

  let dinarNoun = 'dinars algériens';
  if (integerPart === 1) {
    dinarNoun = 'dinar algérien';
  }

  // Check if "de" is needed for exact millions/billions without subsequent numbers
  let needsDe = false;
  if (integerPart >= 1_000_000 && integerPart % 1_000_000 === 0) {
    needsDe = true;
  }

  let result = `${integerWords} ${needsDe ? 'de ' : ''}${dinarNoun}`;

  if (cents > 0) {
    const centsWords = convertLessThanThousand(cents);
    const centNoun = cents === 1 ? 'centime' : 'centimes';
    result += ` et ${centsWords} ${centNoun}`;
  }

  // Capitalize first letter
  const formatted = result.charAt(0).toUpperCase() + result.slice(1);
  return `Arrêté la présente facture à la somme de : ${formatted}.`;
}
