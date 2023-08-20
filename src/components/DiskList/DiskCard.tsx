import React from 'react';
import styles from './index.module.css';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType, IDisk } from '../../context/@types.main';

// Hooks
import { diskScan } from '../../hooks/diskScan';

// Icons
import { DeleteIcon, RepeatIcon, CheckIcon, NotAllowedIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Button,
  Tooltip,
} from '@chakra-ui/react';

// Toast
import { useToast } from '@chakra-ui/react';

function DiskCard({ disk }: { disk: IDisk }) {
  const { addItems, updateDisk, removeDisk, diskScanning, setDiskScanning } = React.useContext(MainContext) as MainContextType;
  const [show, setShow] = React.useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const scanDisk = async () => {
    toast({ title: 'Disk scanning...', status: 'loading' });
    setDiskScanning(true);
    updateDisk(Number(disk.id), 'scanning');
    const newItems = await diskScan(disk);
    addItems(newItems);
    updateDisk(Number(disk.id), 'scanned');
    setDiskScanning(false);
    toast({ title: 'Disk scanned!', status: 'success' });
  };

  const copyClipboard = () => {
    navigator.clipboard.writeText(disk.public_url);
    toast({ title: 'Disk link copied!', status: 'success' });
  };

  const deleteDisk = () => {
    removeDisk(Number(disk.id));
    toast({ title: 'Disk link removed!', status: 'error' });
  };

  return (
    <div className={styles.diskCard} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {show && !diskScanning && (
        <Tooltip label="Scan" placement="left" openDelay={200} hasArrow>
          <button className={`${styles.Btn} ${styles.scanBtn}`} onClick={scanDisk}>
            <RepeatIcon />
          </button>
        </Tooltip>
      )}

      <div
        className={styles.diskName}
        style={{ backgroundColor: ['none', '#F4D160', '#A8DF8E', '#BB2525'][['notscanned', 'scanning', 'scanned', 'dead'].indexOf(disk.status)] }}
        onClick={copyClipboard}
      >
        <Tooltip label="Click to copy link!" placement="bottom" openDelay={1000} hasArrow>
          <div className={styles.scanLoading}>
            {[<Spinner size="sm" />, <CheckIcon />, <NotAllowedIcon />][['scanning', 'scanned', 'dead'].indexOf(disk.status)]}
            {disk.status === 'scanning' ? <span> Scanning... </span> : <span> {disk.name} </span>}
            {show && <CopyIcon />}
          </div>
        </Tooltip>
      </div>

      {show && !diskScanning && (
        <Tooltip label="Delete" placement="right" openDelay={200} hasArrow>
          <button
            className={`${styles.Btn} ${styles.removeBtn}`}
            onClick={() => {
              onOpen();
              setTimeout(() => setShow(false), 500);
            }}
          >
            <DeleteIcon />
          </button>
        </Tooltip>
      )}

      {/* Alert */}
      <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Are you sure?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Are you sure you want to delete the disk and all disks items?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={deleteDisk}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DiskCard;
