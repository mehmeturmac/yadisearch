import React from 'react';
import { DataGrid, Paging, Pager, Selection, Column } from 'devextreme-react/data-grid';
import styles from './index.module.css';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

export default function ItemList() {
  const { filteredItems, items, filter } = React.useContext(MainContext) as MainContextType;

  return (
    <div className={styles.dgrid}>
      <DataGrid
        dataSource={filter.length > 2 ? filteredItems : items}
        height="100%"
        columnAutoWidth={true}
        allowColumnResizing={true}
        hoverStateEnabled={true}
        onRowClick={(e: any) => window.open(e.data.link)}
      >
        <Paging defaultPageSize={20} />
        <Pager showPageSizeSelector={true} allowedPageSizes={[20, 30, 50, 100]} showNavigationButtons={true} visible={true} />
        <Selection mode="single" />
        <Column dataField="name" caption="Name" minWidth={300} />
        <Column dataField="type" caption="Type" width={100} alignment="right" />
        <Column dataField="size" caption="Size" width={80} alignment="right" />
        <Column dataField="virusStatus" caption="Virus Status" width={90} alignment="right" />
      </DataGrid>
    </div>
  );
}
