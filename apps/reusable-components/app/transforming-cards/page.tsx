import BackButton from '@/components/buttons/BackButton';
import TransformingCards from './components/TransformingCards';
import './transforming-cards.css';

export default function Home() {
  return (
    <div className="fixed inset-0 bg-black">
      <BackButton className="top-5 left-5" />
      <TransformingCards />
    </div>
  );
}
