import { Filter } from '@/customComponents/types';
import { Pagination } from '@/modules/common/types';
import { gql } from '@apollo/client';

export const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      email
      employeeId
      isActive
      isAdmin
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      employeeId
      isActive
      isAdmin
      createdAt
      updatedAt
      deletedAt
      histories {
        entityId
        entityType
        changeType
        changes {
          fieldName
          oldValue
          newValue
        }
        changedBy
        changedByName
        changedAt
      }
    }
  }
`;

// Dynamically build the query based on selected fields
export const buildUserQuery = (
  selectedFields: string[],
  filters: Filter[],
  pagination: Pagination,
  search: string
) => {
  const defaultFields = ['id', 'firstName', 'lastName', 'email', 'employeeId'];
  const allFields = [...defaultFields, ...selectedFields].join('\n');

  const filterString = createFilterString(filters);
  const paginationString = formatPagination(pagination);
  const searchString = search ? `search: "${search}",` : '';

  return gql`
    query GetUsers {
      users(filter: { ${filterString} }, pagination: ${paginationString}, ${searchString}) {
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

export const formatPagination = (pagination: {
  limit: number;
  page: number;
}): string => {
  const paginationEntries = Object.entries(pagination)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  return `{ ${paginationEntries} }`;
};

export const generateUserQuery = (fields: string[]) => {
  const selectedFields = fields.join('\n');
  return gql`
      query GetUser($id: String!) {
        user(id: $id) {
          ${selectedFields}
        }
      }
    `;
};
