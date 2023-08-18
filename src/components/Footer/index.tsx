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
    <div className={styles.footer}>
      <span>
        Coded by <a href="https://github.com/mehmeturmac">Mehmet Urmaç</a>
      </span>
    </div>
  );
}

export default Header;
