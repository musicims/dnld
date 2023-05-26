import React from 'react';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


//this data is just a placeholder for the data fetched from GPT, see readme
const preChecklistData = [
  ["1. General Cleaning", "- The property is clean and tidy."],
  ["", "- All surfaces are dust free and wiped, including countertops, shelves, and furniture."],
  ["", "- Windows and mirrors are clean."],
  ["", "- No personal belongings are present."],
  ["2. Walls and Paint", "- The walls are free of any marks, scuffs, or holes."],
  ["", "- Any minor damages are touched up with matching paint."],
  ["", "- If there are major damages, consult with the landlord or property manager."],
  ["3. Floors and Carpets", "- Inspect the floors for scratches, stains, or any damages."],
  ["", "- Vacuum or mop the floors accordingly."],
  ["", "- Professionally clean the carpets if necessary."],
  ["4. Appliances and Fixtures", "- Check that all appliances are in working order."],
  ["", "- Test the stove, refrigerator, dishwasher, microwave, and any other provided appliances."],
  ["", "- Ensure that all faucets, toilets, showers, and sinks are functioning properly."],
  ["", "- No missing or burnt out light bulbs"],
  ["5. Electrical and Plumbing", "- Check all electrical outlets and switches."],
  ["", "- Test smoke detectors and carbon monoxide detectors."],
  ["", "- Inspect for any plumbing leaks or dripping faucets."],
  ["", "- Ensure proper water pressure in showers and sinks."],
  ["6. Windows and Doors", "- Inspect windows for any cracks, damages, or broken glass."],
  ["", "- Check that all windows can be opened and closed properly."],
  ["", "- Test door locks and handles."],
  ["", "- Replace any missing or damaged window screens."],
  ["", "- All keys are present and in possession."],
  ["7. Furnishings", "- Inspect all provided furnishings and furniture for damages."],
  ["", "- Check for stains or tears on upholstery."],
  ["", "- Ensure all drawers, doors, and handles are in good working condition."],
  ["", "Note any and all issues that do not comply with this list in the comments section"],
  ["Print Name:", "                             Signature:                                        Date:"],
];

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

  const PDFTable = () => (
    <View style={styles.table}>
      {preChecklistData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow}>
          {row.map((cell, cellIndex) => (
            <Text key={cellIndex} style={styles.tableCell}>
              {cell}
            </Text>
          ))}
        </
        View>
    ))}
  </View>
);

const App = () => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableData = preChecklistData.map(([label, content]) => [label, content, '']); // Add an empty column for comments or checks
    const tableColumns = ['', 'Tenant Deposit Checklist', 'Comment']; // Table column headers
  
    doc.autoTable({
      head: [tableColumns],
      body: tableData,
      startY: 10, // Adjust the starting Y position of the table
      theme: 'plain', // Use a plain table theme without borders
      columnStyles: {
        0: { cellWidth: 'auto' }, // Adjust the label column to automatically calculate width based on content
        1: { cellWidth: 'auto' }, // Adjust the content column to automatically calculate width based on content
        2: { cellWidth: 40 }, // Adjust the width of the comment column
      },
      didDrawCell: (data) => {
        const { table } = data;
        const { row, col } = data.cell;
        const rows = table.body;
  
        // Add horizontal border lines for all cells except the last row
        if (row < rows.length - 1) {
          data.doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
  
        // Add vertical border lines for the first column
        if (col === 0) {
          data.doc.line(data.cell.x, data.cell.y, data.cell.x, data.cell.y + data.cell.height);
        }
  
        // Add vertical border lines for the last column
        if (col === table.columns.length - 1) {
          data.doc.line(data.cell.x + data.cell.width, data.cell.y, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
      },
    });
  
    doc.save('pre_checklist.pdf');
  };
  
  
  
  const handleDownloadExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pre-Checklist');

    // Iterate over the data and find the maximum width for each column
    const columnWidths = preChecklistData.reduce((widths, row) => {
      row.forEach((cell, index) => {
        const columnWidth = cell.toString().length;
        if (!widths[index] || columnWidth > widths[index]) {
          widths[index] = columnWidth;
        }
      });
      return widths;
    }, []);

    // Set the column widths in the Excel worksheet
    worksheet.columns = columnWidths.map(width => ({ width }));

    preChecklistData.forEach(row => {
      worksheet.addRow(row);
    });

    workbook.xlsx.writeBuffer().then(buffer => {
      const excelBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, 'pre_checklist.xlsx');
    });
  };

  return (
    <div>
      <button onClick={handleDownloadPDF}>Download PDF</button>
      <button onClick={handleDownloadExcel}>Download Excel</button>
    </div>
  );
};

export default App;