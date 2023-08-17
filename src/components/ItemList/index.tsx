import React from 'react';
import { DataGrid, Paging, Pager, Selection, Column, Scrolling } from 'devextreme-react/data-grid';
import styles from './index.module.css';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

// Icons
import { AiOutlineSearch } from 'react-icons/ai';

export default function ItemList() {
  const { filteredItems, filterItems } = React.useContext(MainContext) as MainContextType;

  return (
    <div className={styles.dgrid}>
      <div className={styles.searchBox}>
        <input type="text" className={styles.search} placeholder="Search..." onChange={(e: any) => filterItems(e.target.value)} />
        <span className={styles.searchButton}>
          <AiOutlineSearch />
        </span>
      </div>

      <DataGrid dataSource={filteredItems} columnAutoWidth={true} hoverStateEnabled={true} onRowClick={(e: any) => window.open(e.data.link)}>
        <Paging defaultPageSize={20} />
        <Pager showPageSizeSelector={true} showNavigationButtons={true} visible={true} />
        <Selection mode="single" />
        <Column dataField="name" caption="Name" minWidth={300} />
        <Column dataField="type" caption="Type" alignment="right" />
        <Column dataField="size" caption="Size" alignment="right" />
        <Column dataField="virusStatus" caption="Virus Status" alignment="right" />
      </DataGrid>
    </div>
  );
}
