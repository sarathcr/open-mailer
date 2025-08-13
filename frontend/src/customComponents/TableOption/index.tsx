import { FC } from 'react';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { TableOptionProps } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

const TypedDualListBox = DualListBox as unknown as FC<any>;

export const TableOption: FC<TableOptionProps> = ({
  options,
  selected,
  onChange,
}) => {
  return (
    <TypedDualListBox
      options={options}
      selected={selected}
      onChange={onChange}
      showOrderButtons={true}
      icons={{
        moveLeft: <ChevronLeft />,
        moveAllLeft: <ChevronsLeft />,
        moveRight: <ChevronRight />,
        moveAllRight: <ChevronsRight />,
      }}
    />
  );
};
