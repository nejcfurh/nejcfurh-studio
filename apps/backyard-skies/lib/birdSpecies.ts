import { BirdSpecies } from '@/types';

export const BIRD_SPECIES: Record<string, BirdSpecies> = {
  cardinal: {
    id: 'cardinal',
    name: 'Northern Cardinal',
    scientificName: 'Cardinalis cardinalis',
    description:
      'A robust songbird with a distinctive crest. Balanced stats make it ideal for beginners.',
    attributes: {
      speed: 7,
      flapPower: 1.0,
      stamina: 80,
      maxFood: 85,
      maxWater: 75,
      feedRate: 10,
      drinkRate: 8,
      foodDrain: 2.0,
      waterDrain: 1.5,
    },
    colors: {
      body: '#C41E3A',
      wing: '#A01830',
      head: '#C41E3A',
      belly: '#D4474E',
      beak: '#FF8C00',
      eye: '#1A1A1A',
      tail: '#8B1525',
      accent: '#000000', // black face mask
    },
    bodyScale: [1.0, 0.9, 1.2],
    wingSpan: 1.3,
    hasCrest: true,
  },

  tanager: {
    id: 'tanager',
    name: 'Scarlet Tanager',
    scientificName: 'Piranga olivacea',
    description:
      'A blazing scarlet flyer with jet-black wings. Fast but burns energy quickly.',
    attributes: {
      speed: 9,
      flapPower: 1.2,
      stamina: 65,
      maxFood: 70,
      maxWater: 65,
      feedRate: 8,
      drinkRate: 7,
      foodDrain: 2.8,
      waterDrain: 2.0,
    },
    colors: {
      body: '#FF2400',
      wing: '#1A1A1A',
      head: '#FF2400',
      belly: '#FF4433',
      beak: '#E8D44D',
      eye: '#1A1A1A',
      tail: '#1A1A1A',
    },
    bodyScale: [0.9, 0.85, 1.25],
    wingSpan: 1.2,
    hasCrest: false,
  },

  bunting: {
    id: 'bunting',
    name: 'Indigo Bunting',
    scientificName: 'Passerina cyanea',
    description:
      'A tiny electric-blue gem. Agile with great stamina, but limited food capacity.',
    attributes: {
      speed: 8,
      flapPower: 1.1,
      stamina: 90,
      maxFood: 60,
      maxWater: 60,
      feedRate: 12,
      drinkRate: 10,
      foodDrain: 1.5,
      waterDrain: 1.2,
    },
    colors: {
      body: '#00416A',
      wing: '#003058',
      head: '#0052A5',
      belly: '#1A6DB5',
      beak: '#8C8C8C',
      eye: '#1A1A1A',
      tail: '#002E4F',
    },
    bodyScale: [0.75, 0.7, 1.0],
    wingSpan: 1.0,
    hasCrest: false,
  },

  starling: {
    id: 'starling',
    name: 'Common Starling',
    scientificName: 'Sturnus vulgaris',
    description:
      'A stocky, iridescent powerhouse. Slow but can store the most food and water.',
    attributes: {
      speed: 6,
      flapPower: 0.9,
      stamina: 100,
      maxFood: 100,
      maxWater: 100,
      feedRate: 7,
      drinkRate: 6,
      foodDrain: 1.8,
      waterDrain: 1.3,
    },
    colors: {
      body: '#2A2A35',
      wing: '#1E1E28',
      head: '#2D2D3A',
      belly: '#353545',
      beak: '#FFD700',
      eye: '#1A1A1A',
      tail: '#1A1A2E',
      accent: '#4A7C59', // iridescent green spots
    },
    bodyScale: [1.1, 1.0, 1.15],
    wingSpan: 1.4,
    hasCrest: false,
  },
};

export const SPECIES_LIST = Object.values(BIRD_SPECIES);
export const SPECIES_IDS = Object.keys(BIRD_SPECIES) as Array<
  keyof typeof BIRD_SPECIES
>;
