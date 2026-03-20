'use client';

import { User } from '@prisma/client';
import { useMutation } from '@repo/react-query';
import axios from 'axios';
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '../Button';
import Input from '../inputs/Input';
import Modal from '../Modal';

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const router = useRouter();

  const updateSettings = useMutation({
    mutationFn: (data: FieldValues) => axios.post('/api/settings', data),
    onSuccess: () => {
      toast.success('Information saved successfully!');
      router.refresh();
      onClose();
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });

  const isLoading = updateSettings.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  });

  const image = watch('image');

  const handleUpload = (result: {
    info?: string | { secure_url?: string };
  }) => {
    const info = result?.info;
    const url = typeof info === 'object' ? info?.secure_url : undefined;
    setValue('image', url, {
      shouldValidate: true
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    updateSettings.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base leading-7 font-semibold text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <div>
                <label className="block text-sm leading-6 font-medium text-gray-900">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <Image
                    width="48"
                    height="48"
                    className="rounded-full"
                    style={{ clipPath: 'circle()' }}
                    src={
                      image || currentUser?.image || '/images/placeholder.jpg'
                    }
                    alt="avatar"
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset="o4ffoebx"
                  >
                    <span className="text-sm font-semibold text-gray-900">
                      Change
                    </span>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button disabled={isLoading} secondary onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
