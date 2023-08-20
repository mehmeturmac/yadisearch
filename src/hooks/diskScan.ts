import { IDisk, Iitem } from './../context/@types.main';

import { getItems } from './getItems';

import { sizeCalc, typeShort } from '../utils';

export const diskScan = async (disk: IDisk, path = '/') => {
  let limit = 100;
  let offset = 0;
  const firstData = await getItems(disk.public_url, path, limit, offset);
  const newData: Iitem[] = [];
  while (offset < firstData.total) {
    const data = await getItems(disk.public_url, path, limit, offset);
    await Promise.all(
      data.items.map(async (item: any) => {
        const { file: link, name, mime_type, size, antivirus_status: virusStatus } = item;
        if (item.type === 'dir') {
          await diskScan(disk, item.path);
        } else {
          const newSize = sizeCalc(size);
          const type = typeShort(mime_type);
          newData.push({ link, name, type, size: newSize, virusStatus });
        }
      })
    );
    offset = offset + limit;
  }
  return newData;
};
