'use client';

import Button from '@/components/admin/ui/Button';
import FileInput from '@/components/admin/ui/FileInput';
import Form from '@/components/admin/ui/Form';
import FormRow from '@/components/admin/ui/FormRow';
import Input from '@/components/admin/ui/Input';
import Textarea from '@/components/admin/ui/Textarea';
import { FieldErrors, useForm } from 'react-hook-form';

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

interface CabinFormValues {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string | FileList;
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

  const { register, handleSubmit, reset, getValues, formState } =
    useForm<CabinFormValues>({
      defaultValues: isEditSession ? editValue : {}
    });

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

  function onError(errors: FieldErrors<CabinFormValues>) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label="Cabin Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register('name', {
            required: 'This field is required!'
          })}
        />
      </FormRow>

      <FormRow label="Maximum Capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register('maxCapacity', {
            required: 'This field is required!',
            min: {
              value: 1,
              message: 'The minimum value for capacity should be 1!'
            }
          })}
        />
      </FormRow>

      <FormRow label="Regular Price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register('regularPrice', {
            required: 'This field is required!',
            min: {
              value: 100,
              message: 'The minimum price for the cabin is 100$!'
            }
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isWorking}
          {...register('discount', {
            required: 'This field is required!',
            validate: (value: number) =>
              +getValues().regularPrice > +value ||
              'Discount must be lower than the regular price!'
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register('description', {
            required: 'This field is required!'
          })}
        />
      </FormRow>

      <FormRow label="Photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          {...register('image', {
            required: isEditSession ? false : 'The image is required!'
          })}
        />
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
