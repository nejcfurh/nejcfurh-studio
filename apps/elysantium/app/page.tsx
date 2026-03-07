import Link from 'next/link';

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
      <nav className="relative z-10 flex items-center justify-between px-10">
        <Link
          href="/"
          className="text-2xl font-light tracking-[0.3em] text-[#d4a954] uppercase"
        >
          Elysantium
        </Link>
        <div className="flex items-center gap-10">
          <a
            href="#about"
            className="text-sm tracking-widest text-white/70 uppercase transition-colors hover:text-[#d4a954]"
          >
            About
          </a>
          <a
            href="#rooms"
            className="text-sm tracking-widest text-white/70 uppercase transition-colors hover:text-[#d4a954]"
          >
            Rooms
          </a>
          <a
            href="#contact"
            className="text-sm tracking-widest text-white/70 uppercase transition-colors hover:text-[#d4a954]"
          >
            Contact
          </a>
          <Link
            href="/admin-login"
            className="border border-[#d4a954]/40 px-5 py-2 text-sm tracking-widest text-[#d4a954] uppercase transition-all hover:border-[#d4a954] hover:bg-[#d4a954]/10"
          >
            Staff
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <section className="relative z-10 flex min-h-[calc(100vh-120px)] flex-col items-center justify-end pb-32 text-center">
        <h1 className="mb-6 text-5xl font-extralight tracking-wider text-white md:text-6xl lg:text-9xl">
          Elysantium
        </h1>
        <p className="mb-4 text-lg font-light tracking-wide text-white/60 md:text-xl">
          Where timeless luxury meets modern comfort
        </p>
        <p className="mb-14 max-w-md text-sm leading-relaxed font-light text-white/40">
          A retreat crafted for those who seek refinement in every detail.
        </p>

        <div className="flex items-center gap-6">
          <a
            href="#rooms"
            className="border border-[#d4a954] bg-[#d4a954]/10 px-10 py-3.5 text-sm tracking-[0.25em] text-[#d4a954] uppercase backdrop-blur-sm transition-colors hover:bg-[#d4a954]/20 hover:shadow-[0_0_30px_rgba(212,169,84,0.15)]"
          >
            Explore Rooms
          </a>
          <a
            href="#contact"
            className="px-10 py-3.5 text-sm tracking-[0.25em] text-white/60 uppercase transition-all hover:text-white"
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
        <div className="mb-8 h-px w-16 bg-gradient-to-r from-transparent via-[#d4a954] to-transparent" />
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
      <section
        id="rooms"
        className="relative z-10 flex flex-col items-center py-36 text-center"
      >
        <div className="mb-8 h-px w-16 bg-gradient-to-r from-transparent via-[#d4a954] to-transparent" />
        <p className="mb-4 text-sm tracking-[0.3em] text-[#d4a954]/70 uppercase">
          Accommodations
        </p>
        <h2 className="mb-16 text-3xl font-extralight tracking-wider text-white md:text-4xl">
          Our Rooms
        </h2>

        <div className="grid w-full max-w-5xl gap-10 px-8 md:grid-cols-3">
          {[
            {
              name: 'The Sanctum',
              desc: 'Intimate elegance for the discerning solo traveler. Bathed in golden warmth.',
              price: 'From $320 / night'
            },
            {
              name: 'The Arcadia Suite',
              desc: 'Spacious grandeur with arched windows overlooking the grounds.',
              price: 'From $580 / night'
            },
            {
              name: 'The Elysian Hall',
              desc: 'Our finest — a palatial retreat of unparalleled luxury and privacy.',
              price: 'From $1,200 / night'
            }
          ].map((room) => (
            <div
              key={room.name}
              className="group border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-sm transition-all hover:border-[#d4a954]/30 hover:bg-white/[0.04]"
            >
              <h3 className="mb-4 text-lg font-light tracking-wider text-white transition-colors group-hover:text-[#d4a954]">
                {room.name}
              </h3>
              <p className="mb-6 text-sm leading-relaxed font-light text-white/40">
                {room.desc}
              </p>
              <p className="text-sm tracking-wider text-[#d4a954]/70">
                {room.price}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / CTA */}
      <section
        id="contact"
        className="relative z-10 flex flex-col items-center py-36 text-center"
      >
        <div className="mb-8 h-px w-16 bg-gradient-to-r from-transparent via-[#d4a954] to-transparent" />
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
    </main>
  );
}
