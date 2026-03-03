import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { Loader2Icon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from './ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { InputGroup } from './ui/input-group';

const formSchema = z.object({
  title: z.string().min(1).max(100),
  file: z
    .custom<FileList>((val) => val instanceof FileList, 'File is required')
    .refine((files) => files.length > 0, {
      message: 'File is required'
    })
});

const Form = ({
  organizationId,
  onSuccess
}: {
  organizationId: string;
  onSuccess: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      file: undefined
    }
  });

  const generateUploadUrlMutation = useMutation(api.files.generateUploadUrl);
  const createFileMutation = useMutation(api.files.createFile);

  const fileRef = form.register('file');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    if (!organizationId) return;

    const uploadUrl = await generateUploadUrlMutation();

    const fileType = values.file[0]!.type;

    const result = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': fileType
      },
      body: values.file[0]
    });

    const { storageId } = await result.json();

    const mappedFileTypes = {
      'image/jpeg': 'image',
      'image/png': 'image',
      'image/jpg': 'image',
      'application/pdf': 'pdf',
      'text/csv': 'csv',
      'video/mp4': 'video',
      'video/webm': 'video'
    } as Record<string, Doc<'files'>['type']>;

    const fileExtension = fileType.split('/')[1];

    await createFileMutation({
      name: values.title + '.' + fileExtension,
      fileId: storageId,
      organizationId: organizationId,
      type: mappedFileTypes[fileType]
    });

    form.reset();
    onSuccess();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">Title</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter a title for the file"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError
                  errors={[
                    { message: 'Title must contain at least 1 character' }
                  ]}
                />
              )}
            </Field>
          )}
        />
        <Controller
          name="file"
          control={form.control}
          render={({ fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-description">File</FieldLabel>
              <InputGroup>
                <Input {...fileRef} id="form-rhf-demo-file" type="file" />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <div className="mt-10 flex justify-between gap-2">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="min-w-20"
        >
          {form.formState.isSubmitting ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            'Upload'
          )}
        </Button>
      </div>
    </form>
  );
};

export default Form;
