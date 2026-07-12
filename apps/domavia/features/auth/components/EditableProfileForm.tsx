'use client';

import { updateProfile } from '@/features/auth/actions/profile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getFirebaseErrorMessage } from '@/features/auth/utils/firebase-errors';
import { requestAvatarUploadTicket } from '@/features/listings/actions/request-upload-tickets';
import { isAllowedImageMime } from '@/features/listings/constants';
import { firebaseAuth } from '@/lib/firebase/client';
import { supabaseBrowser } from '@/lib/supabase/client';
import { STORAGE_BUCKET } from '@/lib/supabase/constants';
import { AnimatedDiv, AnimatedText } from '@repo/ui/animation/core';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { toast } from '@repo/ui/components/sonner';
import { Loader2, Save, Upload, User } from '@repo/ui/icons/lucide';
import { verifyBeforeUpdateEmail } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Props = {
  initialDisplayName: string | null;
  initialEmail: string | null;
  initialPhotoURL: string | null;
  provider: string | null;
};

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export const EditableProfileForm = ({
  initialDisplayName,
  initialEmail,
  initialPhotoURL,
  provider
}: Props) => {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(initialDisplayName ?? '');
  const [email, setEmail] = useState(initialEmail ?? '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(initialPhotoURL);
  const [pending, setPending] = useState(false);

  const canEditEmail = provider === 'password';

  useEffect(
    () => () => {
      if (previewURL && previewURL.startsWith('blob:')) {
        URL.revokeObjectURL(previewURL);
      }
    },
    [previewURL]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isAllowedImageMime(file.type)) {
      toast.error('Only JPG, PNG, or WebP images are allowed.');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error('Image must be 5MB or smaller.');
      return;
    }
    setPhotoFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;

    const trimmedName = displayName.trim();
    const trimmedEmail = email.trim();
    const nameChanged = trimmedName !== (initialDisplayName ?? '').trim();
    const emailChanged =
      canEditEmail && trimmedEmail !== (initialEmail ?? '').trim();
    const photoChanged = photoFile !== null;

    if (!nameChanged && !emailChanged && !photoChanged) {
      toast.info('Nothing to save.');
      return;
    }

    setPending(true);

    try {
      if (nameChanged || photoChanged) {
        let photoPendingPath: string | undefined;
        if (photoChanged && photoFile) {
          const ticket = await requestAvatarUploadTicket(photoFile.type);
          const { error } = await supabaseBrowser.storage
            .from(STORAGE_BUCKET)
            .uploadToSignedUrl(ticket.path, ticket.token, photoFile, {
              contentType: ticket.contentType,
              upsert: false
            });
          if (error) throw new Error(error.message);
          photoPendingPath = ticket.path;
        }
        await updateProfile({
          displayName: nameChanged ? trimmedName : undefined,
          photoPendingPath
        });
        await refreshUser();
        toast.success('Profile updated.');
      }

      if (emailChanged) {
        const currentUser = firebaseAuth.currentUser;
        if (!currentUser) throw new Error('Not signed in.');
        await verifyBeforeUpdateEmail(currentUser, trimmedEmail);
        toast.success(
          'Verification email sent. Check the new inbox to confirm.'
        );
        setEmail(initialEmail ?? '');
      }

      setPhotoFile(null);
      router.refresh();
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <AnimatedDiv className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        {previewURL ? (
          <Image
            src={previewURL}
            alt="Profile photo"
            width={224}
            height={224}
            loading="eager"
            unoptimized={previewURL.startsWith('blob:')}
            className="size-64 shrink-0 rounded-full object-cover"
          />
        ) : (
          <AnimatedDiv className="bg-muted text-muted-foreground flex size-56 shrink-0 items-center justify-center rounded-full">
            <User className="size-20" />
          </AnimatedDiv>
        )}

        <AnimatedDiv className="flex flex-1 flex-col gap-4 self-stretch">
          <AnimatedDiv className="flex h-20 flex-col gap-2.5">
            <Label htmlFor="displayName" className="text-base">
              Display name
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={pending}
              autoComplete="name"
              className="h-12 min-h-12 px-4 text-base md:text-base"
            />
          </AnimatedDiv>

          <AnimatedDiv className="flex flex-col gap-2">
            <AnimatedDiv className="flex h-20 flex-col gap-2.5">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending || !canEditEmail}
                autoComplete="email"
                className="h-12 min-h-12 px-4 text-base md:text-base"
              />
            </AnimatedDiv>
            {canEditEmail ? (
              <AnimatedText className="text-muted-foreground text-xs">
                Changing your email will send a verification link to the new
                address. The change takes effect after you confirm.
              </AnimatedText>
            ) : (
              <AnimatedText className="text-muted-foreground text-xs">
                {provider === 'google.com'
                  ? 'Your email is managed by Google and can’t be changed here.'
                  : 'Email cannot be changed for this sign-in method.'}
              </AnimatedText>
            )}
          </AnimatedDiv>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={pending}
            className="hidden"
          />
          <AnimatedDiv className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={pending}
              className="gap-2"
            >
              <Upload className="size-4" />
              Change photo
            </Button>
            <AnimatedText className="text-muted-foreground text-xs">
              PNG or JPG, up to 5MB.
            </AnimatedText>
          </AnimatedDiv>
        </AnimatedDiv>
      </AnimatedDiv>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="animate-spin" /> : <Save />}
        {pending ? 'Saving' : 'Save changes'}
      </Button>
    </form>
  );
};
