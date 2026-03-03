import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import type { ProductItem, ProductState, SelectedItem } from '../types/types';
import type { Currency } from '../utils/currency';
import {
  convertPrice,
  detectUserCurrency,
  formatPrice
} from '../utils/currency';

interface MainConfiguratorProps {
  products: ProductItem[];
  productConfig: ProductState;
  handleSelectedItem: (key: 'product', item: SelectedItem) => void;
}

const MainConfigurator = ({
  products,
  productConfig,
  handleSelectedItem
}: MainConfiguratorProps): React.ReactNode => {
  const [userCurrency, setUserCurrency] = useState<Currency>('USD');

  useEffect(() => {
    const loadCurrency = async (): Promise<void> => {
      const currency = await detectUserCurrency();

      setUserCurrency(currency);
    };

    void loadCurrency();
  }, []);

  return (
    <React.Fragment>
      <div className="mt-5 flex flex-row items-center justify-center text-sm font-bold text-white">
        Select one
      </div>
      <div className="mt-2 flex w-full flex-col gap-3">
        {/* CONFIGURATOR ITEM */}
        {products.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex flex-row items-center justify-center gap-6 rounded-2xl border-[2px] px-2 py-2"
            style={{
              transition: 'all 0.5s ease',
              borderColor:
                productConfig.product === item.name
                  ? '#3B9858'
                  : 'rgba(255, 255, 255, 0.8)',
              backgroundColor:
                productConfig.product === item.name
                  ? '#3B9858'
                  : 'rgba(255, 255, 255, 0.6)'
            }}
            onClick={(): void => handleSelectedItem('product', item)}
          >
            <div className="flex h-full items-center justify-center overflow-hidden rounded-xl bg-white/40">
              <Image
                src={item.image}
                width={250}
                height={250}
                alt={item.name}
                className="overflow-hidden"
              />
            </div>
            <div className="flex w-full flex-col justify-between">
              <div className="flex w-full flex-col gap-1">
                <p className="w-full text-left !text-lg font-bold text-[#003333]">
                  {item.name}
                </p>
                <p className="w-full text-left text-xs text-[#003333]">
                  {item.description}
                </p>
                <p className="mt-3 w-full pr-2 text-right text-xs font-semibold italic text-[#003333]">
                  Starts at{' '}
                  {formatPrice(
                    convertPrice(item.startsAt, userCurrency),
                    userCurrency
                  )}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </React.Fragment>
  );
};

export default MainConfigurator;
