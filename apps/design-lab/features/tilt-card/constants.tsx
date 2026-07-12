import { FaNodeJs, FaReact } from '@repo/ui/icons/react-icons/fa';
import { FaCss3, FaHtml5, FaJs } from '@repo/ui/icons/react-icons/fa6';
import { GrGraphQl } from '@repo/ui/icons/react-icons/gr';
import { IoLogoVercel } from '@repo/ui/icons/react-icons/io5';
import {
  SiExpress,
  SiFramer,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiRedux,
  SiTypescript,
  SiVercel
} from '@repo/ui/icons/react-icons/si';
import { TbBrandTailwind } from '@repo/ui/icons/react-icons/tb';

import { TechStackItem } from './types';

export const TECH_STACK_DATA: TechStackItem[] = [
  {
    name: 'HTML',
    icon: <FaHtml5 />
  },
  {
    name: 'CSS',
    icon: <FaCss3 />
  },
  {
    name: 'JavaScript',
    icon: <FaJs />
  },
  {
    name: 'TypeScript',
    icon: <SiTypescript />
  },
  {
    name: 'React',
    icon: <FaReact />
  },
  {
    name: 'Next.js',
    icon: <IoLogoVercel />
  },
  {
    name: 'Node.js',
    icon: <FaNodeJs />
  },
  {
    name: 'Express.js',
    icon: <SiExpress />
  },
  {
    name: 'MongoDB',
    icon: <SiMongodb />
  },
  {
    name: 'PostgreSQL',
    icon: <SiPostgresql />
  },
  { name: 'Redux Toolkit', icon: <SiRedux /> },
  { name: 'Prisma', icon: <SiPrisma /> },
  { name: 'Vercel', icon: <SiVercel /> },
  { name: 'Framer Motion', icon: <SiFramer /> },
  {
    name: 'Tailwind CSS',
    icon: <TbBrandTailwind />
  },
  {
    name: 'GraphQL',
    icon: <GrGraphQl />
  }
];
