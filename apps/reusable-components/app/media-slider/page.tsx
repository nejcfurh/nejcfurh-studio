'use client';

import AngledMediaSlider from './components/AngledMediaSlider';
import BackButton from '@/components/buttons/BackButton';
import { useState } from 'react';
import OverlayTextButton from './components/OverlayTextButton';
export default function Home() {
  const [displayTextOverlay, setDisplayTextOverlay] = useState(false);

  const handleDisplayTextOverlay = () => {
    setDisplayTextOverlay(prev => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-0 m-0">
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
