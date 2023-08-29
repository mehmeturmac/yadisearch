import React from 'react';
import { DataGrid, Paging, Pager, Selection, Column } from 'devextreme-react/data-grid';
import styles from './index.module.css';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

// Chakra-ui
import { useToast, useColorMode } from '@chakra-ui/react';

// Hooks
import { download } from '../../hooks';

export default function ItemList() {
  const { filteredItems, items, filter } = React.useContext(MainContext) as MainContextType;

  const toast = useToast();

  const downloadItem = (e: any) => {
    if (e.rowType === 'data' && e.column.dataField === 'name') {
      toast({ title: 'Download starting...', status: 'loading', duration: 2000, position: 'top-left' });
      download(e.data.public_key, e.data.path, e.data.name);
    }
  };

  const cellHover = (e: any) => {
    if (e.rowType === 'data' && e.column.dataField === 'name') {
      e.eventType === 'mouseover' ? e.cellElement.classList.add(styles.cellHovered) : e.cellElement.classList.remove(styles.cellHovered);
    }
  };

  const { colorMode } = useColorMode();

  return (
    <div className={styles.dgrid}>
      <DataGrid
        dataSource={filter.length > 2 ? filteredItems : items}
        keyExpr={'id'}
        height="calc(100% - 20px)"
        allowColumnResizing={filter.length > 0}
        hoverStateEnabled={true}
        onCellClick={downloadItem}
        onCellHoverChanged={cellHover}
        className={colorMode === 'dark' ? styles.dark : ''}
      >
        <Paging defaultPageSize={20} />
        <Pager showPageSizeSelector={true} allowedPageSizes={[20, 30, 50, 100]} showNavigationButtons={true} visible={true} />
        <Selection mode="single" />
        <Column dataField="name" caption="Name" minWidth={300} allowSorting={filter.length > 0} />
        <Column dataField="diskName" caption="Disk Name" width={90} alignment="right" allowSorting={filter.length > 0} />
        <Column dataField="type" caption="Type" width={70} alignment="right" allowSorting={filter.length > 0} />
        <Column dataField="size" caption="Size" width={80} alignment="right" allowSorting={filter.length > 0} />
        <Column dataField="virusStatus" caption="Virus Status" width={90} alignment="right" allowSorting={false} />
      </DataGrid>
      <div className={styles.count}>Total: {items.length > 0 ? items.length : 0}</div>
      <iframe name="downloadIframe" id="downloadIframe" title="downloadIframe" style={{ display: 'none' }} />
    </div>
  );
}
