export interface IDisk {
  public_url: string;
  name: string;
  status: string;
}

export interface Iitem {
  name: string;
  type: string;
  size: string;
  link: string;
  virusStatus: string;
}

export type MainContextType = {
  disks: IDisk[];
  items: Iitem[];
  loading: boolean;
  saveDisk: (disk: IDisk) => void;
  removeDisk: (public_url: string) => void;
  filteredItems: Iitem[];
  filterItems: (search: string) => void;
  saveItem: (item: Iitem) => void;
};
