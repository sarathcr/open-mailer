/* eslint-disable no-unused-vars */

import { Filter } from './filterComponents';

export interface TableSettingsProps {
  className?: string;
  appliedFilters: Filter[];
  filterOptions: Filter[];
  onChangeFilter: (filters: Filter[]) => void;
  options: Option[];
  selectedOptions: string[];
  onChangeOptions: (values: string[]) => void;
  onClickApply: () => void;
}

interface Option {
  value: string;
  label: string;
}

export interface TableOptionProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
}
