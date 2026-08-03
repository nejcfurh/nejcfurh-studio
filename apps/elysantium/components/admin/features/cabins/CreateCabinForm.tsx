'use client';

import Button from '@/components/admin/ui/Button';
import FileInput from '@/components/admin/ui/FileInput';
import Form from '@/components/admin/ui/Form';
import FormRow from '@/components/admin/ui/FormRow';
import Input from '@/components/admin/ui/Input';
import Textarea from '@/components/admin/ui/Textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { cabinSchema, type CabinFormValues } from './schemas';
import { useCreateCabin } from './useCreateCabin';
import { useEditCabin } from './useEditCabin';

interface Cabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

interface CreateCabinFormProps {
  cabinToEdit?: Cabin;
  onCloseModal?: () => void;
}

function CreateCabinForm({
  cabinToEdit = {} as Cabin,
  onCloseModal
}: CreateCabinFormProps): React.ReactElement {
  //custom hook for creating a cabin
  const { isCreating, createCabin } = useCreateCabin();
  //custom hook for editing a cabin
  const { isEditing, editCabin } = useEditCabin();

  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValue } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const schema = useMemo(() => cabinSchema(isEditSession), [isEditSession]);

  const { register, handleSubmit, reset, formState } = useForm<CabinFormValues>(
    {
      resolver: zodResolver(schema),
      mode: 'onTouched',
      defaultValues: isEditSession
        ? editValue
        : {
            name: '',
            maxCapacity: 1,
            regularPrice: 100,
            discount: 0,
            description: '',
            image: ''
          }
    }
  );

  const { errors } = formState;

  function onSubmit(data: CabinFormValues) {
    const image =
      typeof data.image === 'string' ? data.image : (data.image as FileList)[0];

    if (isEditSession)
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          }
        }
      );
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          }
        }
      );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label="Cabin Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register('name')}
        />
      </FormRow>

      <FormRow label="Maximum Capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register('maxCapacity', { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="Regular Price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register('regularPrice', { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isWorking}
          {...register('discount', { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register('description')}
        />
      </FormRow>

      <FormRow label="Photo" error={errors?.image?.message}>
        <FileInput id="image" accept="image/*" {...register('image')} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          $variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? 'Save' : 'Add cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
