'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getLandlordContact } from '@/features/listings/actions/get-landlord-contact';
import {
  AnimatedButton,
  AnimatedDiv,
  AnimatedSpan
} from '@repo/ui/animation/core';
import { Loader2, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  listingId: string;
  listingName: string;
  viewerSignedIn: boolean;
};

type Contact = { email: string; displayName: string };

export const ContactLandlordDialog = ({
  listingId,
  listingName,
  viewerSignedIn
}: Props) => {
  const pathname = usePathname();
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      setMessage('');
      return;
    }
    if (contact || loading || !viewerSignedIn) return;
    setLoading(true);
    try {
      const result = await getLandlordContact(listingId);
      setContact(result);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Could not load landlord contact info.'
      );
    } finally {
      setLoading(false);
    }
  };

  const mailtoHref =
    contact && message.trim().length > 0
      ? `mailto:${contact.email}?subject=${encodeURIComponent(
          listingName
        )}&body=${encodeURIComponent(message)}`
      : undefined;

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <AnimatedButton
          type="button"
          aria-label="Contact landlord"
          title="Contact landlord"
          className="bg-background/90 text-foreground hover:bg-background grid size-11 cursor-pointer place-items-center rounded-full border shadow-lg backdrop-blur transition-colors"
        >
          <MessageSquare className="size-5" />
        </AnimatedButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {viewerSignedIn
              ? `Message ${contact?.displayName ?? 'the landlord'}`
              : 'Sign in to contact'}
          </DialogTitle>
          <DialogDescription>
            {viewerSignedIn ? (
              <>
                About{' '}
                <AnimatedSpan className="font-medium">
                  {listingName}
                </AnimatedSpan>
                . Your email client will open with the message pre-filled.
              </>
            ) : (
              'You need an account to contact landlords. This keeps inboxes spam-free.'
            )}
          </DialogDescription>
        </DialogHeader>

        {viewerSignedIn ? (
          <AnimatedDiv className="flex flex-col gap-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I'm interested in this listing…"
              rows={5}
              disabled={loading || !contact}
            />
          </AnimatedDiv>
        ) : null}

        <DialogFooter>
          {viewerSignedIn ? (
            <Button asChild disabled={!mailtoHref}>
              {mailtoHref ? (
                <a href={mailtoHref}>
                  <Mail />
                  Send via email
                </a>
              ) : (
                <AnimatedSpan>
                  {loading ? <Loader2 className="animate-spin" /> : <Mail />}
                  {loading ? 'Loading' : 'Send via email'}
                </AnimatedSpan>
              )}
            </Button>
          ) : (
            <Button asChild>
              <Link
                href={`/auth/login?next=${encodeURIComponent(pathname ?? '/')}`}
              >
                Sign in
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
