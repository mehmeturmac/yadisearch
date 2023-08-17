import React from 'react';
import styles from './index.module.css';
import { useContext } from 'react';
import { getItems } from '../../hooks';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType, IDisk } from '../../context/@types.main';

// Icons
import { AiOutlineClose, AiOutlineFileSearch } from 'react-icons/ai';

function DiskCard({ disk }: { disk: IDisk }) {
  const { saveItem } = useContext(MainContext) as MainContextType;
  const [show, setShow] = React.useState(false);

  const listItems = async (public_url: string, path = '/') => {
    if (path === '/') console.log('taranıyor...');
    let limit = 100;
    let offset = 0;
    const firstData = await getItems(public_url, path, limit, offset);
    while (offset < firstData.total) {
      const data = await getItems(public_url, path, limit, offset);
      data.items.map(async (item: any) => {
        const { file: link, name, mime_type: type, size, antivirus_status: virusStatus } = item;
        if (item.type === 'dir') {
          await listItems(public_url, item.path);
        } else {
          await saveItem({ link, name, type, size, virusStatus });
        }
      });
      offset = offset + limit;
    }
    if (path === '/') console.log('bitti');
  };

  return (
    <div className={styles.diskCard} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {show && (
        <span className={`${styles.Btn} ${styles.scanBtn}`} onClick={() => listItems(disk.public_url)}>
          <AiOutlineFileSearch />
        </span>
      )}
      <div className={styles.diskName}>{disk.name}</div>
      {show && (
        <span className={`${styles.Btn} ${styles.removeBtn}`}>
          <AiOutlineClose />
        </span>
      )}
    </div>
  );
}

export default DiskCard;
