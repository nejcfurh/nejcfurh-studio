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
import { Mail, MessageSquare } from 'lucide-react';
import { useState } from 'react';

type Props = {
  landlordName: string;
  landlordEmail: string;
  listingName: string;
};

export const ContactLandlordDialog = ({
  landlordName,
  landlordEmail,
  listingName
}: Props) => {
  const [message, setMessage] = useState('');

  const mailtoHref = `mailto:${landlordEmail}?subject=${encodeURIComponent(
    listingName
  )}&body=${encodeURIComponent(message)}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Contact landlord"
          title="Contact landlord"
          className="bg-background/90 text-foreground hover:bg-background grid size-11 cursor-pointer place-items-center rounded-full border shadow-lg backdrop-blur transition-colors"
        >
          <MessageSquare className="size-5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Message {landlordName}</DialogTitle>
          <DialogDescription>
            About <span className="font-medium">{listingName}</span>. Your email
            client will open with the message pre-filled.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi, I'm interested in this listing…"
            rows={5}
          />
        </div>

        <DialogFooter>
          <Button asChild disabled={message.trim().length === 0}>
            <a href={mailtoHref}>
              <Mail />
              Send via email
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
