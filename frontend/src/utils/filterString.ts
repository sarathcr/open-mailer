import { Filter } from '@/customComponents/types';

export const createFilterString = (filters: Filter[]) =>
  filters
    .filter((filter) => filter.value !== undefined)
    .map((filter) => {
      if (filter.options) {
        return `${filter.key}: ${filter.value}`;
      }

      if (typeof filter.value === 'string') {
        return `${filter.key}: "${filter.value}"`;
      }

      return `${filter.key}: ${filter.value}`;
    })
    .join(', ');
