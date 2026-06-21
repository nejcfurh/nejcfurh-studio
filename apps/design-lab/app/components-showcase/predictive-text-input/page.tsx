'use client';

import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import AnimationTitle from '@/components/AnimationTitle';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';
import { PredictiveTextInput } from '@/features/predictive-text-input/components/PredictiveTextInput';
import PredictiveTextInputFooter from '@/features/predictive-text-input/components/PredictiveTextInputFooter';
import { QUERY_KEYWORDS } from '@/features/predictive-text-input/constants';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { useState } from 'react';

export default function PredictiveTextInputPage() {
  const [value, setValue] = useState('');

  return (
    <Background className="flex items-center justify-center px-4 pt-28 pb-10">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <FloatingOrb className="animation-delay-2000 absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10" />

      <BackButton className="top-5 left-5 z-50" />
      <AnimationTitle
        title="Predictive Text Input"
        subtitle="Ghost completions inline — Tab or → to accept."
      />

      <AnimatedDiv className="z-50 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <PredictiveTextInput
          keywords={QUERY_KEYWORDS}
          value={value}
          onChange={setValue}
          placeholder="Type a query keyword…"
        />
      </AnimatedDiv>

      <PredictiveTextInputFooter />
    </Background>
  );
}
