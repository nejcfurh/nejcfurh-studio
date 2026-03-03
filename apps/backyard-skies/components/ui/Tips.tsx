import { BiChevronLeft } from 'react-icons/bi';
import TipSection from './TipSection';

const Tips = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[url('/menu-bg.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <div className="flex flex-col h-full pt-7.5 px-6">
        <div className="relative flex items-center justify-center mb-6">
          <button
            onClick={handleBack}
            className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center bg-black/8 border border-black/10 text-black text-lg cursor-pointer"
          >
            <BiChevronLeft />
          </button>
          <span className="text-lg font-bold text-black/70 tracking-[0.25em] uppercase">
            Tips & Tricks
          </span>
        </div>

        <div
          style={{ scrollbarWidth: 'none' }}
          className="flex-1 overflow-auto flex flex-col gap-3"
        >
          <TipSection title="Flying" icon="🕊">
            <li>Tap the screen to flap and gain altitude</li>
            <li>
              Tap left side to turn left, right side to turn right, center to go
              straight
            </li>
            <li>Stop flapping to glide and descend</li>
            <li>Hit the ground and a cat catches you — game over!</li>
          </TipSection>

          <TipSection title="Food & Water" icon="🌾">
            <li>Food and water drain as you fly — watch the top gauges</li>
            <li>Land on feeders to eat, birdbaths to drink</li>
            <li>Green glow on screen edge points to nearest feeder</li>
            <li>Blue glow points to nearest birdbath</li>
            <li>If either runs out, your bird goes down!</li>
          </TipSection>

          <TipSection title="Feeding & Drinking" icon="🍽">
            <li>Fly near a feeder or birdbath to land automatically</li>
            <li>Your bird eats or drinks while perched, earning score</li>
            <li>
              A threat meter fills while perched — leave before it maxes out!
            </li>
            <li>Tap the screen to fly away after a short landing delay</li>
          </TipSection>

          <TipSection title="Dangerous Feeders" icon="🐱">
            <li>Some feeders have a cat lurking nearby</li>
            <li>The threat meter fills much faster — react immediately!</li>
            <li>Stay too long and the cat catches you</li>
          </TipSection>

          <TipSection title="Eagle Attacks" icon="🦅">
            <li>Eagles hunt you periodically during flight</li>
            <li>Turn hard (90°) during the dodge window to evade</li>
            <li>Near the altitude limit? Tap rapidly (3 taps) instead</li>
            <li>Dodging an eagle earns bonus points!</li>
          </TipSection>

          <TipSection title="Altitude Limit" icon="⬆">
            <li>Fly too high and an eagle starts hunting you</li>
            <li>You have 4 seconds to descend — stop flapping!</li>
            <li>Drop below the warning level and the eagle backs off</li>
          </TipSection>

          <TipSection title="Scoring" icon="⭐">
            <li>Score increases over time as you fly</li>
            <li>Eating and drinking earns extra points</li>
            <li>Dodging eagles gives a big score bonus</li>
          </TipSection>

          <TipSection title="Bird Species" icon="🐦">
            <li>
              Each bird has different stats — speed, power, stamina and more
            </li>
            <li>Some birds are faster but drain food quicker</li>
            <li>Try all four to find your favourite!</li>
          </TipSection>
        </div>
      </div>
    </div>
  );
};

export default Tips;
