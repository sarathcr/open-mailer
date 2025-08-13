import { DialogComponentProps } from '@/customComponents/types/dialogComponent';
import { DialogContext } from '@/providers/DialogContext';
import { useContext } from 'react';

const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }

  const { setDialog, isOpen, clearDialog } = context;

  const openDialog = ({ content, title }: DialogComponentProps) => {
    setDialog({ content, title });
  };

  return { openDialog, isOpen, clearDialog };
};

export default useDialog;
