import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import fetchContractResponse from './GPTcall.js'; //example GPT API call file with response returned

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: '1rem',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: '0.3rem',
  },
});

const PDFTable = ({ contractResponse }) => (
  <View style={styles.table}>
    {contractResponse.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.tableRow}>
        {row.map((cell, cellIndex) => (
          <Text key={cellIndex} style={styles.tableCell}>
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

const App = () => {
  const [contractResponse, setContractResponse] = useState(null);

  const handleDownloadPDF = () => {
    if (!contractResponse) {
      return;
    }
  
    const numColumns = contractResponse[0].length;
    const tableData = contractResponse.map(row => [...row, '']);
  
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Lease Contract'].slice(0, numColumns)],
      body: tableData,
      startY: 10,
      theme: 'plain',
      columnStyles: Array(numColumns).fill({ cellWidth: 'auto' }),
      didDrawCell: (data) => {
        const { table } = data;
        const { row, col } = data.cell;
        const rows = table.body;
  
        if (row < rows.length - 1) {
          data.doc.line(
            data.cell.x,
            data.cell.y + data.cell.height,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height
          );
        }
  
        if (col === 0) {
          data.doc.line(data.cell.x, data.cell.y, data.cell.x, data.cell.y + data.cell.height);
        }
  
        if (col === numColumns - 1) {
          data.doc.line(
            data.cell.x + data.cell.width,
            data.cell.y,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height
          );
        }
      },
    });
  
    doc.save('LeaseContract.pdf');
  };
  

  const handleDownloadExcel = () => {
    if (!contractResponse) {
      return;
    }
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pre-Checklist');
  
    const columnWidths = contractResponse.reduce((widths, row) => {
      row.forEach((cell, index) => {
        const columnWidth = cell.toString().length;
        if (!widths[index] || columnWidth > widths[index]) {
          widths[index] = columnWidth;
        }
      });
      return widths;
    }, []);
  
    worksheet.columns = columnWidths.map((width, index) => ({ width }));
  
    contractResponse.forEach(row => {
      worksheet.addRow(row);
    });
  
    workbook.xlsx.writeBuffer().then(buffer => {
      const excelBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, 'LeaseContract.xlsx');
    });
  };  

  const handleGenerateContract = async () => {
    try {
      const generatedResponse = await fetchContractResponse();
      setContractResponse(generatedResponse);
    } catch (error) {
      console.error('Failed to generate contract:', error);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateContract}>Generate Contract</button>
      {contractResponse && (
        <>
          <button onClick={handleDownloadPDF}>Download PDF</button>
          <button onClick={handleDownloadExcel}>Download Excel</button>
          <PDFTable contractResponse={contractResponse} />
        </>
      )}
    </div>
  );
};

export default App;
