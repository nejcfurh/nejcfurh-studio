export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export type MenuVariant = 'circular' | 'horizontal';
