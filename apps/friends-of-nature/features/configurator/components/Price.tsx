import { useEffect, useState } from 'react';

import { Product, type ProductState, type SelectedItem } from '../types/types';
import {
  convertPrice,
  detectUserCurrency,
  formatPrice,
  type Currency
} from '../utils/currency';
import { getMaxAddOnsForBundle } from '../utils/utils';
import { Claps } from './Claps';

interface PriceProps {
  selectedItem: SelectedItem;
  totalPrice: number;
  handleSubmit: () => void;
  handleNext: () => void;
  progress: number;
  isLoading: boolean;
  selectedAddOns: string[];
  selectedMountingOptions: string[];
  productConfigGardenCamera: ProductState;
  productConfigWonderBlocks: ProductState;
}

const Price = ({
  selectedItem,
  totalPrice,
  handleSubmit,
  progress,
  handleNext,
  isLoading,
  selectedAddOns,
  selectedMountingOptions,
  productConfigGardenCamera,
  productConfigWonderBlocks
}: PriceProps): React.ReactNode => {
  const [userCurrency, setUserCurrency] = useState<Currency>('USD');
  const [convertedPrice, setConvertedPrice] = useState<number>(totalPrice);

  useEffect(() => {
    const loadCurrency = async (): Promise<void> => {
      const currency = await detectUserCurrency();

      setUserCurrency(currency);
    };

    void loadCurrency();
  }, []);

  useEffect(() => {
    const converted = convertPrice(totalPrice, userCurrency);

    setConvertedPrice(converted);
  }, [totalPrice, userCurrency]);

  const isComboConfigurator =
    selectedItem.id === Product.WonderblocksWithGardenCamera;

  const handleButtonClick = (): void => {
    if (isComboConfigurator) {
      if (progress === 0) {
        handleNext();
      } else {
        handleSubmit();
      }
    } else {
      handleSubmit();
    }
  };

  const maxAddOns =
    productConfigWonderBlocks.bundleWonderblocks &&
    getMaxAddOnsForBundle(productConfigWonderBlocks.bundleWonderblocks);

  const maxMountingOptions =
    productConfigGardenCamera.bundleGardenCamera &&
    getMaxAddOnsForBundle(productConfigGardenCamera.bundleGardenCamera);

  const isDisabledGardenCam =
    selectedMountingOptions.length > (maxMountingOptions ?? 0);

  const isDisabledWonderBlocks = selectedAddOns.length > (maxAddOns ?? 0);

  return (
    <div className="fade-in relative z-10 h-[100px] w-full rounded-t-2xl border-[2px] border-white/60 bg-white/80 p-3 md:w-1/2">
      <div className="flex w-full flex-col justify-center gap-1">
        <div className="mx-auto flex w-full space-x-5 px-5">
          <div className="mt-1 flex flex-col">
            <p className="text-sm text-[#003333]">Total</p>
            <p className="w-[75px] text-3xl font-bold text-[#003333]">
              {formatPrice(convertedPrice, userCurrency)}
            </p>
          </div>
          <div className="w-full items-center justify-center">
            <button
              type="button"
              className="flex w-2/3 items-center justify-center rounded-3xl bg-[#4fb970] px-5 py-5 text-center font-bold text-white md:w-5/6"
              disabled={isLoading}
              onClick={(): void => handleButtonClick()}
              style={{
                opacity:
                  isLoading || isDisabledGardenCam || isDisabledWonderBlocks
                    ? 0.5
                    : 1
              }}
            >
              <p className="text-2xl">
                {selectedItem.id === 'Wonder Blocks and Garden Camera' &&
                progress === 0
                  ? 'Next'
                  : isLoading
                    ? 'Loading...'
                    : 'Submit'}
              </p>
            </button>
          </div>
        </div>
        <Claps
          pageId="wonder"
          className="no-tap-highlight absolute -top-10 right-0 inline-block"
        />
      </div>
    </div>
  );
};

export default Price;
