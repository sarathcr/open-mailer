export interface ProfileProps {
  name: string;
  email: string;
  emp_id: string;
  loading?: boolean;
  dropdownItems?: DropdownItem[];
}

export interface DropdownItem {
  label: string;
  action: () => void;
}
