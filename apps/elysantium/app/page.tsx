import Navbar from '@/components/Navbar';
import RoomsSection from '@/components/RoomsSection';
import { AnalyticsClientPageEvent } from '@/features/analytics/types.client';
import { PageName } from '@/utils/constants/page.data';
import { PageVisitTracker } from '@analytics/components/PageVisitTracker';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0f] p-4! text-white md:p-8! lg:p-12!">
      {/* Fixed background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat blur-xs"
        style={{ backgroundImage: "url('/placeholder-image.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero content */}
      <section className="relative z-10 flex min-h-[calc(100vh-120px)] flex-col items-center justify-end pb-32 text-center">
        <p className="mb-6 max-w-4xl text-4xl leading-[1.1] font-light tracking-tight text-balance text-white/90 sm:text-5xl md:text-6xl lg:text-7xl">
          Where timeless luxury meets modern comfort
        </p>
        <p className="mb-16 max-w-md text-sm leading-relaxed font-light text-white/40 md:text-base">
          A retreat crafted for those who seek refinement in every detail.
        </p>

        <div className="flex flex-col items-center gap-8 sm:flex-row">
          <a
            href="#rooms"
            className="border border-[#d4a954] bg-[#d4a954]/10 px-14 py-5 text-base font-light tracking-[0.3em] text-[#d4a954] uppercase backdrop-blur-sm transition-all duration-300 ease-out hover:scale-[1.03] hover:bg-[#d4a954]/20 hover:shadow-[0_0_45px_rgba(212,169,84,0.25)] active:scale-[0.98] motion-reduce:transform-none md:text-lg"
          >
            Explore Rooms
          </a>
          <a
            href="#contact"
            className="ease px-10 py-4 text-sm tracking-[0.25em] text-white/60 uppercase transition-colors duration-300 hover:text-white"
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* About section */}
      <section
        id="about"
        className="relative z-10 flex flex-col items-center py-36 text-center"
      >
        <div className="mb-8 h-px w-16 bg-linear-to-r from-transparent via-[#d4a954] to-transparent" />
        <p className="mb-4 text-sm tracking-[0.3em] text-[#d4a954]/70 uppercase">
          Our story
        </p>
        <h2 className="mb-10 text-3xl font-extralight tracking-wider text-white md:text-4xl">
          A Legacy of Splendor
        </h2>
        <p className="max-w-2xl px-6 text-base leading-relaxed font-light text-white/50">
          For centuries, the halls of Elysantium have welcomed travelers seeking
          respite from the world. Our architecture draws from an age of
          grandeur, while our service embodies the warmth and attentiveness of a
          modern luxury retreat. Every corridor, every room, every detail has
          been considered — so that your stay feels less like a visit and more
          like a homecoming.
        </p>
      </section>

      {/* Rooms preview */}
      <RoomsSection />

      {/* Contact / CTA */}
      <section
        id="contact"
        className="relative z-10 flex flex-col items-center py-36 text-center"
      >
        <div className="mb-8 h-px w-16 bg-linear-to-r from-transparent via-[#d4a954] to-transparent" />
        <p className="mb-4 text-sm tracking-[0.3em] text-[#d4a954]/70 uppercase">
          Reservations
        </p>
        <h2 className="mb-6 text-3xl font-extralight tracking-wider text-white md:text-4xl">
          Begin Your Stay
        </h2>
        <p className="mb-12 text-base font-light text-white/40">
          Reach out to our concierge to reserve your experience.
        </p>
        <a
          href="mailto:reservations@elysantium.com"
          className="inline-block border border-[#d4a954] bg-[#d4a954]/10 px-12 py-4 text-sm tracking-[0.25em] text-[#d4a954] uppercase backdrop-blur-sm transition-all hover:bg-[#d4a954]/20 hover:shadow-[0_0_30px_rgba(212,169,84,0.15)]"
        >
          Contact Us
        </a>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10">
        <p className="text-center text-xs text-white/25">
          &copy; {new Date().getFullYear()} Elysantium Hotel. All rights
          reserved.
        </p>
      </footer>
      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.ELYSANTIUM_HOMEPAGE
        }}
      />
    </main>
  );
}
