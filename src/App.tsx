import React from 'react';
import 'devextreme/dist/css/dx.light.css';
import './App.css';

// Components
import DiskList from './components/DiskList';
import ItemList from './components/ItemList';

function App() {
  return (
    <div className="App">
      <ItemList />
      <DiskList />
    </div>
  );
}

export default App;
