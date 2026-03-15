import {
  advisera,
  birdbuddy,
  blogdev,
  css,
  docker,
  figma,
  friendsOfNature,
  git,
  hoteladminpanel,
  html,
  javascript,
  mongodb,
  mzez,
  nextjs,
  nodejs,
  petal,
  reactjs,
  redux,
  tailwind,
  threejs,
  todocards,
  typescript,
} from '@/public';

export const navLinks = [
  {
    id: 'about',
    title: 'About',
  },
  {
    id: 'experience',
    title: 'Experience',
  },
  {
    id: 'projects',
    title: 'Projects',
  },
  {
    id: 'contact',
    title: 'Get in Touch',
  },
];

const services = [
  {
    title: 'Tailwind/CSS',
    icon: tailwind,
  },
  {
    title: 'React',
    icon: reactjs,
  },
  {
    title: 'Next.JS',
    icon: nextjs,
  },
  {
    title: 'Node.JS',
    icon: nodejs,
  },
  {
    title: 'Typescript',
    icon: typescript,
  },
];

const technologies = [
  {
    name: 'HTML 5',
    icon: html,
  },
  {
    name: 'CSS 3',
    icon: css,
  },
  {
    name: 'JavaScript',
    icon: javascript,
  },
  {
    name: 'TypeScript',
    icon: typescript,
  },
  {
    name: 'React JS',
    icon: reactjs,
  },
  {
    name: 'Redux Toolkit',
    icon: redux,
  },
  {
    name: 'Tailwind CSS',
    icon: tailwind,
  },
  {
    name: 'Node JS',
    icon: nodejs,
  },
  {
    name: 'MongoDB',
    icon: mongodb,
  },
  {
    name: 'Three JS',
    icon: threejs,
  },
  {
    name: 'git',
    icon: git,
  },
  {
    name: 'figma',
    icon: figma,
  },
  {
    name: 'docker',
    icon: docker,
  },
];

const experiences = [
  {
    title: 'Expert Advisor & Diplomat',
    company_name: 'Ministry of Foreign and European Affairs - Slovenia',
    icon: mzez,
    iconBg: '#E6DEDD',
    date: 'December 2019 - April 2022',
    points: [
      'Analyzed political and economic policies to shape public relations strategies for international delegations',
      'Coordinated cross-functional teams to organize official state visits and diplomatic delegation programs',
      "Co-led the Youth Forum for Eastern Partnership during Slovenia's EU Council Presidency in 2021",
    ],
  },
  {
    title: 'IT Consultant & Support Specialist',
    company_name: 'Advisera / Conformio - Croatia',
    icon: advisera,
    iconBg: '#E6DEDD',
    date: 'June 2022 - December 2022',
    points: [
      'Managed Conformio platform administration and triaged support issues for the engineering team',
      'Bridged communication between customers and developers to accelerate issue resolution',
      'Worked daily with ZenDesk, JIRA, and Slack to streamline support workflows and deployment tracking',
    ],
  },
  {
    title: 'Web / Software Developer',
    company_name: 'Self-employed / Freelance',
    icon: reactjs,
    iconBg: '#E6DEDD',
    date: 'October 2022 - Present',
    points: [
      'Built and shipped full-stack web applications using React, Next.js, Node.js, and TypeScript',
      'Designed responsive, cross-browser UIs with Tailwind CSS and modern component architectures',
      'Integrated databases (MongoDB, PostgreSQL, Supabase) and third-party APIs for production-ready apps',
    ],
  },
  {
    title: '3rd Level / Tech Support',
    company_name: 'Birdbuddy Inc. - Slovenia & US',
    icon: birdbuddy,
    iconBg: '#E6DEDD',
    date: 'December 2022 - January 2024',
    points: [
      'Served as the final escalation point for complex hardware and software issues across BirdBuddy products',
      'Partnered with designers, PMs, and engineers to diagnose root causes and improve product reliability',
      'Synthesized recurring customer feedback into actionable reports that drove product improvements',
    ],
  },
  {
    title: 'Head of Customer Engagement',
    company_name: 'Birdbuddy Inc. - Slovenia & US',
    icon: birdbuddy,
    iconBg: '#E6DEDD',
    date: 'February 2024 - October 2024',
    points: [
      'Led customer experience strategy, building a community of engaged users and brand champions',
      'Established quality assurance processes that reduced support volume and strengthened brand reputation',
      'Drove proactive customer interactions that improved NPS and public perception across channels',
    ],
  },
  {
    title: 'Product Engineer',
    company_name: 'Birdbuddy Inc. - Slovenia & US',
    icon: birdbuddy,
    iconBg: '#E6DEDD',
    date: 'October 2024 - Present',
    points: [
      'Building performant, accessible interfaces with React, Next.js, and GraphQL for a growing user base',
      'Shipping features end-to-end — from design collaboration through implementation to production monitoring',
      'Championing frontend best practices including component architecture, testing, and performance optimization',
    ],
  },
];

