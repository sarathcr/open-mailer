import { ReactNode } from 'react';

export interface DialogComponentProps {
  title?: string;
  children?: ReactNode;
  content?: ReactNode;
  clearDialog?: () => void;
  isOpen?: boolean;
}
