import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';
import { Metadata } from 'next';

import FileUpload from './components/FileUpload';

export const metadata: Metadata = {
  title: 'File Upload',
  description: 'File upload component'
};
export default function Home() {
  return (
    <Background className="flex items-center justify-center">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <FloatingOrb className="animation-delay-2000 absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10" />
      <BackButton className="top-5 left-5" />
      <FileUpload />
    </Background>
  );
}
