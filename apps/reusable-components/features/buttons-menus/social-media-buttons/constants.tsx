import { SocialMediaButtonsItem } from './types';
import { TbBrandInstagram } from 'react-icons/tb';
import { BsTwitterX, BsWhatsapp } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { SlSocialLinkedin } from 'react-icons/sl';
import { BsFacebook } from 'react-icons/bs';
import { BsGithub } from 'react-icons/bs';
import { MdOutlineSms } from 'react-icons/md';

export const SOCIAL_MEDIA_BUTTONS_DATA: SocialMediaButtonsItem[] = [
  {
    name: 'Instagram',
    label: 'Instagram',
    icon: <TbBrandInstagram className="size-8 text-white" />,
    className:
      'w-12 h-12 border-none bg-transparent rounded-full outline-2 outline-white cursor-pointer transition-all grid place-items-center hover:outline-offset-3 hover:transition-all duration-300 first:hover:bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]',
    href: 'https://www.instagram.com/nejcfurh/',
  },
  {
    name: 'X/Twitter',
    label: 'X/Twitter',
    icon: <BsTwitterX className="size-6" />,
    className:
      'w-12 h-12 border-none bg-transparent rounded-full text-white outline-2 outline-white cursor-pointer transition-all grid place-items-center hover:outline-offset-3 hover:transition-all duration-300 nth-2:hover:bg-white hover:text-(--x)',
    href: 'https://twitter.com/nejcfurh',
  },
  {
    name: 'Email',
    label: 'Email',
    icon: <HiOutlineMail className="size-8 text-white" />,
    className:
      'w-12 h-12 border-none bg-transparent rounded-full outline-2 outline-white cursor-pointer transition-all grid place-items-center hover:outline-offset-3 hover:transition-all duration-300 nth-3:hover:bg-(--email)',
    href: 'mailto:nejc.furh7@gmail.com',
  },
  {
    name: 'LinkedIn',
    label: 'LinkedIn',
    icon: <SlSocialLinkedin className="size-6 text-white" />,
    className:
      'w-12 h-12 border-none bg-transparent rounded-full outline-2 outline-white cursor-pointer transition-all grid place-items-center hover:outline-offset-3 hover:transition-all duration-300 nth-4:hover:bg-(--linkedin)',
    href: 'https://si.linkedin.com/in/nejcfurh',
  },
  {
    name: 'Facebook',
    label: 'Facebook',
    icon: <BsFacebook className="size-8 text-white" />,
    className:
      'w-12 h-12 border-none bg-transparent rounded-full outline-2 outline-white cursor-pointer transition-all grid place-items-center hover:outline-offset-3 hover:transition-all duration-300 nth-5:hover:bg-(--facebook)',
    href: 'https://www.facebook.com/nejcfurh',
  },
  {
    name: 'GitHub',
    label: 'GitHub',
    icon: <BsGithub className="size-8 text-white" />,
    className:
      'w-12 h-12 border-none bg-transparent rounded-full outline-2 outline-white cursor-pointer transition-all grid place-items-center hover:outline-offset-3 hover:transition-all duration-300 nth-6:hover:bg-(--github)',
    href: 'https://github.com/nejcfurh',
  },
  {
    name: 'WhatsApp',
    label: 'WhatsApp',
    icon: <BsWhatsapp className="size-6 text-white" />,
    className:
      'w-12 h-12 border-none bg-transparent rounded-full outline-2 outline-white cursor-pointer transition-all grid place-items-center hover:outline-offset-3 hover:transition-all duration-300 nth-7:hover:bg-(--whatsapp)',
    href: 'https://wa.me/040127449',
  },
  {
    name: 'SMS',
    label: 'SMS',
    icon: <MdOutlineSms className="size-6 text-white" />,
    className:
      'w-12 h-12 border-none bg-transparent rounded-full outline-2 outline-white cursor-pointer transition-all grid place-items-center hover:outline-offset-3 hover:transition-all duration-300 nth-8:hover:bg-(--sms)',
    href: 'sms:040127449?body=Hello, I would like to discuss a project with you.',
  },
];
