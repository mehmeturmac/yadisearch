import React from 'react';
import styles from './index.module.css';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

// Icons
import { SearchIcon } from '@chakra-ui/icons';

function Header() {
  const { changeFilter } = React.useContext(MainContext) as MainContextType;

  return (
    <div className={styles.searchBox}>
      <input type="text" className={styles.search} placeholder="Search..." onChange={(e: any) => changeFilter(e.target.value)} />
      <span className={styles.searchButton}>
        <SearchIcon />
      </span>
    </div>
  );
}

export default Header;
