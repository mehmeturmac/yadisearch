import React from 'react';
import styles from './index.module.css';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

// Icons
import { AiOutlineSearch } from 'react-icons/ai';

function Header() {
  const { filterItems } = React.useContext(MainContext) as MainContextType;

  return (
    <div className={styles.searchBox}>
      <input type="text" className={styles.search} placeholder="Search..." onChange={(e: any) => filterItems(e.target.value)} />
      <span className={styles.searchButton}>
        <AiOutlineSearch />
      </span>
    </div>
  );
}

export default Header;
