import { calculateDocumentTotals, calculateStampDuty } from '../tax';
import { numberToFrenchWords, amountInWords } from '../numberToWords';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('--- Running FacturaDZ Calculation Engine Tests ---');

// Test Case 1: 3 lines summing to 34 500 DA HT at 19% VAT
const lines1 = [
  { quantity: 1, unitPrice: 10000, tvaRate: 19 },
  { quantity: 2, unitPrice: 10000, tvaRate: 19 },
  { quantity: 1, unitPrice: 4500, tvaRate: 19 },
];

const totalsCash = calculateDocumentTotals(lines1, 'ESPECES', 'FACTURE');
assert(totalsCash.subtotalHT === 34500, `subtotalHT expected 34500, got ${totalsCash.subtotalHT}`);
assert(totalsCash.totalTVA === 6555, `totalTVA expected 6555, got ${totalsCash.totalTVA}`);
assert(totalsCash.totalTTC === 41055, `totalTTC expected 41055, got ${totalsCash.totalTTC}`);
assert(totalsCash.stampDuty === 616, `stampDuty (cash) expected 616, got ${totalsCash.stampDuty}`);
assert(totalsCash.netAPayer === 41671, `netAPayer expected 41671, got ${totalsCash.netAPayer}`);

const totalsTransfer = calculateDocumentTotals(lines1, 'VIREMENT', 'FACTURE');
assert(totalsTransfer.stampDuty === 0, `stampDuty (virement) expected 0, got ${totalsTransfer.stampDuty}`);
assert(totalsTransfer.netAPayer === 41055, `netAPayer (virement) expected 41055, got ${totalsTransfer.netAPayer}`);

// Test Case 2: Boundary Stamp Duty tests
assert(calculateStampDuty(300, 'ESPECES', 'FACTURE') === 0, '300 DA exact should be exempt');
assert(calculateStampDuty(30000, 'ESPECES', 'FACTURE') === 300, '30000 DA exact at 1% should be 300 DA');
assert(calculateStampDuty(30001, 'ESPECES', 'FACTURE') === 451, '30001 DA at 1.5% should be 451 DA');

// Test Case 3: French Number to Words QA tests
const words41055 = numberToFrenchWords(41055);
assert(words41055 === 'quarante et un mille cinquante-cinq', `41055 expected 'quarante et un mille cinquante-cinq', got '${words41055}'`);

const words80 = numberToFrenchWords(80);
assert(words80 === 'quatre-vingts', `80 expected 'quatre-vingts', got '${words80}'`);

const words91 = numberToFrenchWords(91);
assert(words91 === 'quatre-vingt-onze', `91 expected 'quatre-vingt-onze', got '${words91}'`);

const words1000 = numberToFrenchWords(1000);
assert(words1000 === 'mille', `1000 expected 'mille', got '${words1000}'`);

const words2M = numberToFrenchWords(2000000);
assert(words2M === 'deux millions', `2000000 expected 'deux millions', got '${words2M}'`);

const sentence41055 = amountInWords(41055);
assert(
  sentence41055.includes('Quarante et un mille cinquante-cinq dinars algériens'),
  `amountInWords(41055) expected 'Quarante et un mille cinquante-cinq dinars algériens', got '${sentence41055}'`
);

console.log('--- ALL QA CALCULATOR TESTS PASSED SUCCESSFULLY! ---');
