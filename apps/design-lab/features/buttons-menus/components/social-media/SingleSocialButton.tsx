import { SocialMediaButtonsItem } from '@/features/buttons-menus/social-media-buttons/types';
import { motion } from '@repo/ui/animation';

const SingleSocialButton = ({
  name,
  label,
  icon,
  className,
  href
}: SocialMediaButtonsItem) => {
  return (
    <motion.a
      key={name}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {icon}
    </motion.a>
  );
};

export default SingleSocialButton;
