'use client';

import { JSX } from 'react';
import Tilt from 'react-parallax-tilt';
import AnimatedDiv from './motion/AnimatedDiv';
import { fadeIn } from '../features/homepage/utils/variants';
import Image from 'next/image';

interface ServiceCardProps {
  index: number;
  title: string;
  icon: string;
}

const ServiceCard = ({ index, title, icon }: ServiceCardProps): JSX.Element => {
  return (
    <Tilt className="xs:w-[200px] w-full mx-10 md:mx-0">
      <AnimatedDiv
        variants={fadeIn('right', 'spring', 0.4 * index, 0.75)}
        className="w-full green-pink-gradient p-[2px] rounded-3xl shadow-card"
      >
        <div className="bg-tertiary rounded-3xl py-4 px-10 min-h-[200px] flex justify-evenly items-center flex-col">
          <Image src={icon} alt={title} className="w-24 h-24 object-contain" />
          <h3 className="text-white text-[20px] font-medium text-center">
            {title}
          </h3>
        </div>
      </AnimatedDiv>
    </Tilt>
  );
};

export default ServiceCard;
