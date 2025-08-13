import { gql } from '@apollo/client';

export const FIND_ALL_EMAIL_TEMPLATES = gql`
  query findAllEmailTemplates {
    findAllEmailTemplates(filter: {}, sort: {}) {
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

export const FIND_ONE_EMAIL_TEMPLATE = gql`
  query findOneEmailTemplate($emailTemplateId: String!) {
    findOneEmailTemplate(id: $emailTemplateId) {
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
`;
