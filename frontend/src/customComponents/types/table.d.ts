/* eslint-disable no-unused-vars */
import { Option } from '@/components/ui/multiSelector';
import { ReactNode } from 'react';

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  className?: string;

  format?: (value: any) => ReactNode; // Function to format the cell data
};

export type Action<T> = {
  label: string;
  onClick: (row: T) => void;
  icon: ReactNode; // Use ReactNode for the icon component
  isVisible?: (row: T) => void;
};

export type TableProps<T> = {
  className?: string;
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[]; // List of actions with icons
};

export interface TableOption<T> extends Omit<Option, 'format'> {
  value: keyof T;
}
