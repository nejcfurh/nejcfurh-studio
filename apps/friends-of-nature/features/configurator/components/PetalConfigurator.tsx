import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';

import type {
  Option,
  ProductState,
  SelectedItem,
  petalConfigurator
} from '../types/types';
import PetalOptionsSelector from './PetalOptionsSelector';
import ProgressBar from './ProgressBar';

interface PetalConfiguratorProps {
  handleBack?: () => void;
  selectedItem: SelectedItem;
  petalConfiguratorOptions: petalConfigurator[];
  handleSelectionChange: (id: string, option: Option) => void;
  productConfig: ProductState;
  selectedMountingOptions: string[];
  handleSelectionMountingOptions: (
    id: string,
    maxAddOns: number | undefined
  ) => void;
  progress?: number | null;
}

const PetalConfigurator = ({
  handleBack,
  selectedItem,
  petalConfiguratorOptions,
  handleSelectionChange,
  productConfig,
  selectedMountingOptions,
  handleSelectionMountingOptions,
  progress
}: PetalConfiguratorProps): React.ReactNode => {
  return (
    <AnimatePresence>
      <motion.div
        className="relative mt-5 flex w-full flex-row items-center justify-center text-sm font-bold text-white"
        initial={{ opacity: 0, x: 50 }}
        key="upper-container"
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {handleBack && (
          <button
            type="button"
            className="absolute left-0 top-0 p-8 no-tap-highlight"
            onClick={handleBack}
          >
            <ChevronLeft className="absolute left-0 top-0" size={48} />
          </button>
        )}
        {selectedItem.name === 'Nature Camera' ? (
          <Image
            src={selectedItem.image}
            width={160}
            height={160}
            alt={selectedItem.name}
            className="overflow-hidden rounded-2xl bg-blue-200"
          />
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-4">
            {progress === 0 ? (
              <div className="mt-3 text-lg">1. Configure Nature Camera</div>
            ) : (
              <div className="mt-3 text-lg">2. Configure Wonder Blocks</div>
            )}
            <ProgressBar state={progress ?? undefined} />
            <Image
              src="/images/garden-camera.png"
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
        key="lower-container"
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* PETAL OPTIONS */}
        <PetalOptionsSelector
          configuratorOptions={petalConfiguratorOptions}
          handleSelectionChange={handleSelectionChange}
          productConfig={productConfig}
          selectedMountingOptions={selectedMountingOptions}
          handleSelectionMountingOptions={handleSelectionMountingOptions}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default PetalConfigurator;
