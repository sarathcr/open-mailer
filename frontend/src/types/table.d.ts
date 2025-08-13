import { ReactNode } from 'react';
export type Column<T> = {
  header: string;
  accessor?: keyof T;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  format?: (value: any) => ReactNode; // Function to format the cell data
};

export type TableProps<T> = {
  className?: string;
  columns: Column[];
  data: T[];
};
