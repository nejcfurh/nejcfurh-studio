'use client';

import Modal from '@/components/Modal';
import UploadImage from '@/components/UploadImage';
import { updateAvatar } from '@/lib/actions/account';
import { deleteAvatarSupabase } from '@/lib/supabase';
import { extractImageName } from '@/lib/utils/helpers';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ProfileImageProps {
  avatar?: string;
}

export default function ProfileImage({ avatar }: ProfileImageProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(avatar || '');
  const [isUpdated, setIsUpdated] = useState(false);

  const handleImageUpload = (url: string) => {
    setAvatarUrl(url);
    setIsUpdated(true);
  };

  const previousAvatar = avatar ? extractImageName(avatar) : null;

  useEffect(() => {
    if (isUpdated && avatarUrl) {
      updateAvatar(avatarUrl)
        .then(() => {
          toast.success('Avatar uploaded successfully!');
          if (previousAvatar && previousAvatar !== 'DefaultUser.png') {
            deleteAvatarSupabase(previousAvatar);
          }
        })
        .catch(() => {
          toast.error('Failed to upload avatar!');
        })
        .finally(() => {
          setIsUpdated(false);
        });
    }
  }, [isUpdated, avatarUrl, previousAvatar]);

  const closeModal = () => setIsOpenModal(false);

  return (
    <div className="profile-image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="profile-pic"
        src={avatarUrl || '/photos/DefaultUser.png'}
        onClick={() => setIsOpenModal(true)}
        alt="Profile"
      />
      <Modal open={isOpenModal} onClose={closeModal}>
        <UploadImage
          onCloseModal={closeModal}
          onImageUpload={handleImageUpload}
          bucket="avatar-images"
          title="Upload an avatar image ..."
        />
      </Modal>
    </div>
  );
}
