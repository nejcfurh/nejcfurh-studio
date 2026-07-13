import Form from '@/components/Form';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@repo/ui/components/dialog';
import { toast } from '@repo/ui/components/sonner';
import { useState } from 'react';

const UploadFile = ({ organizationId }: { organizationId: string }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSuccess = () => {
    setModalOpen(false);
    toast.success('File uploaded successfully.', {
      duration: 3000
      // ADD ICON
    });
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer p-6 text-lg font-semibold"
          onClick={() => setModalOpen(true)}
        >
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Upload File</DialogTitle>
        <Form organizationId={organizationId!} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadFile;
