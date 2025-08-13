/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery } from '@apollo/client';
import { useEffect, useState, useMemo, useCallback, ChangeEvent } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Filter } from '@/customComponents/types';
import { Pagination } from '@/modules/common/types';
import { BuildQuery } from '../types/hooks';
import { debounce } from 'lodash';

// Utility function to parse query parameters (since they are strings in URL)
const parseQueryParam = (param: string | string[] | undefined) => {
  if (param === undefined) return undefined;
  if (Array.isArray(param)) return param[0];
  return param;
};

// Utility function to safely parse JSON in the query
const parseJsonQuery = (
  queryValue: string | string[] | undefined,
  defaultValue: any
) => {
  if (!queryValue) return defaultValue;
  try {
    return JSON.parse(queryValue as string);
  } catch {
    return defaultValue;
  }
};

export const useQuery = (buildQuery: BuildQuery) => {
  const pathname = usePathname(); // Get pathname from usePathname
  const searchParams = useSearchParams(); // Get search parameters from useSearchParams
  const query = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  // Initialize search state from query params
  const [search, setSearch] = useState<string>(
    parseQueryParam(query.search) || ''
  );

  // Initialize state from query params or use default values
  const [selectedFields, setSelectedFields] = useState<string[]>(
    parseJsonQuery(query.selectedFields, [])
  );
  const [filters, setFilters] = useState<Filter[]>(
    parseJsonQuery(query.filters, [])
  );
  const [pagination, setPagination] = useState<Pagination>({
    page: parseQueryParam(query.page) ? Number(query.page) : 1,
    limit: parseQueryParam(query.limit) ? Number(query.limit) : 15,
  });

  // Temporary states
  const [tempSearch, setTempSearch] = useState<string>(
    parseQueryParam(query.search) || ''
  );
  const [tempSelectedFields, setTempSelectedFields] = useState<string[]>(
    parseJsonQuery(query.selectedFields, [])
  );
  const [tempFilters, setTempFilters] = useState<Filter[]>(
    parseJsonQuery(query.filters, [])
  );

  // Memoize the debounced function to persist across renders
  const debouncedSetTempSearch = useMemo(
    () =>
      debounce((value: string) => {
        setTempSearch(value);
      }, 300),
    []
  );

  // Clean up the debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetTempSearch.cancel();
    };
  }, [debouncedSetTempSearch]);

  // Build the query dynamically based on current state
  const queryStr = useMemo(
    () => buildQuery(tempSelectedFields, tempFilters, pagination, tempSearch),
    [tempSelectedFields, tempFilters, pagination, tempSearch]
  );

  // Memoized Apollo lazy query
  const [refetch, { data, loading, error }] = useLazyQuery(queryStr, {
    fetchPolicy: 'network-only',
  });

  // Fetch data when component mounts or when query changes
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Update URL query parameters when search, filters, selected fields, or pagination change
  const updateQueryParams = (
    newFilters: Filter[],
    newPagination: Pagination,
    newFields: string[],
    newSearch: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('selectedFields', JSON.stringify(newFields));
    params.set('filters', JSON.stringify(newFilters));
    params.set('page', newPagination.page.toString());
    params.set('limit', newPagination.limit.toString());
    params.set('search', newSearch);

    // Update the URL with the new query params using window.history.pushState
    window.history.pushState({}, '', `${pathname}?${params.toString()}`);
  };

  const updateSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newSearchValue = e.target.value;
      setSearch(newSearchValue);
      updateQueryParams(filters, pagination, selectedFields, newSearchValue); // Sync query params
      debouncedSetTempSearch(newSearchValue);
    },
    [filters, pagination, selectedFields]
  );

  // Memoized setPage function
  const setPage = useCallback(
    (page: number) => {
      const updatedPagination = { ...pagination, page };
      setPagination(updatedPagination);
      updateQueryParams(filters, updatedPagination, selectedFields, search); // Sync query params
    },
    [filters, pagination, selectedFields, search]
  );

  // Memoized setLimit function
  const setLimit = useCallback(
    (limit: number) => {
      const updatedPagination = { ...pagination, limit };
      setPagination(updatedPagination);
      updateQueryParams(filters, updatedPagination, selectedFields, search); // Sync query params
    },
    [filters, pagination, selectedFields, search]
  );

  // Memoized setFilters function
  const updateFilters = useCallback(
    (newFilters: Filter[]) => {
      setFilters(newFilters);
      updateQueryParams(newFilters, pagination, selectedFields, search); // Sync query params
    },
    [pagination, selectedFields, search]
  );

  // Memoized setSelectedFields function
  const updateSelectedFields = useCallback(
    (newFields: string[]) => {
      setSelectedFields(newFields);
      updateQueryParams(filters, pagination, newFields, search); // Sync query params
    },
    [filters, pagination, search]
  );

  const onClickApply = () => {
    setTempSelectedFields(selectedFields);
    setTempFilters(filters);
  };

  return {
    data,
    loading,
    error,
    selectedFields,
    applyedSelectedFields: tempSelectedFields,
    applyedFilters: tempFilters,
    filters,
    pagination,
    search,
    setSearch: updateSearch,
    setSelectedFields: updateSelectedFields,
    setFilters: updateFilters,
    setPage,
    setLimit,
    refetch,
    onClickApply,
  };
};
