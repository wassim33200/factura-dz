import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DocumentData } from '@/lib/types';
import { formatDA, formatDate } from '@/lib/utils/format';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 14,
    marginBottom: 14,
  },
  companyBlock: {
    flex: 1,
    paddingRight: 16,
  },
  companyName: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#1C4A3D',
    marginBottom: 3,
  },
  companyDetail: {
    fontSize: 8,
    color: '#475569',
    marginBottom: 2,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 10,
  },
  metaBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 9,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  boxTitle: {
    fontSize: 7,
    color: '#64748B',
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  docTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1C4A3D',
    marginBottom: 3,
  },
  metaText: {
    fontSize: 8,
    color: '#334155',
    marginBottom: 2,
  },
  clientName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    marginBottom: 2,
  },

  /* ───── Table ───── */
  table: {
    width: '100%',
    marginBottom: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1C4A3D',
    color: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 6,
    // Allow rows to grow for wrapped content
    minHeight: 20,
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },

  // Column widths – designation gets flex so it wraps naturally
  colDesignation: {
    flex: 1,          // takes all remaining space
    paddingRight: 4,
  },
  colQty: {
    width: 32,
    textAlign: 'center',
  },
  colUnit: {
    width: 36,
    textAlign: 'center',
  },
  colPrice: {
    width: 62,
    textAlign: 'right',
  },
  colTva: {
    width: 28,
    textAlign: 'center',
  },
  colTotal: {
    width: 62,
    textAlign: 'right',
  },

  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 8,
  },
  cellText: {
    fontSize: 8.5,
    color: '#1E293B',
  },
  cellTextMono: {
    fontSize: 8,
    color: '#1E293B',
    fontFamily: 'Helvetica',
  },

  /* ───── Totals ───── */
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 14,
    gap: 10,
  },
  totalsLeft: {
    flex: 1,
  },
  notesText: {
    fontSize: 8,
    color: '#475569',
    lineHeight: 1.4,
  },
  totalsRight: {
    width: 200,
    backgroundColor: '#F8FAFC',
    padding: 9,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2.5,
    gap: 8,
  },
  rowTotalLabel: {
    fontSize: 8,
    color: '#475569',
    flex: 1,
  },
  rowTotalValue: {
    fontSize: 8,
    color: '#1E293B',
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1C4A3D',
    color: '#FFFFFF',
    padding: 7,
    borderRadius: 3,
    marginTop: 5,
    gap: 8,
  },
  netLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    flex: 1,
  },
  netValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  stampRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2.5,
    gap: 8,
  },
  stampLabel: {
    fontSize: 8,
    color: '#B45309',
    flex: 1,
  },
  stampValue: {
    fontSize: 8,
    color: '#B45309',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },

  /* ───── Words ───── */
  wordsBox: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 4,
    fontSize: 8,
    fontStyle: 'italic',
    marginBottom: 14,
    color: '#334155',
    lineHeight: 1.4,
  },

  /* ───── Footer ───── */
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 32,
    right: 32,
    textAlign: 'center',
    fontSize: 7,
    color: '#94A3B8',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 7,
  },
  footerLine: {
    fontSize: 7,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 2,
  },
});

