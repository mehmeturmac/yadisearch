import React from 'react';
import { IDisk, Iitem, MainContextType } from './@types.main';

const local = localStorage.getItem('yadisearch');
const localData = typeof local === 'string' ? JSON.parse(local) : null;

export const MainContext = React.createContext<MainContextType | null>(null);

export const MainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [disks, setDisks] = React.useState<IDisk[]>(localData || []);
  const [items, setItems] = React.useState<Iitem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [filteredItems, setFilteredItems] = React.useState<Iitem[]>(items);

  const saveDisk = (disk: IDisk) => setDisks((disks) => [...disks, disk]);

  const removeDisk = (public_url: string) => {
    const newDisks = disks.filter((disk) => disk.public_url !== public_url);
    setDisks(newDisks);
  };

  React.useEffect(() => {
    localStorage.setItem('yadisearch', JSON.stringify(disks));
  }, [disks]);

  const saveItem = (item: Iitem) => setItems((items) => [...items, item]);

  const filterItems = (search: string) => {
    const filter = items.filter((item) => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
    setFilteredItems(filter);
  };

  const values = {
    disks,
    items,
    loading,
    saveDisk,
    removeDisk,
    filteredItems,
    filterItems,
    saveItem,
  };

  return <MainContext.Provider value={values}>{children}</MainContext.Provider>;
};
