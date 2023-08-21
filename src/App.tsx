import React from 'react';
import 'devextreme/dist/css/dx.light.css';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import DiskList from './components/DiskList';
import ItemList from './components/ItemList';

// Context
import { MainContext } from './context/mainContext';
import { MainContextType } from './context/@types.main';

import { db } from './db';

function App() {
  const { diskScanning } = React.useContext(MainContext) as MainContextType;

  // Ask before tab close if scanning
  React.useEffect(() => {
    if (diskScanning) {
      const handleTabClose = (event: any) => {
        event.preventDefault();
        db.disks.where({ status: 'scanning' }).modify({ status: 'notscanned' });
        return (event.returnValue = 'Are you sure you want to exit?');
      };
      window.addEventListener('beforeunload', handleTabClose);
      return () => {
        window.removeEventListener('beforeunload', handleTabClose);
      };
    }
  }, [diskScanning]);

  return (
    <div className="App">
      <Header />
      <div className="Container">
        <ItemList />
        <DiskList />
      </div>
      <Footer />
    </div>
  );
}

export default App;
