export interface Option {
  label: string;
  value: string | boolean;
}

export interface Filter {
  key: string;
  label: string;
  value: string | boolean;
  options: Option[];
}

export interface FilterComponentProps {
  appliedFilters: Filter[];
  filterOptions: Filter[];
  // eslint-disable-next-line no-unused-vars
  onChange: (filters: Filter[]) => void;
  className?: string;
}
