
import Image from 'next/image';

import { wonderblocksAddOns } from '../constants/constants';
import type { ProductState } from '../types/types';
import { getMaxAddOnsForBundle } from '../utils/utils';

interface WonderblocksAddOnsProps {
  productConfig: ProductState;
  selectedAddOns: string[];
  handleSelectionAddOns: (id: string, maxAddOns: number | undefined) => void;
}

const WonderblocksAddOns = ({
  productConfig,
  selectedAddOns,
  handleSelectionAddOns
}: WonderblocksAddOnsProps): React.ReactNode => {
  const maxAddOns =
    productConfig.bundleWonderblocks &&
    getMaxAddOnsForBundle(productConfig.bundleWonderblocks);

  const bundle =
    maxAddOns === 1 ? 'starter' : maxAddOns === 2 ? 'enthusiast' : 'hero';

  return (
    <div className="flex flex-col">
      <label htmlFor="addons" className="mb-2 text-center font-bold text-white">
        Add-ons
      </label>
      <div
        id="addons"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none'
        }}
        className="flex w-full flex-row flex-nowrap items-center justify-center gap-2 rounded-lg"
      >
        {wonderblocksAddOns.map((addOn) => {
          const isSelected = selectedAddOns.includes(addOn.id);
          const isDisabled = selectedAddOns.length === maxAddOns && !isSelected;

          return (
            <button
              type="button"
              key={addOn.id}
              className="flex h-[120px] w-[120px] flex-col items-center justify-between rounded-lg no-tap-highlight"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.7)',
                backgroundColor: isSelected
                  ? '#3B9858'
                  : 'rgba(255, 255, 255, 0.4)',
                opacity: isDisabled ? 0.5 : 1
              }}
              disabled={selectedAddOns.length === maxAddOns && !isSelected}
              onClick={(): void => handleSelectionAddOns(addOn.id, maxAddOns)}
            >
              <Image
                src={addOn.image}
                width={70}
                height={70}
                alt={addOn.name}
                className="mt-5 scale-150 object-contain"
              />
              <span
                className="flex h-6 items-center justify-center text-xs"
                style={{
                  color: isSelected ? 'white' : '#003333',
                  fontSize: '10px'
                }}
              >
                {addOn.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mb-10 mt-3 flex w-full flex-col items-center justify-center font-bold text-[#003333]">
        {selectedAddOns.length}/{maxAddOns} selected
        <div className="mt-2 text-center text-xs font-light italic text-[#003333]">
          {bundle === 'starter' && (
            <p className="text-xs text-[#003333]">
              *You can only select {maxAddOns}{' '}
              {maxAddOns === 1 ? 'add-on' : 'add-ons'} in the Starter bundle.
              <br />
              To select more, upgrade to the Enthusiast or Hero bundle.
            </p>
          )}
          {bundle === 'enthusiast' && (
            <p className="text-xs text-[#003333]">
              *You can only select {maxAddOns} add-ons in the Enthusiast bundle.
              <br />
              To select more, upgrade to the Hero bundle.
            </p>
          )}
          {bundle === 'hero' && (
            <p className="text-xs text-[#003333]">
              *You can select up to {maxAddOns} add-ons in the Hero bundle.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WonderblocksAddOns;
