export type InfiniteScrollTransitionData = {
  slug: string;
  title: string;
  image: string;
  description: string;
  details: {
    sectionImage: string;
    items: InfiniteScrollTransitionItem[];
  };
};

export type InfiniteScrollTransitionItem = {
  label: string;
  date: string;
};
