import React from 'react';
import { Menu } from 'semantic-ui-react';
import styles from './BottomMenu.module.css';

function BottomMenu({ euroRate }) {  // Dodanie prop `euroRate`
  return (
    <Menu className={styles.bottomMenuContainer}>
      <Menu.Item>
        Twój zysk PLN:
      </Menu.Item>
      {/* Elementy po lewej */}
      <Menu.Menu position="right">
        {euroRate && <Menu.Item>
          <p>Aktualny kurs euro (NBP): {euroRate} PLN</p>
        </Menu.Item>}
      </Menu.Menu>
      {/* Tutaj możesz dodać inne elementy Menu, jeśli potrzebujesz */}
    </Menu>
  );
}

export default BottomMenu;
