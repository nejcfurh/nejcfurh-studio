'use client';

import BackButton from '@/components/buttons/BackButton';
import { useState } from 'react';

import AngledMediaSlider from './components/AngledMediaSlider';
import OverlayTextButton from './components/OverlayTextButton';

export default function Home() {
  const [displayTextOverlay, setDisplayTextOverlay] = useState(false);

  const handleDisplayTextOverlay = () => {
    setDisplayTextOverlay((prev) => !prev);
  };

  return (
    <div className="m-0 flex h-screen w-screen flex-col items-center justify-center p-0">
      <BackButton className="top-5 left-5" />
      <OverlayTextButton
        handleDisplayTextOverlay={handleDisplayTextOverlay}
        displayTextOverlay={displayTextOverlay}
      />
      {/* ENABLE TEXT TRUE WILL ENABLE OPAQUE OVERLAY WITH THE VIDEO TITLE */}
      <AngledMediaSlider enableText={displayTextOverlay} />
    </div>
  );
}
