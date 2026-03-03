import { ReviewAnalysisForm } from './feature/review-analysis/components/ReviewAnalysisForm';
import Footer from './components/Footer';
import Chatbox from './components/Chatbox';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gray-950 flex flex-col">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-950 via-purple-950 to-gray-950 animate-gradient-shift" />

      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(0,0,0,0.5))]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Gradient orbs with higher opacity and larger size */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 -right-10 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      {/* Content */}
      <div className="relative z-10 grow">
        <ReviewAnalysisForm />
      </div>

      {/* Chatbox */}
      <Suspense fallback={<div>Loading...</div>}>
        <Chatbox />
      </Suspense>

      {/* Footer */}
      <div className="relative mt-auto z-10">
        <Footer />
      </div>
    </main>
  );
}
