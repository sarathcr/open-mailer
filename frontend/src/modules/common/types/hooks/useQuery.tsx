/* eslint-disable no-unused-vars */

import { Filter } from '@/customComponents/types/filterComponents';
import { Pagination } from '../pagination';
import { DocumentNode } from 'graphql';

export type BuildQuery = (
  selectedFields: string[],
  filters: Filter[],
  pagination: Pagination,
  search: string
) => DocumentNode;
