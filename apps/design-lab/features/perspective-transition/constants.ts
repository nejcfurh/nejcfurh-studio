export type PerspectiveSlide = {
  image: string;
  title: string;
  description: string;
  color: string;
};

export const PERSPECTIVE_SLIDES: PerspectiveSlide[] = [
  {
    image: '/images/perspective-transition/photo1.jpg',
    title: 'Quiraing, Isle of Skye',
    description:
      "Morning mist pours over the green escarpments of Scotland's Trotternish Ridge as the first light breaks through the clouds.",
    color: '#1e3a2f'
  },
  {
    image: '/images/perspective-transition/photo2.jpg',
    title: 'Lake Atitlán, Guatemala',
    description:
      'Volcanoes keep watch over still water while a violet dusk melts into gold behind the highlands.',
    color: '#3a1d5c'
  },
  {
    image: '/images/perspective-transition/photo3.jpg',
    title: 'Bisti Badlands, New Mexico',
    description:
      'The Milky Way arches over ancient sandstone hoodoos beneath one of the darkest skies in America.',
    color: '#141a33'
  }
];
