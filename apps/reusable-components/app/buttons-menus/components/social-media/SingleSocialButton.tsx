import Link from 'next/link';
import { SocialMediaButtonsItem } from '@/features/buttons-menus/social-media-buttons/types';

const SingleSocialButton = ({
  name,
  label,
  icon,
  className,
  href,
}: SocialMediaButtonsItem) => {
  return (
    <Link
      target="_blank"
      key={name}
      rel="noopener noreferrer"
      aria-label={label}
      href={href}
      className={className}
    >
      {icon}
    </Link>
  );
};

export default SingleSocialButton;
