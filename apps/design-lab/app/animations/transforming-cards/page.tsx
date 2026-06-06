import BackButton from '@/components/buttons/BackButton';
import type { Metadata } from 'next';

import './transforming-cards.css';

import TransformingCards from '@/features/transforming-cards/components/TransformingCards';

export const metadata: Metadata = {
  title: 'Disappearing Cards | Design Lab',
  description: 'Disappearing cards component.'
};

export default function Home() {
  return (
    <div className="fixed inset-0 bg-black">
      <BackButton className="top-5 left-5" />
      <TransformingCards />
    </div>
  );
}
