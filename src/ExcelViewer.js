import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Table } from 'semantic-ui-react';
import styles from './ExcelViewer.module.css';
import TopMenu from './TopMenu';

function ExcelViewer() {
  const [fileData, setFileData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const wb = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { raw: false });

      // Zamienia kropki na przecinki w kolumnie "Cena"
      const updatedData = data.map(row => ({
        ...row,
        'Kurs euro z NBP': '', // Pusta wartość dla nowej kolumny
        'Zysk w PLN': '' // Pusta wartość dla nowej kolumny
      }));
      setFileData(updatedData);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className={styles.mainContainer}>
      <TopMenu onFileInput={handleFileUpload} fileLoaded={fileData.length > 0} />
      <div className={styles.contentContainer}>
        {fileData.length > 0 && (
          <div className={styles.tableContainer}>
            <Table celled className={styles.scrollableTable}>
              <Table.Header>
                <Table.Row>
                  {Object.keys(fileData[0]).map((header, index) => (
                    <Table.HeaderCell key={index}>{header}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {fileData.map((row, index) => (
                  <Table.Row key={index}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <Table.Cell key={cellIndex}>{cell}</Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExcelViewer;
