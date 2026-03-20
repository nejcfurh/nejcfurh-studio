import { useQuery } from '@repo/react-query';
import { useEffect } from 'react';

interface DeploymentInfo {
  version: string;
  timestamp: number;
}

async function fetchDeploymentVersion(): Promise<DeploymentInfo> {
  const response = await fetch('/api/version', {
    cache: 'no-cache',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch deployment version');
  }

  return response.json();
}

export const useDeploymentCheck = () => {
  const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

  const { data: currentDeployment } = useQuery({
    queryKey: ['deployment-version'],
    queryFn: fetchDeploymentVersion,
    enabled: isProduction,
    refetchInterval: 1800 * 1000
  });

  useEffect(() => {
    if (!currentDeployment || !isProduction) return;

    const lastKnownDeployment = localStorage.getItem('lastDeployment');

    if (lastKnownDeployment) {
      const lastDeployment: DeploymentInfo = JSON.parse(lastKnownDeployment);

      if (lastDeployment.version !== currentDeployment.version) {
        console.log('New deployment detected, refreshing...');
        localStorage.setItem(
          'lastDeployment',
          JSON.stringify(currentDeployment)
        );
        window.location.reload();
        return;
      }
    } else {
      localStorage.setItem('lastDeployment', JSON.stringify(currentDeployment));
    }
  }, [currentDeployment, isProduction]);
};
