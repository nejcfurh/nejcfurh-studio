export enum Product {
  WonderblocksWithGardenCamera = 'Wonder Blocks and Garden Camera',
  GardenCamera = 'Nature Camera',
  Wonderblocks = 'Wonder Blocks'
}

export interface ProductState {
  email: string;
  product?: Product;
  bundleGardenCamera?: 'starter' | 'enthusiast' | 'hero';
  bundleWonderblocks?: 'starter' | 'enthusiast' | 'hero';
  typeOfWonderblocks?: 'classic' | 'smart';
  materialOfWonderblocks?: 'biodegradable' | 'oceanPlastic' | 'bioBased';
  materialOfPetal?: 'biodegradable' | 'oceanPlastic' | 'bioBased';
  fovGardenCamera?: 'macro' | 'wide' | 'macroAndWide';
  recordingMode?: 'daytime' | 'nightVision';
  batteryGardenCamera?: 1 | 2 | 'solar';
  flexibleStem?: boolean;
  clipGardenCamera?: boolean;
  hangingMount?: boolean;
  butterflyFeeder?: boolean;
  beeHotel?: boolean;
  bugHotel?: boolean;
  preSeededPots?: boolean;
  totalPrice?: number;
  currency?: 'USD' | 'EUR' | 'GBP';
  natureCameraOnlyConfigurator?: boolean;
  wonderBlocksOnlyConfigurator?: boolean;
}

export type ProductItem = {
  id: Product;
  name: string;
  description: string | string[];
  image: string;
  startsAt: number;
};

export type petalConfigurator = {
  id: number | string;
  name: string;
  options: Option[];
};

export type Option = {
  id: string | number;
  image?: string;
  name: string;
  price: number;
  description?: string | string[];
  value: number | string | boolean;
};

export type wonderblocksOption = {
  id: string | number;
  name: string;
  price: number;
  description?: string | string[];
  image?: string;
  value: string;
};

export type wonderblocksConfigurator = {
  id: string;
  name: string;
  options: wonderblocksOption[];
};

export interface SelectedItem {
  id: Product;
  name: string;
  description: string | string[];
  image: string;
  startsAt: number;
}
