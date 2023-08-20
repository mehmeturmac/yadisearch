export interface IDisk {
  id?: number;
  public_url: string;
  name: string;
  status: string;
}

export interface Iitem {
  id?: number;
  name: string;
  type: string;
  size: string;
  link: string;
  virusStatus: string;
}

export type MainContextType = {
  disks: IDisk[];
  diskScanning: boolean;
  setDiskScanning: (value: boolean) => void;
  addDisk: (disk: IDisk) => void;
  removeDisk: (id: number) => void;
  updateDisk: (id: number, status: string) => void;
  items: Iitem[];
  addItems: (items: Iitem[]) => void;
  filter: string;
  changeFilter: (filter: string) => void;
  filteredItems: Iitem[];
};
