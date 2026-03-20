import BackButton from '@/components/buttons/BackButton';
import ChevronDown from '@/features/clones/tesla/components/ChevronDown';
import TeslaLogo from '@/features/clones/tesla/components/TeslaLogo';
import { TESLA_SECTIONS } from '@/features/clones/tesla/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tesla Clone',
  description: 'Tesla Clone'
};

export default function TeslaClonePage() {
  return (
    <div
      className="bg-white text-black"
      style={{ fontFamily: 'Gotham Book, sans-serif' }}
    >
      <BackButton className="z-20 mt-10" />

      {/* First section includes the header */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('${TESLA_SECTIONS[0].bg}')` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pt-5 font-bold">
          <div className="ml-8">
            <TeslaLogo />
          </div>
          <div className="hidden lg:inline">
            <ul className="flex space-x-2 text-sm">
              {[
                'Model Y',
                'Model 3',
                'Model X',
                'Model S',
                'Solar Roof',
                'Solar Panels',
                'Accesories'
              ].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer rounded-full px-3 py-1 hover:bg-slate-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="mr-2 flex space-x-4 text-sm">
              {['Shop', 'Account', 'Menu'].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer rounded-full px-3 py-1 hover:bg-slate-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="absolute top-20 left-1/2 flex -translate-x-1/2 flex-col">
          <h1 className="m-auto mt-8 text-[40px] font-bold">
            {TESLA_SECTIONS[0].title}
          </h1>
          <p className="pt-1 text-center text-[16px] whitespace-nowrap text-[#5c5d61]">
            Order online for{' '}
            <span className="cursor-pointer underline underline-offset-4 hover:decoration-2">
              {TESLA_SECTIONS[0].subtitle}
            </span>
          </p>
        </div>
        <div className="absolute bottom-[80px] left-1/2 flex -translate-x-1/2 flex-col md:flex-row md:space-x-4">
          <button className="h-10 w-96 rounded-full bg-gray-800 text-white uppercase md:w-60">
            {TESLA_SECTIONS[0].buttons[0]}
          </button>
          <button className="mt-2 h-10 w-96 rounded-full bg-slate-200 text-gray-900 uppercase md:mt-0 md:w-60">
            {TESLA_SECTIONS[0].buttons[1]}
          </button>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <ChevronDown />
        </div>
      </div>

      {/* Remaining sections */}
      {TESLA_SECTIONS.slice(1).map((section) => (
        <div
          key={section.title}
          className="relative h-screen bg-cover bg-center"
          style={{ backgroundImage: `url('${section.bg}')` }}
        >
          <div className="absolute top-20 left-1/2 flex -translate-x-1/2 flex-col">
            <h1 className="m-auto mt-8 text-[40px] font-bold text-white">
              {section.title}
            </h1>
            {section.subtitle && (
              <p className="pt-1 text-center text-[16px] whitespace-nowrap text-white">
                Order online for{' '}
                <span className="cursor-pointer underline underline-offset-4 hover:decoration-2">
                  {section.subtitle}
                </span>
              </p>
            )}
          </div>
          <div className="absolute bottom-[80px] left-1/2 flex -translate-x-1/2 flex-col md:flex-row md:space-x-4">
            <button className="h-10 w-96 rounded-full bg-gray-800 text-white uppercase md:w-60">
              {section.buttons[0]}
            </button>
            {section.buttons[1] && (
              <button className="mt-2 h-10 w-96 rounded-full bg-slate-200 text-gray-900 uppercase md:mt-0 md:w-60">
                {section.buttons[1]}
              </button>
            )}
          </div>
          {section.showArrow && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <ChevronDown />
            </div>
          )}
        </div>
      ))}

      {/* Footer */}
      <footer className="flex items-center justify-center pb-10">
        <ul className="flex flex-col items-center justify-center text-[12px] text-gray-500 md:flex-row md:space-x-4">
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
