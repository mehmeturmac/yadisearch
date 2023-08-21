import React from 'react';

// Interfaces
import { IDisk, Iitem, MainContextType } from './@types.main';

// Dexie
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

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

  const allItems = useLiveQuery<Iitem[]>(async () => await db.items.toArray());

  const removeItems = async (id: number) => await db.items.where('diskId').anyOf(id).delete();

  React.useEffect(() => setItems(allItems !== undefined ? allItems : []), [allItems]);

  // Filter
  const [filter, setFilter] = React.useState<string>('');
  const [filteredItems, setFilteredItems] = React.useState<Iitem[]>(items);

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
    removeItems,
    filter,
    changeFilter,
    filteredItems,
  };

  return <MainContext.Provider value={values}>{children}</MainContext.Provider>;
};
