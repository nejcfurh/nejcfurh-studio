import { CardDataType } from './types';

export const CARD_DATA: CardDataType[] = [
  {
    name: 'Design Lab',
    description:
      'A showcase of multiple pages, interactive UI components featuring 3D effects, scroll-driven animations, drag & drop, parallax, and holographic tilt cards — built as a living reusable design system.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Three.js', color: '' },
      { name: 'Motion', color: '' },
      { name: 'Tailwind', color: '' }
    ],
    image: '/images/smooth-scroll-cards/design-lab.jpg',
    source_code_link: 'https://github.com/nejcfurh/nejcfurh-studio',
    link: 'https://design-lab-nf.vercel.app'
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
      { name: 'NextAuth', color: '' }
    ],
    image: '/images/smooth-scroll-cards/twabblr.jpg',
    source_code_link: 'https://github.com/nejcfurh/nejcfurh-studio',
    link: 'https://twabblr.vercel.app/'
  },
  {
    name: 'Backyard Skies',
    description:
      'Mobile-only 3D survival game with bird flight mechanics, feeder placement, threat systems, and procedural terrain — built entirely in the browser with Three.js.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Three.js', color: '' },
      { name: 'R3F', color: '' },
      { name: 'Zustand', color: '' }
    ],
    image: '/images/smooth-scroll-cards/backyard-skies.jpg',
    source_code_link: 'https://github.com/nejcfurh/nejcfurh-studio',
    link: 'https://backyard-skies.vercel.app/'
  },
  {
    name: 'N-Drive',
    description:
      'Cloud storage and secure file sharing platform with real-time sync, file organization, and team collaboration — backed by Convex for instant database updates.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Convex', color: '' },
      { name: 'Clerk', color: '' },
      { name: 'shadcn/ui', color: '' }
    ],
    image: '/images/smooth-scroll-cards/n-drive.jpg',
    source_code_link: 'https://github.com/nejcfurh/nejcfurh-studio',
    link: 'https://n-drive.vercel.app/'
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
      { name: 'Vercel', color: '' }
    ],
    image: '/images/smooth-scroll-cards/bb-wiki.jpg',
    source_code_link: '',
    link: 'https://app.mybirdbuddy.com/bb-wiki'
  },
  {
    name: 'Birdbuddy WIKI CMS',
    description:
      'Content management system powering BB Wiki — enabling non-technical team members to create, edit, and publish documentation with a visual editor.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Tailwind', color: '' },
      { name: 'PayloadCMS', color: '' },
      { name: 'supabase', color: '' }
    ],
    image: '/images/smooth-scroll-cards/bb-wiki-cms.jpg',
    source_code_link: '',
    link: ''
  },
  {
    name: 'Birdbuddy Year in Birds',
    description:
      'Birdbuddy Year in Birds is a spinoff of Spotify Wrapped, but for birds. Link leads to a global overview, preview opens a personalized Year in Birds that each Birdbuddy user received.',
    tags: [
      { name: 'Next.js', color: '' },
      { name: 'Tailwind', color: '' },
      { name: 'GraphQL', color: '' },
      { name: 'Motion', color: '' }
    ],
    image: '/images/smooth-scroll-cards/year-in-birds.jpg',
    source_code_link: '',
    link: 'https://year-in-review.mybirdbuddy.com',
    has_preview: true
  }
];
