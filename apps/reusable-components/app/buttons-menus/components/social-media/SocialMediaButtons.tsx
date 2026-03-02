import { SOCIAL_MEDIA_BUTTONS_DATA } from '@/features/buttons-menus/social-media-buttons/constants';
import { SocialMediaButtonsItem } from '@/features/buttons-menus/social-media-buttons/types';
import SingleSocialButton from './SingleSocialButton';
import AnimatedDiv from '@/components/animation-core/AnimatedDiv';

const SocialMediaButtons = () => {
  return (
    <AnimatedDiv className="flex items-start flex-wrap gap-6 my-auto scale-200 w-full h-1/2">
      {SOCIAL_MEDIA_BUTTONS_DATA.map((item: SocialMediaButtonsItem) => (
        <SingleSocialButton key={item.name} {...item} />
      ))}
    </AnimatedDiv>
  );
};

export default SocialMediaButtons;