const testimonials = [
  {
    testimonial:
      'I thought it was impossible to make a website as beautiful as our product, but Nejc proved me wrong.',
    name: 'Sara Lee',
    designation: 'CFO',
    company: 'Acme Co',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Nejc does.",
    name: 'Chris Brown',
    designation: 'COO',
    company: 'DEF Corp',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    testimonial:
      "After Nejc optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: 'Lisa Wang',
    designation: 'CTO',
    company: '456 Enterprises',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
];

const projects = [
  {
    name: 'Reusable Components',
    description:
      'A showcase of 12+ interactive UI components featuring 3D effects, scroll-driven animations, drag & drop, parallax, and holographic tilt cards — built as a living design system.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Three.js', color: '' },
      { name: 'Framer Motion', color: '' },
      { name: 'Tailwind', color: '' },
    ],
    image: '/images/projects/reusable-components.png',
    source_code_link: 'https://github.com/NF-7/nejcfurh-studio',
    link: 'https://reusable-components-nf.vercel.app/',
  },
  {
    name: 'Twabblr',
    description:
      'Real-time messenger clone with direct and group conversations, read receipts, image sharing, and online status — powered by Pusher for instant updates.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Prisma', color: '' },
      { name: 'MongoDB', color: '' },
      { name: 'Pusher', color: '' },
      { name: 'NextAuth', color: '' },
    ],
    image: '/images/projects/twabblr.png',
    source_code_link: 'https://github.com/NF-7/nejcfurh-studio',
    link: 'https://twabblr.vercel.app/',
  },
  {
    name: 'Backyard Skies',
    description:
      'Mobile-only 3D survival game with bird flight mechanics, feeder placement, threat systems, and procedural terrain — built entirely in the browser with Three.js.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Three.js', color: '' },
      { name: 'R3F', color: '' },
      { name: 'Zustand', color: '' },
    ],
    image: '/images/projects/backyard-skies.png',
    source_code_link: 'https://github.com/NF-7/nejcfurh-studio',
    link: 'https://backyard-skies.vercel.app/',
  },
  {
    name: 'N-Drive',
    description:
      'Cloud storage and secure file sharing platform with real-time sync, file organization, and team collaboration — backed by Convex for instant database updates.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Convex', color: '' },
      { name: 'Clerk', color: '' },
      { name: 'shadcn/ui', color: '' },
    ],
    image: '/images/projects/n-drive.png',
    source_code_link: 'https://github.com/NF-7/nejcfurh-studio',
    link: 'https://n-drive.vercel.app/',
  },
  {
    name: 'Birdbuddy WIKI',
    description:
      'A public bird encyclopedia featuring over 10,000 species with detailed profiles, images, and habitat information — a Wikipedia for birds, built for the Birdbuddy community.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Tailwind', color: '' },
      { name: 'Supabase', color: '' },
      { name: 'shadcn/ui', color: '' },
      { name: 'GraphQL', color: '' },
      { name: 'Vercel', color: '' },
    ],
    image: '/images/projects/bb-wiki.png',
    source_code_link: '',
    link: 'https://app.mybirdbuddy.com/bb-wiki',
  },
  {
    name: 'Birdbuddy WIKI CMS',
    description:
      'Content management system powering Birdbuddy WIKI — enabling non-technical team members to create, edit, and publish documentation with a visual editor.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Tailwind', color: '' },
      { name: 'PayloadCMS', color: '' },
      { name: 'supabase', color: '' },
    ],
    image: '/images/projects/bbwiki-cms.png',
    source_code_link: '',
    link: '',
  },
  {
    name: 'Friends of Nature',
    description:
      'Conservation initiative website with full-screen animations, parallax effects, stacked cards, interactive carousels, and page visit analytics.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Framer Motion', color: '' },
      { name: 'Tailwind', color: '' },
    ],
    image: friendsOfNature,
    source_code_link: 'https://github.com/NF-7/nejcfurh-studio',
    link: 'https://friends-of-nature.vercel.app/',
  },
  {
    name: 'Experience Wonder',
    description:
      'A collection of marketing and product pages for a fast-growing startup aiming for a Kickstarter launch — showcasing design and development skills.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Stripe', color: '' },
      { name: 'Firebase', color: '' },
      { name: 'Tailwind', color: '' },
    ],
    image: petal,
    source_code_link: 'https://github.com/NF-7/nejcfurh-studio',
    link: '',
  },
  {
    name: 'ToDoCards',
    description:
      'Card-based task manager with multiple OAuth providers (Google, Facebook, GitHub, X), custom lists, image uploads via Supabase, and a polished UI.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'MongoDB', color: '' },
      { name: 'NextAuth', color: '' },
      { name: 'Supabase', color: '' },
    ],
    image: todocards,
    source_code_link: 'https://github.com/NF-7/nejcfurh-studio',
    link: 'https://to-do-cards.vercel.app/',
  },
  {
    name: 'Elysantium',
    description:
      'Luxury hotel website with an integrated admin panel featuring dashboard charts, booking management, cabin CRUD, guest records, and dark mode.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Supabase', color: '' },
      { name: 'TanStack Query', color: '' },
      { name: 'Recharts', color: '' },
    ],
    image: hoteladminpanel,
    source_code_link: 'https://github.com/NF-7/nejcfurh-studio',
    link: 'https://hotel-admin-panel-xi.vercel.app',
  },
  {
    name: 'Blog.dev',
    description:
      'Personal development blog platform with admin authentication, CRUD operations, MongoDB persistence, and posts sorted by date with image support.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'MongoDB', color: '' },
      { name: 'NextAuth', color: '' },
    ],
    image: blogdev,
    source_code_link: 'https://github.com/NF-7/nejcfurh-studio',
    link: 'https://blog-dev-nf.vercel.app/',
  },
];

export { services, technologies, experiences, testimonials, projects };
