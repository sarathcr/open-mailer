import { GET_EMAIL_TEMPLATES } from '@/modules/template/gql/queries';
import { useQuery } from '@apollo/client';

export const useEmailTemplates = (pagination = {}, filter = {}, sort = {}) => {
  const { loading, error, data } = useQuery(GET_EMAIL_TEMPLATES, {
    variables: { pagination, filter, sort },
  });

  return { loading, error, templates: data?.findAllEmailTemplates.data || [] };
};
