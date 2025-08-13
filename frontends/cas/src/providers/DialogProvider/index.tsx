'use client';
import React, { useState } from 'react';
import { DialogContext } from '../DialogContext';
import { DialogComponentProps } from '@/customComponents/types/dialogComponent';
import DialogComponent from '@/customComponents/DialogComponent';

export const DialogProvider: React.FC<DialogComponentProps> = ({
  children,
}) => {
  const [dialog, setDialogState] = useState<DialogComponentProps | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const setDialog = ({ content, title }: DialogComponentProps) => {
    setDialogState({ content, title });
    setIsOpen(true);
  };

  const clearDialog = () => {
    setIsOpen(false);
  };

  return (
    <DialogContext.Provider value={{ setDialog, isOpen, clearDialog }}>
      {children}
      {dialog && (
        <DialogComponent
          title={dialog.title}
          isOpen={isOpen}
          clearDialog={clearDialog}
        >
          {dialog.content}
        </DialogComponent>
      )}
    </DialogContext.Provider>
  );
};
