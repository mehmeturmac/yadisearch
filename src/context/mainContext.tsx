import React from 'react';

// Interfaces
import { IDisk, Iitem, MainContextType } from './@types.main';

// Dexie
import Dexie, { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
class MySubClassedDexie extends Dexie {
  disks!: Table<IDisk>;
  items!: Table<Iitem>;
  constructor() {
    super('yadisearch');
    this.version(1).stores({ disks: '++id,name,public_url,status', items: '++id,name,type,size,link,virusStatus' });
  }
}
const db = new MySubClassedDexie();

export const MainContext = React.createContext<MainContextType | null>(null);

export const MainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Disk
  const [disks, setDisks] = React.useState<IDisk[]>([]);
  const [diskScanning, setDiskScanning] = React.useState<boolean>(false);

  const allDisks = useLiveQuery<IDisk[]>(async () => await db.disks.toArray());

  const addDisk = async (disk: IDisk) => await db.disks.add(disk);
  const removeDisk = async (id: number) => await db.disks.delete(id);
  const updateDisk = async (id: number, status: string) => await db.disks.update(id, { status });

  React.useEffect(() => setDisks(allDisks !== undefined ? allDisks : []), [allDisks]);

  // Items
  const [items, setItems] = React.useState<Iitem[]>([]);

  // const allItems = useLiveQuery<Iitem[]>(async () => await db.items.toArray());

  // React.useEffect(() => setItems(allItems !== undefined ? allItems : []), [allItems]);

  const [filter, setFilter] = React.useState<string>('');
  const [filteredItems, setFilteredItems] = React.useState<Iitem[]>(items);

  const addItems = (items: Iitem[]) => setItems((prev) => prev.concat(items));

  const changeFilter = (filter: string) => setFilter(filter);

  React.useEffect(() => {
    if (filter.length > 2) {
      const filtered = items.filter((item) => item.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [filter, items]);

  const values = {
    disks,
    diskScanning,
    setDiskScanning,
    addDisk,
    removeDisk,
    updateDisk,
    items,
    addItems,
    filter,
    changeFilter,
    filteredItems,
  };

  return <MainContext.Provider value={values}>{children}</MainContext.Provider>;
};
