'use client';

import { MULTI_OPTION_BUTTONS_DATA } from '@/features/buttons-menus/multi-option-button/constants';
import {
  MenuItem,
  MenuVariant
} from '@/features/buttons-menus/multi-option-button/types';
import { useState } from 'react';

import Footer from './Footer';
import MenuButton from './MenuButton';
import OptionButton from './OptionButton';
import SVGFilters from './SVGFilters';

export interface MultiOptionButtonsProps {
  items?: MenuItem[];
  variant?: MenuVariant;
}

const MultiOptionButtons: React.FC<MultiOptionButtonsProps> = ({
  items = MULTI_OPTION_BUTTONS_DATA,
  variant = 'circular'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={`menu mb-80 menu-${variant} ${isOpen ? 'menu-open-state' : ''}`}
      >
        <MenuButton handleToggle={handleToggle} isOpen={isOpen} />
        {items.map((item, index) => (
          <OptionButton
            key={index}
            item={item}
            index={index}
            handleItemClick={handleItemClick}
          />
        ))}
      </nav>

      {/* SVG Filters */}
      <SVGFilters />
      <Footer />
    </>
  );
};

export default MultiOptionButtons;
