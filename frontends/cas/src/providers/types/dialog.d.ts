import { DialogComponentProps } from '@/customComponents/types';

export interface DialogContextValue {
  // eslint-disable-next-line no-unused-vars
  setDialog: (dialog: DialogComponentProps) => void;
  clearDialog: () => void;
  isOpen: boolean;
}
