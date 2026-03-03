import { useEffect, useState } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export const useUserLocation = (): {
  location: Location | null;
  loading: boolean;
  error: string | null;
} => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        // IPAPI FOR IP-BASED GEOLOCATION
        const response = await fetch('https://free.freeipapi.com/api/json');
        const data = await response.json();

        console.log('data', data);

        if (data.latitude && data.longitude) {
          setLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.cityName,
            country: data.countryName,
          });
        } else {
          throw new Error('Unable to determine location');
        }
      } catch (err) {
        console.error('Error fetching location:', err);
        setError('Failed to get your location');
        // FALLBACK TO LJUBLJANA COORDINATES
        setLocation({
          latitude: 46.05,
          longitude: 14.51,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { location, loading, error };
};
