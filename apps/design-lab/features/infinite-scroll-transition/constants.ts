import { InfiniteScrollTransitionData } from './types';

export const POWER3_OUT_ANIMATION = [0.22, 1, 0.36, 1] as const;

// Clip-path states shared by the NextProject exit and the Hero entrance. The
// bottom reveal is a FIXED pixel height (not a %), so the clipped band is the
// same at every viewport height — the hero and next-project clips line up
// exactly on any screen, including ultrawide.
export const PROJECT_CLIP_HIDDEN = 'inset(0% 0% 200px 0%)';
export const PROJECT_CLIP_VISIBLE = 'inset(0% 0% 0% 0%)';
export const INFINITE_SCROLL_TRANSITION_DATA: InfiniteScrollTransitionData[] = [
  {
    slug: 'arctic-dreams',
    title: 'Arctic Dreams',
    image: '/images/infinite-scroll-transition/arctic-dreams.jpg',
    description: 'Showcases the beauty of the Arctic.',
    details: {
      sectionImage:
        '/images/infinite-scroll-transition/arctic-dreams-section.jpg',
      items: [
        {
          label: 'Dream 1',
          date: 'live'
        },
        {
          label: 'Dream 2',
          date: 'live'
        },
        {
          label: 'Dream 3',
          date: 'incoming'
        },
        {
          label: 'Dream 4',
          date: 'incoming'
        },
        {
          label: 'Dream 5',
          date: 'incoming'
        },
        {
          label: 'Dream 6',
          date: 'live'
        },
        {
          label: 'Dream 7',
          date: 'incoming'
        },
        {
          label: 'Dream 8',
          date: 'live'
        },
        {
          label: 'Dream 9',
          date: 'incoming'
        },
        {
          label: 'Dream 10',
          date: 'incoming'
        },
        {
          label: 'Dream 11',
          date: 'live'
        },
        {
          label: 'Dream 12',
          date: 'incoming'
        },
        {
          label: 'Dream 13',
          date: 'incoming'
        },
        {
          label: 'Dream 14',
          date: 'incoming'
        }
      ]
    }
  },
  {
    slug: 'ocean-surprises',
    title: 'Ocean Surprises',
    image: '/images/infinite-scroll-transition/ocean-surprises.jpg',
    description: 'Beauty of the ocean - unfiltered.',
    details: {
      sectionImage:
        '/images/infinite-scroll-transition/ocean-surprises-section.jpg',
      items: [
        {
          label: 'Surprise 1',
          date: 'live'
        },
        {
          label: 'Surprise 2',
          date: 'live'
        },
        {
          label: 'Surprise 3',
          date: 'incoming'
        },
        {
          label: 'Surprise 4',
          date: 'incoming'
        },
        {
          label: 'Surprise 5',
          date: 'live'
        },
        {
          label: 'Surprise 6',
          date: 'incoming'
        },
        {
          label: 'Surprise 7',
          date: 'incoming'
        },
        {
          label: 'Surprise 8',
          date: 'live'
        },
        {
          label: 'Surprise 9',
          date: 'incoming'
        },
        {
          label: 'Surprise 10',
          date: 'live'
        },
        {
          label: 'Surprise 11',
          date: 'incoming'
        },
        {
          label: 'Surprise 12',
          date: 'live'
        },
        {
          label: 'Surprise 13',
          date: 'incoming'
        },
        {
          label: 'Surprise 14',
          date: 'incoming'
        }
      ]
    }
  },
  {
    slug: 'forest-mysteries',
    title: 'Forest Mysteries',
    image: '/images/infinite-scroll-transition/forest-mysteries.jpg',
    description: 'Mysterious, secretive - simply magical.',
    details: {
      sectionImage:
        '/images/infinite-scroll-transition/forest-mysteries-section.jpg',
      items: [
        {
          label: 'Mystery 1',
          date: 'incoming'
        },
        {
          label: 'Mystery 2',
          date: 'live'
        },
        {
          label: 'Mystery 3',
          date: 'incoming'
        },
        {
          label: 'Mystery 4',
          date: 'incoming'
        },
        {
          label: 'Mystery 5',
          date: 'live'
        },
        {
          label: 'Mystery 6',
          date: 'incoming'
        },
        {
          label: 'Mystery 7',
          date: 'incoming'
        },
        {
          label: 'Mystery 8',
          date: 'incoming'
        },
        {
          label: 'Mystery 9',
          date: 'incoming'
        },
        {
          label: 'Mystery 10',
          date: 'live'
        },
        {
          label: 'Mystery 11',
          date: 'incoming'
        },
        {
          label: 'Mystery 12',
          date: 'incoming'
        },
        {
          label: 'Mystery 13',
          date: 'incoming'
        },
        {
          label: 'Mystery 14',
          date: 'live'
        }
      ]
    }
  }
];
