import React from 'react';
import styles from './index.module.css';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType, IDisk } from '../../context/@types.main';

// Hooks
import { diskScan } from '../../hooks/diskScan';

// Icons and chakra-ui
import { DeleteIcon, RepeatIcon, CheckIcon, NotAllowedIcon, CopyIcon } from '@chakra-ui/icons';
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';
import { Spinner, Tooltip, useToast, Button, useDisclosure } from '@chakra-ui/react';

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

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (disk.status === 'scanning') {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [disk.status]);

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
        style={{ backgroundColor: ['#E4F9F5', '#F4D160', '#A8DF8E', '#BB2525'][['notscanned', 'scanning', 'scanned', 'dead'].indexOf(disk.status)] }}
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

      {/* Alert */}
      <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Are you sure?</AlertDialogHeader>
          {alert === 'delete' && <AlertDialogBody>Are you sure you want to delete the disk with all items?</AlertDialogBody>}
          {alert === 'rescan' && <AlertDialogBody>Do you want to rescan the disk with all items?</AlertDialogBody>}
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            {alert === 'delete' && (
              <Button colorScheme="red" ml={3} onClick={deleteDisk}>
                Yes
              </Button>
            )}
            {alert === 'rescan' && (
              <Button colorScheme="green" ml={3} onClick={scanDisk}>
                Yes
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DiskCard;
