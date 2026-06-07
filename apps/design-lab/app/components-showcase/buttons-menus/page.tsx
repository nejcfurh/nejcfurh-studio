'use client';

import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';
import MagneticButtons from '@/features/buttons-menus/components/magnetic-buttons/MagneticButtons';
import MultiOptionButtons from '@/features/buttons-menus/components/multi-option/MultiOptionButtons';
import SwitchVariantButton from '@/features/buttons-menus/components/multi-option/SwitchVariantButton';
import SelectionButton from '@/features/buttons-menus/components/SelectionButton';
import SocialMediaButtons from '@/features/buttons-menus/components/social-media/SocialMediaButtons';
import { Activity, useState } from 'react';

type ButtonType = 'social-media' | 'multi-option' | 'magnetic-buttons';

export default function Home() {
  const [buttonType, setButtonType] = useState<ButtonType>('social-media');
  const [variant, setVariant] = useState<'circular' | 'horizontal'>('circular');

  const handleSwitchVariant = () => {
    setVariant((prev) => (prev === 'circular' ? 'horizontal' : 'circular'));
  };

  const handleButtonTypeChange = (buttonType: ButtonType) => () => {
    setButtonType(buttonType);
  };

  return (
    <Background className="grid h-full grid-rows-2 items-center justify-center overflow-hidden">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <BackButton className="top-5 left-5" />
      <div className="flex h-full flex-col items-center justify-start px-4 pt-20 sm:pt-8">
        <div className="z-50 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
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
          <SelectionButton
            selected={buttonType === 'magnetic-buttons'}
            handleSelection={handleButtonTypeChange('magnetic-buttons')}
          >
            Magnetic Buttons
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

      <div className="row-span-1 flex h-full w-full items-center justify-start">
        <Activity mode={buttonType === 'social-media' ? 'visible' : 'hidden'}>
          <SocialMediaButtons />
        </Activity>
        <Activity mode={buttonType === 'multi-option' ? 'visible' : 'hidden'}>
          <MultiOptionButtons variant={variant} />
        </Activity>
        <Activity
          mode={buttonType === 'magnetic-buttons' ? 'visible' : 'hidden'}
        >
          <MagneticButtons />
        </Activity>
      </div>
    </Background>
  );
}
