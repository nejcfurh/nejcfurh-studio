import { Suspense } from 'react';

import Chatbox from './components/Chatbox';
import Footer from './components/Footer';
import { ReviewAnalysisForm } from './feature/review-analysis/components/ReviewAnalysisForm';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gray-950">
      {/* Animated gradient background */}
      <div className="animate-gradient-shift absolute inset-0 bg-linear-to-br from-gray-950 via-purple-950 to-gray-950" />

      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(0,0,0,0.5))]" />

      {/* Grid pattern overlay */}
      <div className="bg-grid-pattern absolute inset-0 opacity-40" />

      {/* Gradient orbs with higher opacity and larger size */}
      <div className="animate-blob absolute top-0 -left-10 h-96 w-96 rounded-full bg-purple-600 opacity-30 mix-blend-screen blur-3xl filter" />
      <div className="animate-blob animation-delay-2000 absolute top-0 -right-10 h-96 w-96 rounded-full bg-amber-600 opacity-25 mix-blend-screen blur-3xl filter" />
      <div className="animate-blob animation-delay-4000 absolute -bottom-20 left-1/4 h-96 w-96 rounded-full bg-pink-600 opacity-30 mix-blend-screen blur-3xl filter" />

      {/* Content */}
      <div className="relative z-10 grow">
        <ReviewAnalysisForm />
      </div>

      {/* Chatbox */}
      <Suspense fallback={<div>Loading...</div>}>
        <Chatbox />
      </Suspense>

      {/* Footer */}
      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </main>
  );
}
