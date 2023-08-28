import React from 'react';

// Context
import { MainContext } from '../../context/mainContext';
import { MainContextType } from '../../context/@types.main';

// Hooks
import { diskHealth } from '../../hooks';

// Icons and chakra-ui
import { SunIcon, MoonIcon, QuestionIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  useColorMode,
  useDisclosure,
  useColorModeValue,
  useToast,
  Tooltip,
  Button,
  Image,
  Center,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';

// Alert
import { AlertBox } from '../AlertBox';

// Database
import { db } from '../../db';

// Image
import helpImage from '../../assets/help.png';

function Settings() {
  const { diskScanning, disks, addDisk } = React.useContext(MainContext) as MainContextType;

  const [show, setShow] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');

  const { colorMode, toggleColorMode } = useColorMode();

  const toast = useToast();

  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { isOpen: modalIsOpen, onOpen: modalOnOpen, onClose: modalOnClose } = useDisclosure();
  const { isOpen: helpIsOpen, onOpen: helpOnOpen, onClose: helpOnClose } = useDisclosure();
  const { isOpen: itemAlertIsOpen, onOpen: itemAlertOnOpen, onClose: itemAlertOnClose } = useDisclosure();
  const { isOpen: dbAlertIsOpen, onOpen: dbAlertOnOpen, onClose: dbAlertOnClose } = useDisclosure();

  const clearAllItems = () => {
    db.items.clear();
    db.disks.where('status').anyOf(['scanned', 'scanning']).modify({ status: 'notscanned' });
    toast({ title: 'All items cleaned!', status: 'success' });
    modalOnClose();
  };
  const clearAllDb = () => {
    db.delete();
    window.location.reload();
  };

  const importDisks = async () => {
    if (diskScanning) {
      toast({ title: 'Wait for the disk scan to finish!', status: 'warning' });
      return;
    }
    modalOnClose();
    toast({ title: 'Disks are importing!', status: 'loading', duration: 99999 });
    for (const line of value.split('\n')) {
      const linkDisk = await diskHealth(encodeURI(line));
      if (linkDisk !== null) {
        const { public_url, name, _embedded, type } = linkDisk;
        if (type === 'dir' && _embedded.total !== 0 && !disks.some((disk) => disk.public_url === public_url)) {
          addDisk({ public_url, name, status: 'notscanned' });
        }
      }
    }
    toast.closeAll();
    toast({ title: 'Disks are imported!', status: 'success' });
  };

  const exportDisks = () => {
    return disks.map((disk) => disk.public_url).join('\n');
  };

  const copyClipboard = () => {
    navigator.clipboard.writeText(exportDisks());
    toast.closeAll();
    toast({ title: 'Disks are copied!', status: 'success' });
  };

  const closeModal = () => {
    modalOnClose();
    setShow('');
  };

  const color = useColorModeValue('#2f2f2f', '#e4f9f5');

  return (
    <div>
      <Tooltip label="Change Theme" placement="bottom" openDelay={500} closeOnClick hasArrow>
        <Button m={1} onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
      </Tooltip>
      <Tooltip label="Help" placement="bottom" openDelay={500} closeOnClick hasArrow>
        <Button m={1} onClick={helpOnOpen}>
          {<QuestionIcon />}
        </Button>
      </Tooltip>
      <Tooltip label="Settings" placement="bottom" openDelay={500} closeOnClick hasArrow>
        <Button m={1} onClick={modalOnOpen}>
          {<SettingsIcon />}
        </Button>
      </Tooltip>

      {/* Settings Modal */}
      <Modal isOpen={modalIsOpen} onClose={closeModal} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={color}>Settings</ModalHeader>
          <ModalCloseButton color={color} />
          <ModalBody>
            <Center flexDirection="column" mb={3}>
              <Button mb={2} colorScheme="red" onClick={itemAlertOnOpen}>
                Clear All Items
              </Button>
              <Button mb={1} colorScheme="red" onClick={dbAlertOnOpen}>
                Clear All Database
              </Button>
              <Center flexDirection="row">
                <Button m={1} colorScheme="green" onClick={() => setShow('import')}>
                  Import Disks
                </Button>
                <Button m={1} colorScheme="blue" onClick={() => setShow('export')}>
                  Export Disks
                </Button>
              </Center>
            </Center>
            {show === 'import' && (
              <Center flexDirection="column" alignItems="end">
                <Textarea
                  value={value}
                  height={200}
                  onChange={(e: any) => setValue(e.target.value)}
                  placeholder="https://yadi.sk/d/...
https://disk.yandex.com/d/..."
                  size="xs"
                  color={color}
                />
                <Center flexDirection="row" mt={2}>
                  <Button mr={2} onClick={closeModal}>
                    Close
                  </Button>
                  <Button colorScheme="green" onClick={importDisks}>
                    Import
                  </Button>
                </Center>
              </Center>
            )}
            {show === 'export' && (
              <Center flexDirection="column" alignItems="end">
                <Textarea value={exportDisks()} height={200} readOnly size="xs" color={color} />
                <Center flexDirection="row" mt={2}>
                  <Button mr={2} onClick={closeModal}>
                    Close
                  </Button>
                  <Button colorScheme="blue" onClick={copyClipboard}>
                    Copy
                  </Button>
                </Center>
              </Center>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Help Modal */}
      <Modal isOpen={helpIsOpen} onClose={helpOnClose} size="full">
        <ModalOverlay />
        <ModalContent alignItems="center" bg="none" onClick={helpOnClose}>
          <ModalBody alignItems="center" display="flex">
            <Image src={helpImage} alt="help.png" />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Alerts */}
      <AlertBox modalRef={cancelRef} onClose={itemAlertOnClose} isOpen={itemAlertIsOpen} onAccept={clearAllItems} body="Do you want to clear all items?" acceptText="Clear" />
      <AlertBox modalRef={cancelRef} onClose={dbAlertOnClose} isOpen={dbAlertIsOpen} onAccept={clearAllDb} body="Do you want to clear all database?" acceptText="Clear" />
    </div>
  );
}

export default Settings;
