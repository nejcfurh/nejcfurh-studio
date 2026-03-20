import { useQuery } from '@repo/react-query';
import axios from 'axios';

import type { Job } from '../types/job';

const rapidApiKey = process.env.EXPO_PUBLIC_RAPID_API_KEY;

const fetchJobs = async (
  endpoint: string,
  query: Record<string, string | number>,
): Promise<Job[]> => {
  const response = await axios.request({
    method: 'GET',
    url: `https://jsearch.p.rapidapi.com/${endpoint}`,
    params: { ...query },
    headers: {
      'x-rapidapi-key': rapidApiKey,
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
  });
  return response.data.data;
};

export const useFetch = (
  endpoint: string,
  query: Record<string, string | number>,
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs', endpoint, query],
    queryFn: () => fetchJobs(endpoint, query),
  });

  return { data: data ?? [], isLoading, error, refetch };
};
