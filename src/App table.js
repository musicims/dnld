import React from 'react';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const preChecklistData = [
  ["1. General Cleaning", "- Ensure the property is clean and tidy."],
  ["", "- Dust and wipe all surfaces, including countertops, shelves, and furniture."],
  ["", "- Vacuum or sweep the floors."],
  ["", "- Clean windows and mirrors."],
  ["", "- Remove any cobwebs."],
  ["2. Walls and Paint", "- Inspect the walls for any marks, scuffs, or holes."],
  ["", "- Touch up any minor damages with matching paint."],
  ["", "- If there are major damages, consult with the landlord or property manager."],
  ["3. Floors and Carpets", "- Inspect the floors for scratches, stains, or any damages."],
  ["", "- Vacuum or mop the floors accordingly."],
  ["", "- Professionally clean the carpets if necessary."],
  ["4. Appliances and Fixtures", "- Check that all appliances are in working order."],
  ["", "- Test the stove, refrigerator, dishwasher, microwave, and any other provided appliances."],
  ["", "- Ensure that all faucets, toilets, showers, and sinks are functioning properly."],
  ["", "- Replace any burnt-out light bulbs."],
  ["5. Electrical and Plumbing", "- Check all electrical outlets and switches."],
  ["", "- Test smoke detectors and carbon monoxide detectors."],
  ["", "- Inspect for any plumbing leaks or dripping faucets."],
  ["", "- Ensure proper water pressure in showers and sinks."],
  ["6. Windows and Doors", "- Inspect windows for any cracks, damages, or broken glass."],
  ["", "- Check that all windows can be opened and closed properly."],
  ["", "- Test door locks and handles."],
  ["", "- Replace any missing or damaged window screens."],
  ["7. Furnishings and Furniture", "- Inspect all provided furnishings and furniture for damages."],
  ["", "- Check for stains or tears on upholstery."],
  ["", "- Ensure all drawers, doors, and handles are in good working condition."],
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
    //const tableColumns = ['Label', 'Content', 'Comment']; // Table column headers

    const generateTable = () => {
      const startY = 20; // Adjust the starting Y position of the table
      const rowHeight = 10; // Height of each row
      const cellPadding = 1; // Padding within each cell
      const lineWidth = 0.1; // Width of the border lines
      const maxWidth = doc.internal.pageSize.width - 20 - 60 - 60 - cellPadding * 2; // Maximum width of the second column based on available space
    
      // Adjust the column widths based on the available space
      const columnWidth = [60, maxWidth, 60]; // Width of each column
    
      // Draw horizontal border lines
      doc.setLineWidth(lineWidth);
      doc.line(10, startY, 10, startY + (rowHeight * tableData.length)); // Vertical line for the first column
      doc.line(10 + columnWidth[1], startY, 10 + columnWidth[1], startY + (rowHeight * tableData.length)); // Vertical line for the second and third columns
      doc.line(10, startY, 10 + columnWidth.reduce((acc, width) => acc + width), startY); // Top horizontal line
      doc.line(10, startY + (rowHeight * tableData.length), 10 + columnWidth.reduce((acc, width) => acc + width), startY + (rowHeight * tableData.length)); // Bottom horizontal line
    
      // Draw table data
      doc.setFont('helvetica', 'normal'); // Set the font family and style
      doc.setFontSize(8);
    
      tableData.forEach((row, rowIndex) => {
        const rowY = startY + cellPadding + rowIndex * rowHeight;
        doc.text(row[0], 12, rowY - cellPadding);
    
        // Adjust the X coordinate for the second column text
        const secondColumnX = 12 + cellPadding + columnWidth[0];
        doc.text(row[1], secondColumnX, rowY - cellPadding, { maxWidth: columnWidth[1] });
    
        doc.text(row[2], secondColumnX + cellPadding + columnWidth[1], rowY - cellPadding, { align: 'right', maxWidth: columnWidth[2] });
    
        // Draw horizontal border lines for each row
        doc.line(10, rowY, 10 + columnWidth.reduce((acc, width) => acc + width), rowY);
      });
    };
    
    

    generateTable();
    doc.save('pre_checklist.pdf');
  };


  
    const handleDownloadExcel = () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Pre-Checklist');
  
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
