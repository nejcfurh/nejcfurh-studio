import { FaNodeJs, FaReact } from 'react-icons/fa';
import { FaCss3, FaHtml5, FaJs } from 'react-icons/fa6';
import { GrGraphQl } from 'react-icons/gr';
import { IoLogoVercel } from 'react-icons/io5';
import { TbBrandTailwind } from 'react-icons/tb';
import {
  SiExpress,
  SiFramer,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiRedux,
  SiTypescript,
  SiVercel,
} from 'react-icons/si';
import { TechStackItem } from './types';

export const TECH_STACK_DATA: TechStackItem[] = [
  {
    name: 'HTML',
    icon: <FaHtml5 />,
  },
  {
    name: 'CSS',
    icon: <FaCss3 />,
  },
  {
    name: 'JavaScript',
    icon: <FaJs />,
  },
  {
    name: 'TypeScript',
    icon: <SiTypescript />,
  },
  {
    name: 'React',
    icon: <FaReact />,
  },
  {
    name: 'Next.js',
    icon: <IoLogoVercel />,
  },
  {
    name: 'Node.js',
    icon: <FaNodeJs />,
  },
  {
    name: 'Express.js',
    icon: <SiExpress />,
  },
  {
    name: 'MongoDB',
    icon: <SiMongodb />,
  },
  {
    name: 'PostgreSQL',
    icon: <SiPostgresql />,
  },
  { name: 'Redux Toolkit', icon: <SiRedux /> },
  { name: 'Prisma', icon: <SiPrisma /> },
  { name: 'Vercel', icon: <SiVercel /> },
  { name: 'Framer Motion', icon: <SiFramer /> },
  {
    name: 'Tailwind CSS',
    icon: <TbBrandTailwind />,
  },
  {
    name: 'GraphQL',
    icon: <GrGraphQl />,
  },
];
