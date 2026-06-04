'use client';

import dynamic from 'next/dynamic';

const ListingMapImpl = dynamic(() => import('./ListingMapImpl'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted h-full w-full animate-pulse rounded-lg" />
  )
});

type Props = {
  lat: number;
  lng: number;
  label?: string;
};

export const ListingMap = ({ lat, lng, label }: Props) => {
  return (
    <div className="isolate h-full w-full">
      <ListingMapImpl lat={lat} lng={lng} label={label} />
    </div>
  );
};
