import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { DocumentData } from '@/lib/types';
import { formatDA, formatDate } from '@/lib/utils/format';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 15,
    marginBottom: 15,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C4A3D',
    marginBottom: 4,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaBox: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  boxTitle: {
    fontSize: 8,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C4A3D',
    marginBottom: 4,
  },
  table: {
    width: '100%',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1C4A3D',
    color: '#FFFFFF',
    padding: 6,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    padding: 6,
  },
  colDesignation: { width: '45%' },
  colQty: { width: '10%', textAlign: 'center' },
  colUnit: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTva: { width: '8%', textAlign: 'center' },
  colTotal: { width: '12%', textAlign: 'right' },

  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
  },
  totalsLeft: {
    width: '48%',
  },
  totalsRight: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1C4A3D',
    color: '#FFFFFF',
    padding: 6,
    borderRadius: 3,
    marginTop: 4,
    fontWeight: 'bold',
  },
  wordsBox: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 4,
    fontSize: 8,
    fontStyle: 'italic',
    marginBottom: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 7,
    color: '#64748B',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
});

export const DocumentPdfTemplate: React.FC<{ doc: DocumentData }> = ({ doc }) => {
  const company = doc.companySnapshot || {};
  const client = doc.clientSnapshot || {};
  const lines = doc.lines || [];

  return (
    <Document title={`${doc.number}.pdf`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{company.name || 'Mon Entreprise DZ'}</Text>
            {company.address && <Text>{company.address}</Text>}
            {company.wilaya && <Text>{company.wilaya}</Text>}
            <Text>
              {company.phone ? `Tél: ${company.phone}` : ''} {company.email ? `| Email: ${company.email}` : ''}
            </Text>
          </View>
        </View>

        {/* Meta & Client */}
        <View style={styles.metaGrid}>
          <View style={styles.metaBox}>
            <Text style={styles.boxTitle}>{doc.type}</Text>
            <Text style={styles.docTitle}>{doc.number}</Text>
            <Text>Date: {formatDate(doc.issueDate)}</Text>
            {doc.dueDate && <Text>Échéance: {formatDate(doc.dueDate)}</Text>}
            {doc.paymentMethod && <Text>Paiement: {doc.paymentMethod}</Text>}
          </View>

          <View style={styles.metaBox}>
            <Text style={styles.boxTitle}>Client / Doit :</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{client.name || 'Client'}</Text>
            {client.address && <Text>{client.address}</Text>}
            {client.wilaya && <Text>{client.wilaya}</Text>}
            {client.nif && <Text>NIF: {client.nif}</Text>}
            {client.rc && <Text>RC: {client.rc}</Text>}
          </View>
        </View>

        {/* Lines Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesignation}>Désignation</Text>
            <Text style={styles.colQty}>Qté</Text>
            <Text style={styles.colUnit}>Unité</Text>
            <Text style={styles.colPrice}>Prix U. HT</Text>
            <Text style={styles.colTva}>TVA</Text>
            <Text style={styles.colTotal}>Total HT</Text>
          </View>

          {lines.map((line, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.colDesignation}>{line.designation}</Text>
              <Text style={styles.colQty}>{line.quantity}</Text>
              <Text style={styles.colUnit}>{line.unit}</Text>
              <Text style={styles.colPrice}>{formatDA(line.unitPrice)}</Text>
              <Text style={styles.colTva}>{line.tvaRate}%</Text>
              <Text style={styles.colTotal}>{formatDA(line.totalHT)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsLeft}>
            {doc.notes && (
              <Text style={{ fontSize: 8, color: '#475569' }}>
                Notes: {doc.notes}
              </Text>
            )}
          </View>

          <View style={styles.totalsRight}>
            <View style={styles.rowTotal}>
              <Text>Sous-total HT</Text>
              <Text>{formatDA(doc.subtotalHT)}</Text>
            </View>
            <View style={styles.rowTotal}>
              <Text>Total TVA</Text>
              <Text>{formatDA(doc.totalTVA)}</Text>
            </View>
            {Boolean(doc.stampDuty && doc.stampDuty > 0) && (
              <View style={styles.rowTotal}>
                <Text style={{ color: '#B45309' }}>Droit de Timbre (Espèces)</Text>
                <Text style={{ color: '#B45309', fontWeight: 'bold' }}>{formatDA(doc.stampDuty)}</Text>
              </View>
            )}
            <View style={styles.netRow}>
              <Text>{doc.stampDuty ? 'Net à Payer' : 'Total TTC'}</Text>
              <Text>{formatDA(doc.stampDuty ? doc.subtotalHT + doc.totalTVA + doc.stampDuty : doc.totalTTC)}</Text>
            </View>
          </View>
        </View>

        {/* Words */}
        <View style={styles.wordsBox}>
          <Text>{doc.amountInWords}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            RC: {company.rc || '-'} | NIF: {company.nif || '-'} | AI: {company.ai || '-'} | NIS: {company.nis || '-'}
          </Text>
          {company.rib && <Text>RIB: {company.rib}</Text>}
        </View>
      </Page>
    </Document>
  );
};
