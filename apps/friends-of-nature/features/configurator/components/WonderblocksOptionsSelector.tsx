import React, { useEffect, useState } from 'react';
import { cn } from 'lib/utils';

import type {
  Option,
  ProductState,
  wonderblocksConfigurator
} from '../types/types';
import WonderblocksAddOns from './WonderblocksAddOns';

type WonderblocksOptionsSelectorProps = {
  configuratorOptions: wonderblocksConfigurator[];
  handleSelectionChange: (category: string, option: Option) => void;
  productConfig: ProductState;
  selectedAddOns: string[];
  handleSelectionAddOns: (id: string, maxAddOns: number | undefined) => void;
  handleWonderBlocksPhotoIndex: (id: string) => void;
};

const WonderblocksOptionsSelector = ({
  configuratorOptions,
  handleSelectionChange,
  productConfig,
  selectedAddOns,
  handleSelectionAddOns,
  handleWonderBlocksPhotoIndex
}: WonderblocksOptionsSelectorProps): React.ReactNode => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, Option>
  >({});

  useEffect(() => {
    const initialSelectedOptions: Record<string, Option> = {};

    configuratorOptions.forEach((config) => {
      const selectedOption = config.options.find(
        (option) =>
          option.value ===
          productConfig[config.id as keyof typeof productConfig]
      );

      if (selectedOption) {
        initialSelectedOptions[config.id] = selectedOption;
      }
    });

    setSelectedOptions(initialSelectedOptions);
  }, [configuratorOptions, productConfig]);

  const handleChange = (category: string, option: Option): void => {
    setSelectedOptions((prev) => ({ ...prev, [category]: option }));
    handleSelectionChange(category, option);
    if (productConfig?.bundleWonderblocks) {
      handleWonderBlocksPhotoIndex(option.value.toString());
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {configuratorOptions.map(
        (config): React.ReactNode => (
          <div key={config.id} className="flex w-full flex-col items-center">
            <label className="my-2 font-bold text-white">
              {config.name === 'Bundle' ? '' : config.name}
            </label>
            <div
              className="mx-5 mt-1 flex w-full flex-nowrap rounded-lg"
              style={{ border: '1px solid rgba(255, 255, 255, 0.7)' }}
            >
              {config.options.map((option, index): React.ReactNode => {
                const isSelected =
                  selectedOptions[config.id]?.value === option.value;
                const isMaterialOption = config.id === 'materialOfWonderblocks';
                const isMiddleItem = index === 1;

                return (
                  <button
                    type="button"
                    key={option.id}
                    className="h-20 flex-1 flex-grow rounded-lg px-1 py-1 text-base"
                    style={{
                      transition: 'all 0.2s ease',
                      boxShadow:
                        isMaterialOption && isSelected
                          ? 'inset 0 0 0 2px #3B9858'
                          : 'none',
                      backgroundColor: isMaterialOption
                        ? 'transparent'
                        : isSelected
                        ? '#3B9858'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: isMaterialOption
                        ? isSelected
                          ? 'green'
                          : '#003333'
                        : isSelected
                        ? 'white'
                        : '#003333',
                      backgroundImage: option.image
                        ? `url(${option.image})`
                        : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      marginLeft:
                        isMaterialOption && isMiddleItem ? '5px' : '0',
                      marginRight:
                        isMaterialOption && isMiddleItem ? '5px' : '0',
                      fontSize: isMaterialOption ? '14px' : '16px'
                    }}
                    onClick={(): void => handleChange(config.id, option)}
                  >
                    <div
                      className={cn(
                        'flex flex-row items-center justify-center text-center',
                        config.name === 'Bundle'
                          ? 'mt-3 flex-col font-bold'
                          : 'flex-row'
                      )}
                    >
                      {option.name}
                      {config.name === 'Bundle' && (
                        <span
                          className="mb-4 text-[10px] font-thin"
                          style={{ lineHeight: '1.2' }}
                        >
                          {Array.isArray(option.description) ? (
                            option.description.map((desc, index) => (
                              <React.Fragment key={desc}>
                                {desc}
                                {option.description &&
                                  index !== option.description.length - 1 && (
                                    <br />
                                  )}{' '}
                              </React.Fragment>
                            ))
                          ) : (
                            <span>{option.description}</span>
                          )}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {config.options.map((option: Option): React.ReactNode => {
              const isSelected =
                selectedOptions[config.id]?.value === option.value;

              if (config.name === 'Bundle') return null;

              if (isSelected) {
                return (
                  <div
                    className="mt-3 text-xs leading-none text-[#003333]"
                    key={option.id}
                  >
                    {option.description}
                  </div>
                );
              }

              return null;
            })}
          </div>
        )
      )}
      <WonderblocksAddOns
        productConfig={productConfig}
        selectedAddOns={selectedAddOns}
        handleSelectionAddOns={handleSelectionAddOns}
      />
    </div>
  );
};

export default WonderblocksOptionsSelector;
