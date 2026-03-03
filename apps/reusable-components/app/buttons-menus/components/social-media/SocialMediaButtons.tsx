import AnimatedDiv from '@/components/animation-core/AnimatedDiv';
import { SOCIAL_MEDIA_BUTTONS_DATA } from '@/features/buttons-menus/social-media-buttons/constants';
import { SocialMediaButtonsItem } from '@/features/buttons-menus/social-media-buttons/types';

import SingleSocialButton from './SingleSocialButton';

const SocialMediaButtons = () => {
  return (
    <AnimatedDiv className="my-auto flex h-1/2 w-full scale-200 flex-wrap items-start gap-6">
      {SOCIAL_MEDIA_BUTTONS_DATA.map((item: SocialMediaButtonsItem) => (
        <SingleSocialButton key={item.name} {...item} />
      ))}
    </AnimatedDiv>
  );
};

export default SocialMediaButtons;
