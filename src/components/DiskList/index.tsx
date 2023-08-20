import React from 'react';
import styles from './index.module.css';
import { diskHealth } from '../../hooks';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

// Icons
import { AddIcon, RepeatIcon, CheckIcon } from '@chakra-ui/icons';

// Toast
import { useToast } from '@chakra-ui/react';

// Card
import DiskCard from './DiskCard';

function DiskList() {
  const { disks, addDisk, updateDisk, diskScanning } = React.useContext(MainContext) as MainContextType;

  const toast = useToast();

  const formSubmit = async (event: any) => {
    event.preventDefault();
    if (diskScanning) {
      toast({ title: 'Wait for the disk scan to finish!', status: 'warning' });
      return;
    }
    const link = event.target.link.value;
    const linkDisk = await diskHealth(encodeURI(link));
    if (linkDisk === null) {
      toast({ title: 'Link Error! It must be a "Yandex Disk" link!', status: 'error' });
    } else {
      const { public_url, name, _embedded, type } = linkDisk;
      if (type !== 'dir') {
        toast({ title: 'Only folder links are accepted!', status: 'error' });
      } else if (_embedded.total === 0) {
        toast({ title: 'Empty folder!', status: 'error' });
      } else if (disks.some((disk) => disk.public_url === public_url)) {
        toast({ title: 'Link already added!', status: 'error' });
      } else {
        addDisk({ public_url, name, status: 'notscanned' });
        toast({ title: 'Link added!', status: 'success' });
      }
    }
    event.target.reset();
  };

  const checkAllDisks = async () => {
    disks.map(async (disk) => {
      const diskStatus = disk.status;
      updateDisk(Number(disk.id), 'scanning');
      const check = await diskHealth(encodeURI(disk.public_url));
      if (check === null || check.type !== 'dir' || check._embedded.total === 0) {
        updateDisk(Number(disk.id), 'dead');
      } else {
        updateDisk(Number(disk.id), diskStatus);
      }
    });
  };

  return (
    <div className={styles.diskContainer}>
      <form onSubmit={formSubmit} className={styles.diskAdd}>
        <input type="text" placeholder="Link" name="link" className={styles.addLink} />
        <button type="submit" className={styles.addBtn}>
          <AddIcon />
        </button>
      </form>
      <div className={styles.diskList}>{disks.length > 0 ? disks.map((disk) => <DiskCard key={disk.id} disk={disk} />) : <div style={{ textAlign: 'center' }}>Empty</div>}</div>
      <div className={styles.diskAdd}>
        <span className={styles.scanAllBtn}>
          <RepeatIcon /> Scan All
        </span>
        <span className={styles.checkAllBtn} onClick={checkAllDisks}>
          <CheckIcon />
        </span>
      </div>
    </div>
  );
}

export default DiskList;
