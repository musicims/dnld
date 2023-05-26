import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', marginTop: '1rem' },
  tableRow: { flexDirection: 'row' },
  tableCell: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', padding: '0.3rem' },
});

const PDFTable = ({ data }) => (
  <Document>
    <Page size="A4">
      <View style={styles.table}>
        {data.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            {row.map((cell, cellIndex) => (
              <Text key={cellIndex} style={styles.tableCell}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFTable;
