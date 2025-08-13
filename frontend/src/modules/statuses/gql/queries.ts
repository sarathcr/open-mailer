import { Filter } from '@/customComponents/types';
import { Pagination } from '@/modules/common/types/pagination';
import { formatPagination } from '@/modules/template/gql';
import { createFilterString } from '@/utils/filterString';
import { gql } from '@apollo/client';

export const GET_MAIL_COUNTS = gql`
  query getMailCounts {
    getMailCounts {
      total
      pending
      failed
      success
    }
  }
`;

export const buildFindAllStatusesQuery = (
  selectedFields: string[],
  filters: Filter[],
  pagination: Pagination,
  search: string
) => {
  const defaultFields = [
    'id',
    'recipients',
    'status',
    'retries',
    'errorMessage',
  ];

  const nestedFields = `
    smtpConfig { from }
    emailTemplate { name }
    apiToken { name }
  `;

  const allFields = [...defaultFields, ...selectedFields].join('\n');

  const filterString = createFilterString(filters);
  const paginationString = formatPagination(pagination);
  const searchString = search ? `search: "${search}",` : '';

  return gql`
    query findAllStatuses {
      statuses(filterInput: { ${filterString} }, pagination: ${paginationString}, ${searchString}) {
        totalPages
        total
        page
        limit
        data {
          ${allFields}
          ${nestedFields}
        }
      }
    }
  `;
};
