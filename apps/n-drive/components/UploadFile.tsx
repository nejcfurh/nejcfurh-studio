import Form from '@/components/Form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';

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
