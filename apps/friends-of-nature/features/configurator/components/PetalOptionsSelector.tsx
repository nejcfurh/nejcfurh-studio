'use client';

import { cn } from 'lib/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import type { Option, petalConfigurator, ProductState } from '../types/types';
import PetalMountingOptions from './PetalMountingOptions';

type Props = {
  configuratorOptions: petalConfigurator[];
  handleSelectionChange: (category: string, option: Option) => void;
  productConfig: ProductState;
  selectedMountingOptions: string[];
  handleSelectionMountingOptions: (
    id: string,
    maxAddOns: number | undefined
  ) => void;
};

const PetalOptionsSelector = ({
  configuratorOptions,
  handleSelectionChange,
  productConfig,
  selectedMountingOptions,
  handleSelectionMountingOptions
}: Props): React.ReactNode => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, Option>
  >({});

  useEffect((): void => {
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
  };

  return (
    <div className="flex flex-col gap-4">
      {configuratorOptions.map(
        (config: petalConfigurator): React.ReactNode => (
          <div key={config.id} className="flex w-full flex-col items-center">
            <label className="my-2 font-bold text-white">
              {config.name === 'Bundle' ? '' : config.name}
            </label>
            <div
              className="mx-5 mt-1 flex w-full flex-nowrap rounded-lg"
              style={{ border: '1px solid rgba(255, 255, 255, 0.7)' }}
            >
              {config.options.map((option: Option, index): React.ReactNode => {
                const isFovOption = config.id === 'fovGardenCamera';
                const isRecordingTimeOption = config.id === 'recordingMode';
                const isMiddleItem = index === 1;
                const isMaterialOption = config.id === 'materialOfPetal';
                const isSelected =
                  selectedOptions[config.id]?.value === option.value;

                return (
                  <button
                    type="button"
                    key={option.id}
                    className="relative h-20 flex-1 flex-grow overflow-hidden rounded-lg px-1 py-1 text-base"
                    style={{
                      transition: 'all 0.2s ease',
                      boxShadow:
                        (isFovOption || isMaterialOption) && isSelected
                          ? 'inset 0 0 0 2px #3B9858'
                          : 'none',
                      backgroundColor:
                        isFovOption || isMaterialOption
                          ? 'transparent'
                          : isSelected
                            ? '#3B9858'
                            : 'rgba(255, 255, 255, 0.1)',
                      color: isMaterialOption
                        ? isSelected
                          ? 'green'
                          : '#003333'
                        : isFovOption
                          ? isSelected
                            ? 'white'
                            : '#003333'
                          : isSelected
                            ? 'white'
                            : '#003333',
                      backgroundImage:
                        (isFovOption || isMaterialOption) && option.image
                          ? `url(${option.image})`
                          : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      marginLeft:
                        (isFovOption || isMaterialOption) && isMiddleItem
                          ? '5px'
                          : '0',
                      marginRight:
                        (isFovOption || isMaterialOption) && isMiddleItem
                          ? '5px'
                          : '0',
                      fontSize:
                        isFovOption || isMaterialOption ? '14px' : '16px'
                    }}
                    onClick={(): void =>
                      handleChange(config.id.toString(), option)
                    }
                  >
                    <div
                      className={cn(
                        'flex flex-row items-center justify-center text-center font-bold',
                        isFovOption
                          ? 'mb-12 w-full items-start justify-center rounded-lg bg-white/70 px-1 py-1 text-xs font-bold'
                          : 'w-full items-center text-center text-sm',
                        isRecordingTimeOption
                          ? 'ml-2 w-full items-start justify-start'
                          : '',
                        config.name === 'Bundle' ||
                          option.value === 'nightVision'
                          ? 'mt-3 flex-col'
                          : 'flex-row'
                      )}
                      style={{
                        backgroundColor: isFovOption
                          ? selectedOptions[config.id]?.value === option.value
                            ? '#3B9858'
                            : 'rgba(255, 255, 255, 0.7)'
                          : 'transparent'
                      }}
                    >
                      {option.name}{' '}
                      {option.value === 'nightVision' && (
                        <span
                          className="text-[10px] font-thin"
                          style={{ lineHeight: '1.2' }}
                        >
                          {option.description}
                        </span>
                      )}
                      {config.name === 'Bundle' && (
                        <span
                          className="mb-3 text-[10px] font-thin"
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
                      {isRecordingTimeOption && option.image && (
                        <Image
                          src={option.image}
                          alt={option.name}
                          width={85}
                          height={85}
                          className="absolute right-0 bottom-0"
                        />
                      )}
                      {option.value === 'solar' && option.image && (
                        <Image
                          src={option.image}
                          alt={option.name}
                          width={20}
                          height={20}
                          className="mb-1 ml-1"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {config.options.map((option: Option): React.ReactNode => {
              if (config.name === 'Bundle') return null;

              if (option.id === 'nightVision' || option.id === 'daytime')
                return null;

              if (selectedOptions[config.id]?.value === option.value) {
                return (
                  <div
                    className="mt-3 text-center text-xs leading-none text-[#003333]"
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
      <PetalMountingOptions
        productConfig={productConfig}
        selectedMountingOptions={selectedMountingOptions}
        handleSelectionMountingOptions={handleSelectionMountingOptions}
      />
    </div>
  );
};

export default PetalOptionsSelector;
