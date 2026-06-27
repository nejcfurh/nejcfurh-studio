import AnimationTitle from '@/components/AnimationTitle';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';
import TubesCursor from '@/features/tubes-cursor/components/TubesCursor';
import TubesCursorAttribution from '@/features/tubes-cursor/components/TubesCursorAttribution';

export default function TubesCursorPage() {
  return (
    <Background className="overflow-hidden">
      <TubesCursor />

      <BackButton className="top-5 left-5 z-50" />
      <AnimationTitle
        title="Tubes Cursor"
        subtitle="Move your cursor or drag to steer the tubes — tap to recolor."
      />

      <TubesCursorAttribution />
    </Background>
  );
}
