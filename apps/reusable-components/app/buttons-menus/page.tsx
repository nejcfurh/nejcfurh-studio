'use client';

import SocialMediaButtons from './components/social-media/SocialMediaButtons';
import BackButton from '@/components/buttons/BackButton';
import Background from '@/components/Background';
import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import { Activity, useState } from 'react';
import MultiOptionButtons from './components/multi-option/MultiOptionButtons';
import SelectionButton from './components/SelectionButton';
import SwitchVariantButton from './components/multi-option/SwitchVariantButton';

type ButtonType = 'social-media' | 'multi-option';

export default function Home() {
  const [buttonType, setButtonType] = useState<ButtonType>('social-media');
  const [variant, setVariant] = useState<'circular' | 'horizontal'>('circular');

  const handleSwitchVariant = () => {
    setVariant(prev => (prev === 'circular' ? 'horizontal' : 'circular'));
  };

  const handleButtonTypeChange = (buttonType: ButtonType) => () => {
    setButtonType(buttonType);
  };

  return (
    <Background className="grid grid-rows-2 items-center h-full justify-center">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl animate-pulse dark:bg-blue-500/10" />
      <BackButton className="top-5 left-5" />
      <div className="flex flex-col items-center h-full justify-start pt-8 row-span-1">
        <div className="flex items-center justify-start gap-4 z-50">
          {/* BUTTON TYPES */}
          <SelectionButton
            selected={buttonType === 'social-media'}
            handleSelection={handleButtonTypeChange('social-media')}
          >
            Social Media
          </SelectionButton>
          <SelectionButton
            selected={buttonType === 'multi-option'}
            handleSelection={handleButtonTypeChange('multi-option')}
          >
            Multi-option Menu
          </SelectionButton>
        </div>
        {/* SUB-TYPES */}
        {buttonType === 'multi-option' && (
          <SwitchVariantButton
            variant={variant}
            handleSwitchVariant={handleSwitchVariant}
          />
        )}
      </div>

      <div className="flex h-full w-full items-center justify-start row-span-1">
        <Activity mode={buttonType === 'social-media' ? 'visible' : 'hidden'}>
          <SocialMediaButtons />
        </Activity>
        <Activity mode={buttonType === 'multi-option' ? 'visible' : 'hidden'}>
          <MultiOptionButtons variant={variant} />
        </Activity>
      </div>
    </Background>
  );
}
