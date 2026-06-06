import { MainPageItem } from '@/utils/types';
import { BsInputCursor } from 'react-icons/bs';
import { CiCreditCard2 } from 'react-icons/ci';
import { FaBarsStaggered, FaInstagram } from 'react-icons/fa6';
import { GiCardPlay } from 'react-icons/gi';
import { HiOutlineCursorArrowRipple } from 'react-icons/hi2';
import { IoShareSocialOutline } from 'react-icons/io5';
import {
  MdBlurOn,
  MdFolderCopy,
  MdNoEncryption,
  MdOutlinePermMedia,
  MdOutlineRateReview
} from 'react-icons/md';
import { PiMouseScroll } from 'react-icons/pi';
import { SiSpacex, SiTesla } from 'react-icons/si';
import { SlLayers } from 'react-icons/sl';
import {
  TbCarouselHorizontal,
  TbDragDrop,
  TbRipple,
  TbTransitionBottomFilled
} from 'react-icons/tb';

export const ANIMATIONS_DATA: MainPageItem[] = [
  {
    name: 'Scroll to Decrypt',
    path: '/animations/scroll-to-decrypt',
    icon: <MdNoEncryption />,
    color: 'from-teal-500 to-cyan-500'
  },
  {
    name: 'Scroll to Unblur',
    path: '/animations/scroll-to-unblur',
    icon: <MdBlurOn />,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Transforming Cards',
    path: '/animations/transforming-cards',
    icon: <CiCreditCard2 />,
    color: 'from-green-200 to-emerald-800'
  },
  {
    name: 'Layered Parallax',
    path: '/animations/layered-parallax',
    icon: <SlLayers />,
    color: 'from-gray-500 to-white'
  },
  {
    name: 'Tilt Card',
    path: '/animations/tilt-card',
    icon: <GiCardPlay />,
    color: 'from-gray-900 to-cyan-500'
  },
  {
    name: 'Staggered Animation',
    path: '/animations/staggered-animation',
    icon: <FaBarsStaggered />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Infinite Scroll Carousel',
    path: '/animations/infinite-scroll-carousel',
    icon: <TbCarouselHorizontal />,
    color: 'from-green-500 to-emerald-800'
  },
  {
    name: 'Mask Cursor Effect',
    path: '/animations/mask-cursor-effect',
    icon: <HiOutlineCursorArrowRipple />,
    color: 'from-pink-500 to-cyan-500'
  },
  {
    name: 'Media Slider',
    path: '/animations/media-slider',
    icon: <MdOutlinePermMedia />,
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Smooth Scroll Cards',
    path: '/animations/smooth-scroll-cards',
    icon: <TbTransitionBottomFilled />,
    color: 'from-pink-500 to-emerald-300'
  },
  {
    name: 'Ripple Shader',
    path: '/animations/ripple-shader',
    icon: <TbRipple />,
    color: 'from-cyan-500 to-blue-600'
  }
];

export const COMPONENTS_DATA: MainPageItem[] = [
  {
    name: 'Drag & Drop',
    path: '/components-showcase/drap-drop',
    icon: <TbDragDrop />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'File Upload',
    path: '/components-showcase/file-upload',
    icon: <MdFolderCopy />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Input Fields',
    path: '/components-showcase/input-fields',
    icon: <BsInputCursor />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Buttons & Menus',
    path: '/components-showcase/buttons-menus',
    icon: <IoShareSocialOutline />,
    color: 'from-cyan-500 to-blue-500'
  }
];

export const CLONES_DATA: MainPageItem[] = [
  {
    name: 'Tesla UI Clone',
    path: '/clones/tesla',
    icon: <SiTesla />,
    color: 'from-red-500 to-red-700'
  },
  {
    name: 'Instagram UI Clone',
    path: '/clones/instagram',
    icon: <FaInstagram />,
    color: 'from-purple-500 to-pink-600'
  },
  {
    name: 'Product Landing Page',
    path: '/animations/scroll-animation',
    icon: <PiMouseScroll />,
    color: 'from-pink-500 to-rose-500'
  },
  {
    name: 'SpaceX Showcase',
    path: '/animations/smooth-scroll',
    icon: <SiSpacex />,
    color: 'from-pink-500 to-cyan-500'
  }
];

export const TOOLS_DATA: MainPageItem[] = [
  {
    name: 'Reviews Analyser',
    path: '/tools/reviews-analyser',
    icon: <MdOutlineRateReview />,
    color: 'from-amber-500 to-orange-500'
  }
];
