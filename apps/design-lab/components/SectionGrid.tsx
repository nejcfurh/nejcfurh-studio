import { MainPageItem } from '@/utils/types';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { ReactNode } from 'react';

import CustomLinkButton from './buttons/CustomLinkButton';

const SectionGrid = ({ items }: { items: MainPageItem[] }): ReactNode => {
  return (
    <AnimatedDiv className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item: MainPageItem) => (
        <CustomLinkButton
          key={item.path}
          name={item.name}
          path={item.path}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </AnimatedDiv>
  );
};

export default SectionGrid;
