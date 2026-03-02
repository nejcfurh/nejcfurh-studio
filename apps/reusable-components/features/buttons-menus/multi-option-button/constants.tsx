import { FaPlus } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { MenuItem } from './types';
import { FaEnvelope } from 'react-icons/fa';
import { FaCog } from 'react-icons/fa';
import { FaEllipsisH } from 'react-icons/fa';
import { FaChartBar } from 'react-icons/fa';

export const MULTI_OPTION_BUTTONS_DATA: MenuItem[] = [
  {
    icon: <FaChartBar />,
    label: 'Charts',
    onClick: () => console.log('Charts clicked'),
  },
  { icon: <FaPlus />, label: 'Add', onClick: () => console.log('Add clicked') },
  {
    icon: <FaHeart />,
    label: 'Favorites',
    onClick: () => console.log('Favorites clicked'),
  },
  {
    icon: <FaEnvelope />,
    label: 'Messages',
    onClick: () => console.log('Messages clicked'),
  },
  {
    icon: <FaCog />,
    label: 'Settings',
    onClick: () => console.log('Settings clicked'),
  },
  {
    icon: <FaEllipsisH />,
    label: 'More',
    onClick: () => console.log('More clicked'),
  },
];
