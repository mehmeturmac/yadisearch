import React from 'react';
import 'devextreme/dist/css/dx.light.css';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import DiskList from './components/DiskList';
import ItemList from './components/ItemList';

function App() {
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
