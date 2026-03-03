import { useEffect } from 'react';

interface DeploymentInfo {
  version: string;
  timestamp: number;
}

export const useDeploymentCheck = () => {
  const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

  useEffect(() => {
    if (!isProduction) return;

    const checkDeployment = async () => {
      try {
        // GET CURRENT DEPLOYMENT INFO FROM A VERSION ENDPOINT
        const response = await fetch('/api/version', {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0'
          }
        });

        if (response.ok) {
          const currentDeployment: DeploymentInfo = await response.json();

          // GET THE LAST KNOWN DEPLOYMENT FROM LOCAL STORAGE
          const lastKnownDeployment = localStorage.getItem('lastDeployment');

          if (lastKnownDeployment) {
            const lastDeployment: DeploymentInfo =
              JSON.parse(lastKnownDeployment);

            // IF VERSIONS DON'T MATCH, REFRESH THE PAGE
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
            // FIRST TIME, STORE CURRENT DEPLOYMENT
            localStorage.setItem(
              'lastDeployment',
              JSON.stringify(currentDeployment)
            );
          }
        }
      } catch (error) {
        console.error('Error checking deployment:', error);
      }
    };

    // CHECK IMMEDIATELY
    checkDeployment();

    // CHECK EVERY 30 MINUTES FOR NEW DEPLOYMENTS
    const interval = setInterval(checkDeployment, 1800 * 1000);

    return () => clearInterval(interval);
  }, [isProduction]);
};
