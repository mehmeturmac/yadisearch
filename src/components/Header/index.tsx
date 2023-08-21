import React from 'react';
import styles from './index.module.css';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

// Icons and chakra-ui
import { SearchIcon } from '@chakra-ui/icons';
import { Tooltip } from '@chakra-ui/react';

function Header() {
  const { changeFilter } = React.useContext(MainContext) as MainContextType;

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBox}>
        <Tooltip label="Min 3 characters are allowed!" placement="bottom" openDelay={500} closeOnClick hasArrow>
          <input type="text" className={styles.search} placeholder="Search..." onChange={(e: any) => changeFilter(e.target.value)} />
        </Tooltip>
        <span className={styles.searchButton}>
          <SearchIcon />
        </span>
      </div>
    </div>
  );
}

export default Header;
