import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogComponentProps } from '../types/dialogComponent';

export const DialogComponent: React.FC<DialogComponentProps> = ({
  title,
  children,
  isOpen,
  clearDialog,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={clearDialog}>
      <DialogContent>
        <div className="grid gap-4 py-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;
