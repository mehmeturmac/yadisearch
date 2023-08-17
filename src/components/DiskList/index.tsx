import React from 'react';
import styles from './index.module.css';
import { checkDisk } from '../../hooks';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

// Icons
import { AiOutlinePlusCircle, AiFillCheckCircle, AiOutlineFileSearch } from 'react-icons/ai';

// Card
import DiskCard from './DiskCard';

function DiskList() {
  const { disks, saveDisk } = React.useContext(MainContext) as MainContextType;

  const formSubmit = async (event: any) => {
    event.preventDefault();
    const link = event.target.link.value;
    const linkDisk = await checkDisk(encodeURI(link));
    if (linkDisk === null) {
      alert('Link boş veya hatalı! Lütfen "Yandex Disk" linki girin!');
    } else {
      const { public_url, name, _embedded, type } = linkDisk;
      if (type !== 'dir') {
        alert('Sadece klasör linkleri kabul edilmektedir!');
      } else if (_embedded.total === 0) {
        alert('Klasör boş!');
      } else if (disks.some((disk) => disk.public_url === public_url)) {
        alert('Link daha önce eklenmiş!');
      } else {
        saveDisk({ public_url, name, status: 'notscanned' });
        event.target.reset();
      }
    }
  };

  return (
    <div className={styles.diskContainer}>
      <form onSubmit={formSubmit} className={styles.diskAdd}>
        <input type="text" placeholder="Link" name="link" className={styles.addLink} />
        <button type="submit" className={styles.addBtn}>
          <AiOutlinePlusCircle />
        </button>
      </form>
      <div className={styles.diskList}>{disks.length > 0 ? disks.map((disk, i) => <DiskCard key={i} disk={disk} />) : <span className={styles.diskCard}>Empty</span>}</div>
      <div className={styles.diskAdd}>
        <span className={styles.scanAllBtn}>
          <AiOutlineFileSearch /> Scan All
        </span>
        <span className={styles.checkAllBtn}>
          <AiFillCheckCircle />
        </span>
      </div>
    </div>
  );
}

export default DiskList;
