import { IMG_PADDING } from '@/features/scroll-animation/constants';

import OverlayCopy from './OverlayCopy';
import StickyImage from './StickyImage';

interface TextParallaxContentProps {
  imgUrl: string;
  subheading: string;
  heading: string;
  children?: React.ReactNode;
}

const TextParallaxContent = ({
  imgUrl,
  subheading,
  heading,
  children
}: TextParallaxContentProps) => {
  return (
    <div style={{ paddingLeft: IMG_PADDING, paddingRight: IMG_PADDING }}>
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy subheading={subheading} heading={heading} />
      </div>
      {children}
    </div>
  );
};

export default TextParallaxContent;
