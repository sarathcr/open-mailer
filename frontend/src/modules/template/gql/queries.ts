import { Filter } from '@/customComponents/types/filterComponents';
import { Pagination } from '@/modules/common/types/pagination';
import { gql } from '@apollo/client';

export const GET_EMAIL_TEMPLATE = gql`
  query FindOneEmailTemplate($id: String!) {
    findOneEmailTemplate(id: $id) {
      id
      name
      filePath
      primaryImageUrl
      primaryLinkUrl
      primaryBg
      secondaryImageUrl
      secondaryLinkUrl
      secondaryBg
      footerContent
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const GET_EMAIL_TEMPLATES = gql`
  query findAllEmailTemplates {
    findAllEmailTemplates(filter: {}, sort: {}, search: "string") {
      totalPages
      total
      page
      limit
      data {
        id
        name
        filePath
        primaryImageUrl
        primaryLinkUrl
        primaryBg
        primaryColor
        secondaryImageUrl
        secondaryLinkUrl
        secondaryBg
        footerContent
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`;
export const GET_TEMPLATE_COUNT = gql`
  query GetTemplateCount {
    findAllEmailTemplates {
      total
    }
  }
`;
// Dynamically build the query based on selected fields
export const buildfindAllEmailTemplatesQuery = (
  selectedFields: string[],
  filters: Filter[],
  pagination: Pagination,
  search: string
) => {
  const defaultFields = ['id', 'name', 'filePath'];
  const allFields = [...defaultFields, ...selectedFields].join('\n');

  const filterString = createFilterString(filters);
  const paginationString = formatPagination(pagination);
  const searchString = search ? `search: "${search}",` : '';

  return gql`
    query findAllEmailTemplates {
      findAllEmailTemplates(filter: { ${filterString} }, pagination: ${paginationString}, ${searchString}) {
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
