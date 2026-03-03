
import Image from 'next/image';

import { gardenCameraAddOns } from '../constants/constants';
import type { ProductState } from '../types/types';
import { getMaxAddOnsForBundle } from '../utils/utils';

interface PetalMountingOptionsProps {
  productConfig: ProductState;
  selectedMountingOptions: string[];
  handleSelectionMountingOptions: (
    id: string,
    maxAddOns: number | undefined
  ) => void;
}

const PetalMountingOptions = ({
  productConfig,
  selectedMountingOptions,
  handleSelectionMountingOptions
}: PetalMountingOptionsProps): React.ReactNode => {
  const maxAddOns =
    productConfig.bundleGardenCamera &&
    getMaxAddOnsForBundle(productConfig.bundleGardenCamera);

  const bundle =
    maxAddOns === 1 ? 'starter' : maxAddOns === 2 ? 'enthusiast' : 'hero';

  return (
    <div className="flex flex-col">
      <label htmlFor="addons" className="mb-2 text-center font-bold text-white">
        Mounting options
      </label>
      <div
        id="addons"
        className="flex w-full flex-row flex-nowrap items-center justify-center gap-2 rounded-lg"
      >
        {gardenCameraAddOns.map((addOn) => {
          const isSelected = selectedMountingOptions.includes(addOn.id);
          const isDisabled =
            selectedMountingOptions.length === maxAddOns && !isSelected;

          return (
            <button
              type="button"
              key={addOn.id}
              className="relative flex h-[120px] w-[120px] flex-1 flex-grow flex-col items-center justify-between rounded-lg no-tap-highlight md:flex-none"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.7)',
                backgroundColor: isSelected
                  ? '#3B9858'
                  : 'rgba(255, 255, 255, 0.4)',
                opacity: isDisabled ? 0.5 : 1
              }}
              disabled={
                selectedMountingOptions.length === maxAddOns && !isSelected
              }
              onClick={(): void =>
                handleSelectionMountingOptions(addOn.id, maxAddOns)
              }
            >
              <Image
                src={addOn.image}
                width={70}
                height={70}
                alt={addOn.name}
                className="w-full object-contain"
              />
              <span
                className="absolute bottom-0 flex h-6 items-center justify-center text-xs"
                style={{
                  color: isSelected ? 'white' : '#003333',
                  fontSize: '12px'
                }}
              >
                {addOn.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mb-10 mt-3 flex w-full flex-col items-center justify-center font-bold text-[#003333]">
        {selectedMountingOptions.length}/{maxAddOns} selected
        <div className="mt-2 text-center text-xs font-light italic text-[#003333]">
          {bundle === 'starter' && (
            <p className="text-xs text-[#003333]">
              *You can only select {maxAddOns}{' '}
              {maxAddOns === 1 ? 'mounting option' : 'mounting options'} in the
              Starter bundle.
              <br />
              To select more, upgrade to the Enthusiast or Hero bundle.
            </p>
          )}
          {bundle === 'enthusiast' && (
            <p className="text-xs text-[#003333]">
              *You can only select {maxAddOns} mounting options in the
              Enthusiast bundle.
              <br />
              To select more, upgrade to the Hero bundle.
            </p>
          )}
          {bundle === 'hero' && (
            <p className="text-xs text-[#003333]">
              *You can select up to {maxAddOns} mounting options in the Hero
              bundle.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetalMountingOptions;
