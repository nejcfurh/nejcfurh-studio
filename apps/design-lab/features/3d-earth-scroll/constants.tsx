export type Continent = {
  title: string;
  description: string;
  speed: number;
};

export const CONTINENTS: Continent[] = [
  {
    title: 'Asia',
    description:
      "Earth's largest and most populous continent, stretching from the Arabian Peninsula to the Pacific shores of Japan.",
    speed: 0.5
  },
  {
    title: 'Africa',
    description:
      "The cradle of humankind and the second-largest continent, home to the Sahara — the world's largest hot desert.",
    speed: 0.5
  },
  {
    title: 'Europe',
    description:
      'A compact continent of peninsulas and seas, where ancient history meets the modern world across more than 40 nations.',
    speed: 0.67
  },
  {
    title: 'N. America',
    description:
      'From Arctic tundra to tropical isthmus, defined by the Rockies, the Great Lakes, and seemingly endless plains.',
    speed: 0.8
  },
  {
    title: 'S. America',
    description:
      'Home to the Amazon rainforest and the towering Andes — the lungs and the spine of the southern hemisphere.',
    speed: 0.8
  },
  {
    title: 'Oceania',
    description:
      'A vast realm of islands scattered across the Pacific, anchored by the ancient red heart of Australia.',
    speed: 0.8
  },
  {
    title: 'Antarctica',
    description:
      "The frozen continent at the bottom of the world — a windswept desert of ice holding most of Earth's fresh water.",
    speed: 0.5
  }
];
