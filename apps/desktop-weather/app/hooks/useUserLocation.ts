import { useQuery } from '@repo/react-query';

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

const FALLBACK_LOCATION: Location = {
  latitude: 46.05,
  longitude: 14.51
};

async function fetchLocation(): Promise<Location> {
  const response = await fetch('https://free.freeipapi.com/api/json');
  const data = await response.json();

  if (data.latitude && data.longitude) {
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.cityName,
      country: data.countryName
    };
  }

  throw new Error('Unable to determine location');
}

export const useUserLocation = (): {
  location: Location | null;
  loading: boolean;
  error: string | null;
} => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-location'],
    queryFn: fetchLocation,
    staleTime: Infinity,
    retry: false,
    placeholderData: FALLBACK_LOCATION
  });

  return {
    location: data ?? FALLBACK_LOCATION,
    loading: isLoading,
    error: error ? 'Failed to get your location' : null
  };
};