export const DocumentPdfTemplate: React.FC<{ doc: DocumentData }> = ({ doc }) => {
  const company = doc.companySnapshot || {};
  const client = doc.clientSnapshot || {};
  const lines = doc.lines || [];

  return (
    <Document title={`${doc.number}.pdf`}>
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>{company.name || 'Mon Entreprise DZ'}</Text>
            {company.address && <Text style={styles.companyDetail}>{company.address}</Text>}
            {company.wilaya && <Text style={styles.companyDetail}>{company.wilaya}</Text>}
            {(company.phone || company.email) && (
              <Text style={styles.companyDetail}>
                {[company.phone && `Tél: ${company.phone}`, company.email && `Email: ${company.email}`]
                  .filter(Boolean)
                  .join('  |  ')}
              </Text>
            )}
          </View>
        </View>

        {/* ── Meta & Client ── */}
        <View style={styles.metaGrid}>
          <View style={styles.metaBox}>
            <Text style={styles.boxTitle}>{doc.type}</Text>
            <Text style={styles.docTitle}>{doc.number}</Text>
            <Text style={styles.metaText}>Date: {formatDate(doc.issueDate)}</Text>
            {doc.dueDate && <Text style={styles.metaText}>Échéance: {formatDate(doc.dueDate)}</Text>}
            {doc.paymentMethod && <Text style={styles.metaText}>Paiement: {doc.paymentMethod}</Text>}
          </View>

          <View style={styles.metaBox}>
            <Text style={styles.boxTitle}>Client / Doit :</Text>
            <Text style={styles.clientName}>{client.name || 'Client'}</Text>
            {client.address && <Text style={styles.metaText}>{client.address}</Text>}
            {client.wilaya && <Text style={styles.metaText}>{client.wilaya}</Text>}
            {client.nif && <Text style={styles.metaText}>NIF: {client.nif}</Text>}
            {client.rc && <Text style={styles.metaText}>RC: {client.rc}</Text>}
          </View>
        </View>

        {/* ── Lines Table ── */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.colDesignation, styles.tableHeaderText]}>Désignation</Text>
            <Text style={[styles.colQty, styles.tableHeaderText]}>Qté</Text>
            <Text style={[styles.colUnit, styles.tableHeaderText]}>Unité</Text>
            <Text style={[styles.colPrice, styles.tableHeaderText]}>Prix U. HT</Text>
            <Text style={[styles.colTva, styles.tableHeaderText]}>TVA</Text>
            <Text style={[styles.colTotal, styles.tableHeaderText]}>Total HT</Text>
          </View>

          {lines.map((line, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
              {/* Designation wraps naturally because flex:1 */}
              <Text style={[styles.colDesignation, styles.cellText]}>{line.designation}</Text>
              <Text style={[styles.colQty, styles.cellTextMono]}>{line.quantity}</Text>
              <Text style={[styles.colUnit, styles.cellText]}>{line.unit}</Text>
              <Text style={[styles.colPrice, styles.cellTextMono]}>{formatDA(line.unitPrice)}</Text>
              <Text style={[styles.colTva, styles.cellText]}>{line.tvaRate}%</Text>
              <Text style={[styles.colTotal, styles.cellTextMono]}>{formatDA(line.totalHT)}</Text>
            </View>
          ))}
        </View>

        {/* ── Totals ── */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsLeft}>
            {doc.notes && (
              <Text style={styles.notesText}>Notes: {doc.notes}</Text>
            )}
          </View>

          <View style={styles.totalsRight}>
            <View style={styles.rowTotal}>
              <Text style={styles.rowTotalLabel}>Sous-total HT</Text>
              <Text style={styles.rowTotalValue}>{formatDA(doc.subtotalHT)}</Text>
            </View>
            <View style={styles.rowTotal}>
              <Text style={styles.rowTotalLabel}>Total TVA</Text>
              <Text style={styles.rowTotalValue}>{formatDA(doc.totalTVA)}</Text>
            </View>
            {Boolean(doc.stampDuty && doc.stampDuty > 0) && (
              <View style={styles.stampRow}>
                <Text style={styles.stampLabel}>Droit de Timbre (Espèces)</Text>
                <Text style={styles.stampValue}>{formatDA(doc.stampDuty)}</Text>
              </View>
            )}
            <View style={styles.netRow}>
              <Text style={styles.netLabel}>{doc.stampDuty ? 'Net à Payer' : 'Total TTC'}</Text>
              <Text style={styles.netValue}>
                {formatDA(doc.stampDuty
                  ? doc.subtotalHT + doc.totalTVA + doc.stampDuty
                  : doc.totalTTC)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Amount in Words ── */}
        <View style={styles.wordsBox}>
          <Text>{doc.amountInWords}</Text>
        </View>

        {/* ── Legal Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerLine}>
            RC: {company.rc || '-'} | NIF: {company.nif || '-'} | AI: {company.ai || '-'} | NIS: {company.nis || '-'}
          </Text>
          {company.rib && <Text style={styles.footerLine}>RIB: {company.rib}</Text>}
        </View>
      </Page>
    </Document>
  );
};
