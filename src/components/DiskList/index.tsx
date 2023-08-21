import React from 'react';
import styles from './index.module.css';
import { diskHealth } from '../../hooks';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

import { diskScan } from '../../hooks/diskScan';

// Icons and chakra-ui
import { AddIcon, RepeatIcon, CheckIcon } from '@chakra-ui/icons';
import { useToast, Tooltip, Spinner } from '@chakra-ui/react';

// Card
import DiskCard from './DiskCard';

function DiskList() {
  const { disks, addDisk, updateDisk, diskScanning, setDiskScanning, removeItems } = React.useContext(MainContext) as MainContextType;

  const toast = useToast();

  const addLink = async (event: any) => {
    event.preventDefault();
    if (diskScanning) {
      toast({ title: 'Wait for the disk scan to finish!', status: 'warning' });
      return;
    }
    const linkDisk = await diskHealth(encodeURI(event.target.link.value));
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
    toast({ title: 'Disks are checking...', status: 'loading' });
    for (const disk of disks) {
      const diskStatus = disk.status;
      updateDisk(Number(disk.id), 'scanning');
      const check = await diskHealth(encodeURI(disk.public_url));
      if (check === null || check.type !== 'dir' || check._embedded.total === 0) {
        updateDisk(Number(disk.id), 'dead');
      } else {
        updateDisk(Number(disk.id), diskStatus);
      }
    }
    toast.closeAll();
    toast({ title: 'Disks are checked!', status: 'success' });
  };

  const scanAll = async () => {
    await checkAllDisks();
    toast({ title: 'All disks are scanning...', status: 'loading' });
    setDiskScanning(true);
    for (const disk of disks) {
      if (disk.status === 'notscanned') {
        updateDisk(Number(disk.id), 'scanning');
        removeItems(Number(disk.id));
        await diskScan(disk);
        updateDisk(Number(disk.id), 'scanned');
      }
    }
    setDiskScanning(false);
    toast.closeAll();
    toast({ title: 'All disks are scanned!', status: 'success' });
  };

  return (
    <div className={styles.diskContainer}>
      <form onSubmit={addLink} className={styles.diskAdd}>
        <Tooltip label="Enter a yandex disk link!" placement="bottom" openDelay={500} closeOnClick hasArrow>
          <input type="text" placeholder="Link" name="link" className={styles.addLink} />
        </Tooltip>
        <Tooltip label="Add" placement="right" openDelay={500} hasArrow>
          <button type="submit" className={styles.addBtn}>
            <AddIcon />
          </button>
        </Tooltip>
      </form>
      <div className={styles.diskList}>{disks.length > 0 ? disks.map((disk) => <DiskCard key={disk.id} disk={disk} />) : <div style={{ textAlign: 'center' }}>Empty</div>}</div>
      <div className={styles.buttonGroup}>
        <Tooltip label="Scan all disks!" placement="top" openDelay={500} closeOnClick hasArrow>
          <button className={styles.scanAllBtn} disabled={diskScanning} onClick={scanAll}>
            {diskScanning ? <Spinner size="sm" /> : <RepeatIcon />}
            {diskScanning ? <> Scanning... </> : <> Scan All </>}
          </button>
        </Tooltip>
        <Tooltip label="Check all disks links!" placement="top" openDelay={500} closeOnClick hasArrow>
          <button className={styles.checkAllBtn} disabled={diskScanning} onClick={checkAllDisks}>
            <CheckIcon />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default DiskList;
