import Image, { StaticImageData } from 'next/image';
import { JSX } from 'react';
import { fadeIn } from '../features/homepage/utils/variants';
import AnimatedDiv from './motion/AnimatedDiv';
import { github } from '@/public';
import Link from 'next/link';

interface ProjectCardProps {
  index: number;
  name: string;
  description: string;
  tags: { name: string; color: string }[];
  image: string | StaticImageData;
  source_code_link: string;
  link: string;
}

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  link,
}: ProjectCardProps): JSX.Element => {
  return (
    <AnimatedDiv variants={fadeIn('left', 'spring', index * 0.5, 0.75)}>
      <div className="relative w-full h-[220px]">
        <Image
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
          <Link
            href={link}
            target="_blank"
            className="black-gradient w-10 h-10 mr-auto rounded-full flex justify-center items-center cursor-pointer"
          >
            <Image
              src={github}
              alt="github"
              className="w-1/2 h-1/2 object-contain"
            />
          </Link>
          <Link
            href={source_code_link}
            target="_blank"
            className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
          >
            <Image
              src={github}
              alt="github"
              className="w-1/2 h-1/2 object-contain"
            />
          </Link>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-white font-medium text-[24px]">{name}</h3>
        <p className="mt-2 text-secondary font-light text-[14px]">
          {description}
        </p>
      </div>
      <div className="mt-4 flex flex-warp gap-2">
        {tags.map(
          (tag: { name: string; color: string }): JSX.Element => (
            <p key={tag.name} className={`text-[15px] ${tag.color}`}>
              #{tag.name}
            </p>
          )
        )}
      </div>
    </AnimatedDiv>
  );
};

export default ProjectCard;
