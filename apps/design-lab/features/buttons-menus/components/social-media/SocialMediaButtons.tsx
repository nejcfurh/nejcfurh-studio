import { SOCIAL_MEDIA_BUTTONS_DATA } from '@/features/buttons-menus/social-media-buttons/constants';
import { SocialMediaButtonsItem } from '@/features/buttons-menus/social-media-buttons/types';
import { AnimatedDiv } from '@repo/ui/animation/core';

import SingleSocialButton from './SingleSocialButton';

const SocialMediaButtons = () => {
  return (
    <AnimatedDiv
      className="my-auto flex h-1/2 w-full scale-100 flex-wrap items-start justify-center gap-6 px-4 sm:scale-200 sm:justify-start sm:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {SOCIAL_MEDIA_BUTTONS_DATA.map((item: SocialMediaButtonsItem) => (
        <SingleSocialButton key={item.name} {...item} />
      ))}
    </AnimatedDiv>
  );
};

export default SocialMediaButtons;
