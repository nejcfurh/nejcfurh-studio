import BackButton from '@/components/buttons/BackButton';
import TeslaLogo from '@/features/clones/tesla/components/TeslaLogo';
import TeslaNav from '@/features/clones/tesla/components/TeslaNav';
import TeslaSection from '@/features/clones/tesla/components/TeslaSection';
import { TESLA_SECTIONS } from '@/features/clones/tesla/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tesla Clone | Design Lab',
  description: 'Tesla Clone page with Tailwind CSS.'
};

export default function TeslaClonePage() {
  return (
    <div
      className="bg-white text-black"
      style={{
        fontFamily: 'Gotham Book, sans-serif',
        scrollBehavior: 'smooth'
      }}
    >
      <BackButton className="z-20 mt-10" />

      {/* First section with header */}
      <TeslaSection {...TESLA_SECTIONS[0]} nextSectionId={TESLA_SECTIONS[1].id}>
        {/* Sticky-style header overlaid on first section */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-5 font-bold sm:px-6">
          <div>
            <TeslaLogo />
          </div>
          <div className="hidden lg:inline">
            <TeslaNav />
          </div>
          <div>
            <ul className="flex space-x-1 text-xs sm:space-x-4 sm:text-sm">
              {['Shop', 'Account', 'Menu'].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer rounded-full px-3 py-1 uppercase transition-opacity duration-300 hover:opacity-60"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </TeslaSection>

      {/* Remaining sections */}
      {TESLA_SECTIONS.slice(1).map((section, i) => (
        <TeslaSection
          key={section.id}
          {...section}
          nextSectionId={TESLA_SECTIONS[i + 2]?.id}
        />
      ))}

      {/* Footer */}
      <footer className="w-full py-8">
        <ul className="flex flex-col items-center justify-center gap-2 text-[12px] text-gray-500 md:flex-row md:gap-4">
          <li>Tesla &copy; 2026</li>
          <li>Privacy &amp; Legal</li>
          <li>Contact</li>
          <li>Careers</li>
          <li>News</li>
          <li className="hidden md:inline">Engage</li>
          <li className="hidden md:inline">Location</li>
        </ul>
      </footer>
    </div>
  );
}
