import type { ProductState } from '../types/types';

export const calculateTotalPricePetal = (
  config: ProductState,
  isBundle?: boolean
): number => {
  let basePrice = 0;

  switch (config.bundleGardenCamera) {
    case 'starter':
      basePrice = 89;
      break;
    case 'enthusiast':
      basePrice = 168;
      break;
    case 'hero':
      basePrice = 237;
      break;
    default:
      basePrice = 89;
  }

  if (isBundle) {
    switch (config.bundleGardenCamera) {
      case 'starter':
        basePrice -= 10;
        break;
      case 'enthusiast':
        basePrice -= 20;
        break;
      case 'hero':
        basePrice -= 30;
        break;
      default:
        basePrice -= 10;
    }
  }

  let lensCost = 0;

  if (config.fovGardenCamera === 'macroAndWide') {
    switch (config.bundleGardenCamera) {
      case 'starter':
        lensCost = 20;
        break;
      case 'enthusiast':
        lensCost = 40;
        break;
      case 'hero':
        lensCost = 50;
        break;
      default:
        lensCost = 0;
    }
  }

  let materialCost = 0;

  if (config.materialOfPetal && config.bundleGardenCamera) {
    switch (config.materialOfPetal) {
      case 'biodegradable':
        if (config.bundleGardenCamera === 'starter') materialCost = 20;
        else if (config.bundleGardenCamera === 'enthusiast') materialCost = 40;
        else if (config.bundleGardenCamera === 'hero') materialCost = 50;
        break;
      case 'oceanPlastic':
        if (config.bundleGardenCamera === 'starter') materialCost = 10;
        else if (config.bundleGardenCamera === 'enthusiast') materialCost = 20;
        else if (config.bundleGardenCamera === 'hero') materialCost = 30;
        break;
      case 'bioBased':
        materialCost = 0;
        break;
      default:
        materialCost = 0;
    }
  }

  let modeCost = 0;

  if (config.recordingMode === 'nightVision') {
    switch (config.bundleGardenCamera) {
      case 'starter':
        modeCost = 20;
        break;
      case 'enthusiast':
        modeCost = 40;
        break;
      case 'hero':
        modeCost = 50;
        break;
      default:
        modeCost = 0;
    }
  }

  let batteryCost = 0;

  if (config.batteryGardenCamera === 2) {
    batteryCost = 10;
  } else if (config.batteryGardenCamera === 'solar') {
    batteryCost = 50;
  }

  let totalPrice = basePrice + lensCost + modeCost + materialCost + batteryCost;

  if (totalPrice > 437) totalPrice = 437;

  return totalPrice < basePrice ? basePrice : totalPrice;
};

// WONDERBLOCKS

export const calculateTotalPriceWonderblocks = (
  config: ProductState
): number => {
  let basePrice = 0;

  switch (config.bundleWonderblocks) {
    case 'starter':
      basePrice = 119;
      break;
    case 'enthusiast':
      basePrice = 218;
      break;
    case 'hero':
      basePrice = 297;
      break;
    default:
      basePrice = 119;
  }

  let typeCost = 0;

  if (config.typeOfWonderblocks === 'smart' && config.bundleWonderblocks) {
    switch (config.bundleWonderblocks) {
      case 'starter':
        typeCost = 30;
        break;
      case 'enthusiast':
        typeCost = 50;
        break;
      case 'hero':
        typeCost = 70;
        break;
      default:
        typeCost = 30;
    }
  }

  let materialCost = 0;

  if (config.materialOfWonderblocks && config.bundleWonderblocks) {
    switch (config.materialOfWonderblocks) {
      case 'biodegradable':
        if (config.bundleWonderblocks === 'starter') materialCost = 20;
        else if (config.bundleWonderblocks === 'enthusiast') materialCost = 40;
        else if (config.bundleWonderblocks === 'hero') materialCost = 50;
        break;
      case 'oceanPlastic':
        if (config.bundleWonderblocks === 'starter') materialCost = 10;
        else if (config.bundleWonderblocks === 'enthusiast') materialCost = 20;
        else if (config.bundleWonderblocks === 'hero') materialCost = 30;
        break;
      case 'bioBased':
        materialCost = 0;
        break;
      default:
        materialCost = 0;
    }
  }

  let totalPrice = basePrice + typeCost + materialCost;

  if (totalPrice > 417) totalPrice = 417;

  return totalPrice;
};

export const getMaxAddOnsForBundle = (
  bundle: 'starter' | 'enthusiast' | 'hero'
): number => {
  switch (bundle) {
    case 'starter':
      return 1;
    case 'enthusiast':
      return 2;
    case 'hero':
      return 3;
    default:
      return 0;
  }
};
