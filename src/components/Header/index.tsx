import React from 'react';
import styles from './index.module.css';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

// Icons and chakra-ui
import { SearchIcon, CloseIcon, SunIcon, MoonIcon, QuestionIcon, SettingsIcon } from '@chakra-ui/icons';
import { Tooltip, useColorMode, Button } from '@chakra-ui/react';

function Header() {
  const { changeFilter } = React.useContext(MainContext) as MainContextType;
  const [search, setSearch] = React.useState<string>('');

  const { colorMode, toggleColorMode } = useColorMode();

  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    changeFilter(search);
  };

  const formClear = () => {
    changeFilter('');
    setSearch('');
  };

  return (
    <div className={styles.searchContainer}>
      <form className={styles.searchBox} onSubmit={formSubmit}>
        <Tooltip label="Min 3 characters are allowed!" placement="bottom" openDelay={500} closeOnClick hasArrow>
          <input type="text" className={styles.search} placeholder="Search..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
        </Tooltip>
        {search.length > 0 && (
          <Tooltip label="Clear" placement="bottom" hasArrow>
            <span className={styles.removeButton} onClick={formClear}>
              <CloseIcon />
            </span>
          </Tooltip>
        )}
        <button className={styles.searchButton} type="submit">
          <SearchIcon />
        </button>
      </form>
      <div className={styles.settings}>
        <Button onClick={toggleColorMode}>{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>
        <Button>{<QuestionIcon />}</Button>
        <Button>{<SettingsIcon />}</Button>
      </div>
    </div>
  );
}

export default Header;
