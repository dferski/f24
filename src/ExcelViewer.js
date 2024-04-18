import React, { useState } from 'react';
import { Table } from 'semantic-ui-react';
import styles from './ExcelViewer.module.css';
import TopMenu from './TopMenu';
import BottomMenu from './BottomMenu';
import { handleFileUpload } from './fileHandlers';  // Import funkcji

function ExcelViewer() {
  const [fileData, setFileData] = useState([]);
  const [euroRate, setEuroRate] = useState(null); // Stan dla kursu euro

  return (
    <div className={styles.mainContainer}>
      <TopMenu onFileInput={(e) => handleFileUpload(e, setFileData, setEuroRate)} fileLoaded={fileData.length > 0} />
      <BottomMenu euroRate={euroRate} />  
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
