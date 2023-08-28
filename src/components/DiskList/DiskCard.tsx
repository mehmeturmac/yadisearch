import React from 'react';
import styles from './index.module.css';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType, IDisk } from '../../context/@types.main';

// Hooks
import { diskScan } from '../../hooks';

// Icons and chakra-ui
import { DeleteIcon, RepeatIcon, CheckIcon, NotAllowedIcon, CopyIcon } from '@chakra-ui/icons';
import { Spinner, Tooltip, useToast, useDisclosure, useColorModeValue } from '@chakra-ui/react';

// AlertBox
import { AlertBox } from '../AlertBox';

function DiskCard({ disk }: { disk: IDisk }) {
  const { updateDisk, removeDisk, diskScanning, setDiskScanning, removeItems } = React.useContext(MainContext) as MainContextType;

  const [show, setShow] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<string>('');

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const scanDisk = async () => {
    onClose();
    toast({ title: 'Disk scan started...', status: 'info' });
    setDiskScanning(true);
    updateDisk(Number(disk.id), 'scanning');
    removeItems(Number(disk.id));
    await diskScan(disk);
    updateDisk(Number(disk.id), 'scanned');
    setDiskScanning(false);
    toast.closeAll();
    toast({ title: 'Disk scanned!', status: 'success' });
  };

  const copyClipboard = () => {
    navigator.clipboard.writeText(disk.public_url);
    toast.closeAll();
    toast({ title: 'Disk link copied!', status: 'success' });
  };

  const deleteDisk = () => {
    onClose();
    removeDisk(Number(disk.id));
    removeItems(Number(disk.id));
    toast.closeAll();
    toast({ title: 'Disk removed with items!', status: 'error' });
  };

  const openAlert = (value: string) => {
    if (value === 'rescan' && disk.status !== 'scanned') {
      scanDisk();
    } else {
      setAlert(value);
      onOpen();
      setTimeout(() => setShow(false), 500);
    }
  };

  // Autoscroll to current scanned disk
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (disk.status === 'scanning') {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [disk.status]);

  const color = useColorModeValue('#e4f9f5', '#2f2f2f');

  return (
    <div className={styles.diskCard} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} ref={ref}>
      {show && !diskScanning && (
        <Tooltip label="Scan" placement="left" openDelay={200} hasArrow>
          <button className={styles.scanBtn} onClick={() => openAlert('rescan')}>
            <RepeatIcon />
          </button>
        </Tooltip>
      )}

      <div
        className={styles.diskName}
        style={{ backgroundColor: [color, '#F4D160', '#30bd88', '#BB2525'][['notscanned', 'scanning', 'scanned', 'dead'].indexOf(disk.status)] }}
        onClick={copyClipboard}
      >
        <Tooltip label="Click to copy link!" placement="bottom" openDelay={500} closeOnClick hasArrow>
          <div className={styles.scanLoading}>
            {[<Spinner size="sm" />, <CheckIcon />, <NotAllowedIcon />][['scanning', 'scanned', 'dead'].indexOf(disk.status)]}
            {disk.status === 'scanning' ? <span> Scanning... </span> : <span> {disk.name} </span>}
            {show && <CopyIcon />}
          </div>
        </Tooltip>
      </div>

      {show && !diskScanning && (
        <Tooltip label="Delete" placement="right" openDelay={200} hasArrow>
          <button className={styles.removeBtn} onClick={() => openAlert('delete')}>
            <DeleteIcon />
          </button>
        </Tooltip>
      )}

      {/* Alerts */}
      {alert === 'rescan' && (
        <AlertBox modalRef={cancelRef} onClose={onClose} isOpen={isOpen} onAccept={scanDisk} body="Do you want to rescan the disk with all items?" acceptText="Update" acceptColor="green" />
      )}
      {alert === 'delete' && (
        <AlertBox modalRef={cancelRef} onClose={onClose} isOpen={isOpen} onAccept={deleteDisk} body="Are you sure you want to delete the disk with all items?" acceptText="Delete" />
      )}
    </div>
  );
}

export default DiskCard;
