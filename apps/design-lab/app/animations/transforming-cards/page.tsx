import BackButton from '@/components/buttons/BackButton';

import './transforming-cards.css';

import TransformingCards from '@/features/transforming-cards/components/TransformingCards';

export default function Home() {
  return (
    <div className="fixed inset-0 bg-black">
      <BackButton className="top-5 left-5" />
      <TransformingCards />
    </div>
  );
}
