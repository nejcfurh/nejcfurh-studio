import React from 'react';

import type {
  Option,
  petalConfigurator,
  ProductState,
  SelectedItem,
  wonderblocksConfigurator
} from '../types/types';
import PetalConfigurator from './PetalConfigurator';
import WonderblocksConfigurator from './WonderblocksConfigurator';

interface WonderblocksAndPetalConfiguratorProps {
  handleBack: () => void;
  selectedItem: SelectedItem;
  petalConfiguratorOptions: petalConfigurator[];
  handleSelectionChange: (id: string, option: Option) => void;
  productConfigGardenCamera: ProductState;
  selectedMountingOptions: string[];
  handleSelectionMountingOptions: (
    id: string,
    maxAddOns: number | undefined
  ) => void;
  wonderblocksConfiguratorOptions: wonderblocksConfigurator[];
  handleSelectionChangeWonderblocks: (id: string, option: Option) => void;
  productConfigWonderblocks: ProductState;
  selectedAddOns: string[];
  handleSelectionAddOns: (id: string, maxAddOns: number | undefined) => void;
  progress: number;

  handleWonderBlocksPhotoIndex: (id: string) => void;
  wonderBlocksPhotoIndex: number;
}

const WonderblocksAndPetalConfigurator = ({
  handleBack,
  selectedItem,
  petalConfiguratorOptions,
  handleSelectionChange,
  productConfigGardenCamera,
  wonderblocksConfiguratorOptions,
  handleSelectionChangeWonderblocks,
  productConfigWonderblocks,
  selectedAddOns,
  handleSelectionAddOns,
  handleSelectionMountingOptions,
  selectedMountingOptions,
  progress,
  handleWonderBlocksPhotoIndex,
  wonderBlocksPhotoIndex
}: WonderblocksAndPetalConfiguratorProps): React.ReactNode => {
  return (
    <React.Fragment>
      {progress === 0 && (
        <PetalConfigurator
          handleBack={handleBack}
          selectedItem={selectedItem}
          petalConfiguratorOptions={petalConfiguratorOptions}
          handleSelectionChange={handleSelectionChange}
          productConfig={productConfigGardenCamera}
          selectedMountingOptions={selectedMountingOptions}
          handleSelectionMountingOptions={handleSelectionMountingOptions}
          progress={progress}
        />
      )}

      {progress === 1 && (
        <WonderblocksConfigurator
          handleBack={handleBack}
          selectedItem={selectedItem}
          wonderblocksConfiguratorOptions={wonderblocksConfiguratorOptions}
          handleSelectionChange={handleSelectionChangeWonderblocks}
          productConfig={productConfigWonderblocks}
          selectedAddOns={selectedAddOns}
          handleSelectionAddOns={handleSelectionAddOns}
          progress={progress}
          handleWonderBlocksPhotoIndex={handleWonderBlocksPhotoIndex}
          wonderBlocksPhotoIndex={wonderBlocksPhotoIndex}
        />
      )}
    </React.Fragment>
  );
};

export default WonderblocksAndPetalConfigurator;
