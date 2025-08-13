import { FC, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, FilterComponentProps } from '../types';

export const FilterComponent: FC<FilterComponentProps> = ({
  appliedFilters,
  filterOptions,
  onChange,
}) => {
  const [filters, setFilters] = useState<Filter[]>(appliedFilters);
  const [availableFilters, setAvailableFilters] = useState<Filter[]>([]);

  // Set available filters only on initial mount
  useEffect(() => {
    setAvailableFilters(
      filterOptions.filter(
        (option) =>
          !appliedFilters.some((applied) => applied.key === option.key)
      )
    );
  }, [filterOptions, appliedFilters]); // Add appliedFilters to the dependency array

  const handleFilterChange = (key: string, newValue: string | boolean) => {
    const parsedValue =
      newValue === 'true' ? true : newValue === 'false' ? false : newValue;

    const updatedFilters = filters.map((filter) =>
      filter.key === key ? { ...filter, value: parsedValue } : filter
    );
    setFilters(updatedFilters);
    onChange(updatedFilters);
  };

  const handleAddFilter = (filterKey: string) => {
    const filterToAdd = availableFilters.find((f) => f.key === filterKey);
    if (filterToAdd) {
      const updatedFilters = [...filters, filterToAdd];
      setFilters(updatedFilters);
      setAvailableFilters(availableFilters.filter((f) => f.key !== filterKey));
      onChange(updatedFilters);
    }
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = filters.filter((filter) => filter.key !== key);
    const filterToRemove = filters.find((filter) => filter.key === key);
    if (filterToRemove) {
      setFilters(updatedFilters);
      setAvailableFilters([...availableFilters, filterToRemove]);
      onChange(updatedFilters);
    }
  };

  return (
    <div className="flex flex-row-reverse justify-between">
      <div className="flex flex-col gap-[10px]">
        {availableFilters.length > 0 && (
          <>
            <span className="ml-auto mr-[116px] text-sm font-medium">
              Add filter
            </span>
            <Select onValueChange={handleAddFilter}>
              <SelectTrigger className="ml-auto w-[180px] rounded border p-2 focus:border-primary focus:outline-none focus:ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {availableFilters.map((filter) => (
                    <SelectItem key={filter.key} value={filter.key}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-[10px]">
        {filters.length === 0 ? (
          <p className="text-sm text-[rgb(9,11,11)]">No filters applied</p>
        ) : (
          filters.map((filter) => (
            <div key={filter.key}>
              <span className="text-sm font-medium">{filter.label}</span>
              <div className="flex items-center">
                <Select
                  onValueChange={(value) =>
                    handleFilterChange(filter.key, value)
                  }
                  defaultValue={String(filter.value)} // Ensure a string default value
                >
                  <SelectTrigger className="w-[180px] rounded border p-2 focus:border-primary focus:outline-none focus:ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {filter.options.map((option) => (
                        <SelectItem
                          key={option.label}
                          value={String(option.value)}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <X
                  className="h-4 w-4 cursor-pointer text-destructive opacity-70 hover:opacity-100"
                  aria-label={`Remove filter: ${filter.label}`}
                  onClick={() => handleRemoveFilter(filter.key)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
