import React from 'react';
import { Button } from 'semantic-ui-react';
import styles from './TopMenu.module.css';

function TopMenu({ onFileInput, fileLoaded }) {
  return (
    <div className={styles.menuContainer}>
      <div className={styles.menuLeft}>
        Oblicz zysk z f24
      </div>
      <div className={styles.menuRight}>
        <Button as="label" htmlFor="fileInput" primary>
          Wczytaj plik .xls
        </Button>
        <input
          type="file"
          id="fileInput"
          hidden
          onChange={onFileInput}
          accept=".xls,.xlsx"
        />
        {fileLoaded && (
          <Button>Dodatkowa opcja</Button>
        )}
      </div>
    </div>
  );
}

export default TopMenu;
