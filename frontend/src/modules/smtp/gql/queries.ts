import { Filter } from '@/customComponents/types';
import { Pagination } from '@/modules/common/types/pagination';
import { formatPagination } from '@/modules/template/gql';
import { gql } from '@apollo/client';

export const FIND_ALL_SMTP_QUERY = gql`
  query FindAllSmtp($filter: FilterSmtpConfigInput) {
    findAllSmtp(filter: $filter) {
      data {
        id
        host
        port
        username
        password
        from
        secure
      }
    }
  }
`;

export const GET_SMTP_COUNT = gql`
  query GetSMTPCount {
    findAllSmtp {
      total
    }
  }
`;
export const buildfindAllSmtpQuery = (
  selectedFields: string[],
  filters: Filter[],
  pagination: Pagination,
  search: string
) => {
  const defaultFields = ['id', 'host', 'port', 'username', 'from', 'secure'];
  const allFields = [...defaultFields, ...selectedFields].join('\n');

  const filterString = createFilterString(filters);
  const paginationString = formatPagination(pagination);
  const searchString = search ? `search: "${search}",` : '';

  return gql`
    query findAllSmtp {
      findAllSmtp(filter: { ${filterString} }, pagination: ${paginationString}, ${searchString}) {
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
