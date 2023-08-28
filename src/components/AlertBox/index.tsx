import React from 'react';
import { AlertDialog, AlertDialogOverlay, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, Button, useColorModeValue } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

interface AlertBoxProps {
  title?: string;
  body?: string;
  declineText?: string | null;
  acceptText?: string;
  acceptColor?: string;
  onAccept?: () => void;
  isOpen: boolean;
  modalRef: React.RefObject<FocusableElement>;
  onClose: () => void;
}

export const AlertBox = ({
  title = 'Are you sure?',
  body = 'Are you sure you want to perform this action?',
  declineText = 'No',
  acceptText = 'Yes',
  acceptColor = 'red',
  onAccept,
  isOpen,
  modalRef,
  onClose,
}: AlertBoxProps): JSX.Element => {
  const color = useColorModeValue('#2f2f2f', '#e4f9f5');

  return (
    <AlertDialog isCentered isOpen={isOpen} leastDestructiveRef={modalRef} onClose={() => onClose()}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader color={color} fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody color={color}>{body}</AlertDialogBody>

          <AlertDialogFooter>
            {declineText ? (
              <Button ref={modalRef as React.LegacyRef<HTMLButtonElement> | undefined} onClick={() => onClose()}>
                {declineText}
              </Button>
            ) : null}
            <Button
              ml={3}
              colorScheme={acceptColor}
              ref={modalRef as React.LegacyRef<HTMLButtonElement> | undefined}
              onClick={() => {
                if (onAccept) onAccept();
                onClose();
              }}
            >
              {acceptText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
