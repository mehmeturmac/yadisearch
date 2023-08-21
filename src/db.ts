// Dexie
import Dexie, { Table } from 'dexie';

// Types
import { IDisk, Iitem } from './context/@types.main';

class MySubClassedDexie extends Dexie {
  disks!: Table<IDisk>;
  items!: Table<Iitem>;
  constructor() {
    super('yadisearch');
    this.version(1).stores({ disks: '++id,name,public_url,status', items: '++id,name,type,size,link,virusStatus,diskId,diskName' });
  }
}

export const db = new MySubClassedDexie();
