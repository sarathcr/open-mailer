import { useQuery } from '@apollo/client';
import { GET_PROFILE_QUERY } from '@/modules/profile/gql';

export const useProfile = () => {
  const { data, loading } = useQuery(GET_PROFILE_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const profileData = data?.getProfile ?? {};

  return {
    profileData,
    loading,
  };
};
