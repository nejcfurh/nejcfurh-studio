import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';

import type {
  Option,
  ProductState,
  SelectedItem,
  wonderblocksConfigurator
} from '../types/types';
import ProgressBar from './ProgressBar';
import WonderblocksOptionsSelector from './WonderblocksOptionsSelector';

interface WonderblocksConfiguratorProps {
  handleBack?: () => void;
  selectedItem: SelectedItem;
  wonderblocksConfiguratorOptions: wonderblocksConfigurator[];
  handleSelectionChange: (id: string, option: Option) => void;
  productConfig: ProductState;
  selectedAddOns: string[];
  handleSelectionAddOns: (id: string, maxAddOns: number | undefined) => void;
  progress?: number | null;
  handleWonderBlocksPhotoIndex: (id: string) => void;
  wonderBlocksPhotoIndex: number;
}

const WonderblocksConfigurator = ({
  handleBack,
  selectedItem,
  wonderblocksConfiguratorOptions,
  handleSelectionChange,
  productConfig,
  selectedAddOns,
  handleSelectionAddOns,
  progress,
  handleWonderBlocksPhotoIndex,
  wonderBlocksPhotoIndex
}: WonderblocksConfiguratorProps): React.ReactNode => {
  const wonderBlocksImages = [
    '/images/wonderblocks-1.png',
    '/images/wonderblocks-2.png',
    '/images/wonderblocks-3.png'
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="relative mt-5 flex w-full flex-row items-center justify-center text-sm font-bold text-white"
        initial={{ opacity: 0, x: 50 }}
        key="upper-container-wonderblocks"
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {handleBack && (
          <button
            type="button"
            className="no-tap-highlight absolute top-0 left-0 p-8"
            onClick={handleBack}
          >
            <ChevronLeft className="absolute top-0 left-0" size={48} />
          </button>
        )}
        {selectedItem.name === 'Wonder Blocks' ? (
          <Image
            key={wonderBlocksPhotoIndex}
            src={wonderBlocksImages[wonderBlocksPhotoIndex]}
            width={160}
            height={160}
            alt={selectedItem.name}
            className="scale-120 overflow-hidden rounded-2xl bg-blue-200"
          />
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-4">
            {progress === 0 ? (
              <div className="mt-3 text-lg">1. Configure Petal</div>
            ) : (
              <div className="mt-3 text-lg">2. Configure Wonder Blocks</div>
            )}
            <ProgressBar state={progress ?? undefined} />
            <Image
              key={wonderBlocksPhotoIndex}
              src={wonderBlocksImages[wonderBlocksPhotoIndex]}
              width={160}
              height={160}
              alt={selectedItem.name}
              className="mt-3 overflow-hidden rounded-2xl bg-blue-200"
            />
          </div>
        )}
      </motion.div>
      <motion.div
        className="mt-3 flex w-full flex-col gap-2"
        initial={{ opacity: 0, x: 50 }}
        key="lower-container-wonderblocks"
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* WONDERBLOCKS OPTIONS */}
        <WonderblocksOptionsSelector
          configuratorOptions={wonderblocksConfiguratorOptions}
          handleSelectionChange={handleSelectionChange}
          productConfig={productConfig}
          selectedAddOns={selectedAddOns}
          handleSelectionAddOns={handleSelectionAddOns}
          handleWonderBlocksPhotoIndex={handleWonderBlocksPhotoIndex}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default WonderblocksConfigurator;
