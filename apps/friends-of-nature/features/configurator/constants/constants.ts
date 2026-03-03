import { Product } from '../types/types';
import type { wonderblocksConfigurator } from '../types/types';

// PETAL

export const basePrices = {
  petal: 89,
  wonderblocks: 119,
  wonderblocksWithPetal: 178
};

export const products = [
  {
    id: Product.GardenCamera,
    name: 'Nature Camera',
    description:
      'A nature-inspired camera that captures the moments nature wants you to see.',
    image: '/images/garden-camera.png',
    startsAt: basePrices.petal
  },
  {
    id: Product.Wonderblocks,
    name: 'Wonder Blocks',
    description: 'A modular set for building thriving pollinator habitats.',
    image: '/images/configurator-wonderblocks.png',
    startsAt: basePrices.wonderblocks
  },
  {
    id: Product.WonderblocksWithGardenCamera,
    name: 'Wonder Blocks and Nature Camera',
    description:
      'A modular set for building thriving pollinator habitats, paired with a nature-inspired camera.',
    image: '/images/configurator-combo.png',
    startsAt: basePrices.wonderblocksWithPetal
  }
];

export const petalConfiguratorOptions = [
  {
    id: 'bundleGardenCamera',
    name: 'Bundle',
    options: [
      {
        id: 'starter',
        name: 'Starter',
        description: ['1x Nature Camera', '1x Mounting option'],
        value: 'starter',
        price: basePrices.petal
      },
      {
        id: 'enthusiast',
        name: 'Enthusiast',
        description: ['2x Nature Camera', '2x Mounting option'],
        value: 'enthusiast',
        price: 168
      },
      {
        id: 'hero',
        name: 'Hero',
        description: ['3x Nature Camera', '3x Mounting option'],
        value: 'hero',
        price: 237
      }
    ]
  },
  {
    id: 'fovGardenCamera',
    name: 'Lens',
    options: [
      {
        id: 'macro',
        name: 'Macro',
        description: 'Capture close-ups of pollinators with AI identification',
        price: 0,
        value: 'macro',
        image: '/images/macro-shot.png'
      },
      {
        id: 'wide',
        name: 'Wide',
        description: 'A wider view of the nature in your yard',
        price: 0,
        value: 'wide',
        image: '/images/wide.png'
      },
      {
        id: 'macroAndWide',
        name: 'Macro + Wide',
        description: 'Frame nature your way',
        price: 20,
        value: 'macroAndWide',
        image: '/images/macroWide.png'
      }
    ]
  },
  {
    id: 'recordingMode',
    name: 'Day / Night',
    options: [
      {
        id: 'daytime',
        name: 'Daytime only',
        image: '/images/daytime.png',
        price: 0,
        value: 'daytime'
      },
      {
        id: 'nightVision',
        name: 'Night vision',
        description: 'LED light included',
        image: '/images/night-vision.png',
        price: 20,
        value: 'nightVision'
      }
    ]
  },
  {
    id: 'materialOfPetal',
    name: 'Material',
    options: [
      {
        id: 'bioBased',
        name: 'Bio-based Plastics',
        value: 'bioBased',
        image: '/images/bio-based-plastic.png',
        price: 0
      },
      {
        id: 'oceanPlastic',
        name: 'Recycled Ocean Plastic',
        value: 'oceanPlastic',
        image: '/images/recycled-ocean.png',
        price: 10
      },
      {
        id: 'biodegradable',
        name: 'Biodegradable Material',
        value: 'biodegradable',
        image: '/images/biodegradable.png',
        price: 20
      }
    ]
  },
  {
    id: 'batteryGardenCamera',
    name: 'Battery autonomy',
    options: [
      {
        id: 1,
        name: '1 month',
        price: 0,
        value: 1
      },
      {
        id: 2,
        name: '2 months',
        price: 10,
        value: 2
      },
      {
        id: 'solar',
        name: 'Solar',
        price: 20,
        value: 'solar',
        image: '/images/solarImage.png'
      }
    ]
  }
];

export const gardenCameraAddOns = [
  {
    id: 'flexibleStem',
    name: 'Flexible stem',
    image: '/images/flexibleStem.png'
  },
  {
    id: 'clipGardenCamera',
    name: 'Clip',
    image: '/images/clip.png'
  },
  {
    id: 'hangingMount',
    name: 'Hanging Mount',
    image: '/images/hangingMount.png'
  }
];

// WONDERBLOCKS

export const wonderblocksConfiguratorOptions: wonderblocksConfigurator[] = [
  {
    id: 'bundleWonderblocks',
    name: 'Bundle',
    options: [
      {
        id: 'starter',
        name: 'Starter',
        description: ['1x Wonder Block', '1x Add-on'],
        value: 'starter',
        price: basePrices.wonderblocks
      },
      {
        id: 'enthusiast',
        name: 'Enthusiast',
        description: ['2x Wonder Blocks', '2x Add-ons'],
        value: 'enthusiast',
        price: 218
      },
      {
        id: 'hero',
        name: 'Hero',
        description: ['3x Wonder Blocks', '3x Add-ons'],
        value: 'hero',
        price: 297
      }
    ]
  },
  {
    id: 'typeOfWonderblocks',
    name: 'Smart Connectivity',
    options: [
      {
        id: 'classic',
        name: 'No-Connectivity',
        value: 'classic',
        description: 'Modular planters with no smart features.',
        price: 0
      },
      {
        id: 'smart',
        name: 'Smart Sensors',
        value: 'smart',
        description: 'Tracks humidity & soil pH with a dedicated app.',
        price: 30
      }
    ]
  },
  {
    id: 'materialOfWonderblocks',
    name: 'Material',
    options: [
      {
        id: 'bioBased',
        name: 'Bio-based Plastics',
        value: 'bioBased',
        image: '/images/bio-based-plastic.png',
        price: 0
      },
      {
        id: 'oceanPlastic',
        name: 'Recycled Ocean Plastic',
        value: 'oceanPlastic',
        image: '/images/recycled-ocean.png',
        price: 10
      },
      {
        id: 'biodegradable',
        name: 'Biodegradable Material',
        value: 'biodegradable',
        image: '/images/biodegradable.png',
        price: 20
      }
    ]
  }
];

export const wonderblocksAddOns = [
  {
    id: 'butterflyFeeder',
    name: 'Butterfly Feeder',
    image: '/images/butterflyFeeder.png'
  },
  {
    id: 'beeHotel',
    name: 'Bee Hotel',
    image: '/images/beeHive.png'
  },
  {
    id: 'bugHotel',
    name: 'Bug Hotel',
    image: '/images/bugHotel.png'
  },
  {
    id: 'preSeededPots',
    name: 'Pre-seeded Pots',
    image: '/images/preSeededPots.png'
  }
];
