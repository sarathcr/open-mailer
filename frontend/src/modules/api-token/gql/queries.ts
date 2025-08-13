import { Filter } from '@/customComponents/types';
import { Pagination } from '@/modules/common/types/pagination';
import { formatPagination } from '@/modules/template/gql';
import { gql } from '@apollo/client';

export const FIND_ONE_APITOKEN_QUERY = gql`
  query apiToken($id: String!) {
    apiToken(id: $id) {
      id
      name
      status
      duration

      createdAt
      expireAt
      deletedAt
      token
    }
  }
`;

export const REGENERATE_APITOKEN_QUERY = gql`
  query regenerateToken($id: String!) {
    regenerateToken(id: $id) {
      token
    }
  }
`;
export const apitokenQuery = (
  selectedFields: string[],
  filters: Filter[],
  pagination: Pagination,
  search: string
) => {
  const defaultFields = ['id', 'name', 'duration', 'status'];
  const allFields = [...defaultFields, ...selectedFields].join('\n');

  const filterString = createFilterString(filters);
  const paginationString = formatPagination(pagination);
  const searchString = search ? `search: "${search}",` : '';

  return gql`
    query apiTokens {
      apiTokens(filter: { ${filterString} }, pagination: ${paginationString}, ${searchString}) {
      totalPages
      total
      page
      limit
      data {${allFields}}
      }
    }
  `;
};

const createFilterString = (filters: Filter[]) =>
  filters
    .filter((filter) => filter.value !== undefined)
    .map((filter) => `${filter.key}: ${JSON.stringify(filter.value)}`)
    .join(', ');
