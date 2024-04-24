import React, { useState, useEffect } from 'react';
import { Table } from 'semantic-ui-react';
import TopMenu from './TopMenu';
import BottomMenu from './BottomMenu';
import { handleFileUpload, fetchYearlyEuroRates, updateEuroRates } from './fileHandlers';
import styles from './ExcelViewer.module.css';

function ExcelViewer() {
  const [fileData, setFileData] = useState([]);
  const [euroRates, setEuroRates] = useState({});  // Dodajemy stan dla kursów euro
  const [ratesLoaded, setRatesLoaded] = useState(false);

  useEffect(() => {
    const loadRates = async () => {
      const rates = await fetchYearlyEuroRates();
      setEuroRates(rates);  // Aktualizujemy stan euroRates
      setRatesLoaded(true);
      console.log("Euro rates loaded:", rates); // Log załadowanych kursów euro
    };
    loadRates();
  }, []);

  const onFileInput = async (event) => {
    await handleFileUpload(event, setFileData);
    console.log("Data loaded from file:", fileData); // Log danych wczytanych z pliku
  };

  const onFetchRates = async () => {
    console.log("Fetching rates with data:", fileData);
    if (!euroRates || Object.keys(euroRates).length === 0) {
      console.error("Euro rates data is not loaded yet.");
      return;
    }
    await updateEuroRates(fileData, setFileData, euroRates);
  };
  
  

  return (
    <div className={styles.mainContainer}>
      <TopMenu onFileInput={onFileInput} onFetchRates={onFetchRates} fileLoaded={fileData.length > 0} />
      <BottomMenu />
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
