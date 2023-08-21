import React from 'react';
import { DataGrid, Paging, Pager, Selection, Column } from 'devextreme-react/data-grid';
import styles from './index.module.css';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

// Toast
import { useToast } from '@chakra-ui/react';

export default function ItemList() {
  const { filteredItems, items, filter } = React.useContext(MainContext) as MainContextType;

  const toast = useToast();

  const download = (e: any) => {
    if (e.rowType === 'data' && e.column.dataField === 'name') {
      toast({ title: 'Download starting...', status: 'loading', duration: 2000 });
      setTimeout(() => {
        const linkElement = document.createElement('a');
        linkElement.href = e.data.link;
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
      }, 1000);
    }
  };

  const cellHover = (e: any) => {
    if (e.rowType === 'data' && e.column.dataField === 'name') {
      e.eventType == 'mouseover' ? e.cellElement.classList.add(styles.cellHovered) : e.cellElement.classList.remove(styles.cellHovered);
    }
  };

  return (
    <div className={styles.dgrid}>
      <DataGrid
        dataSource={filter.length > 2 ? filteredItems : items}
        keyExpr={'id'}
        height="100%"
        allowColumnResizing={true}
        hoverStateEnabled={true}
        onCellClick={download}
        onCellHoverChanged={cellHover}
      >
        <Paging defaultPageSize={20} />
        <Pager showPageSizeSelector={true} allowedPageSizes={[20, 30, 50, 100]} showNavigationButtons={true} visible={true} />
        <Selection mode="single" />
        <Column dataField="name" caption="Name" minWidth={300} />
        <Column dataField="diskName" caption="Disk Name" width={90} alignment="right" allowSorting={false} />
        <Column dataField="type" caption="Type" width={70} alignment="right" />
        <Column dataField="size" caption="Size" width={80} alignment="right" allowSorting={false} />
        <Column dataField="virusStatus" caption="Virus Status" width={90} alignment="right" allowSorting={false} />
      </DataGrid>
    </div>
  );
}
