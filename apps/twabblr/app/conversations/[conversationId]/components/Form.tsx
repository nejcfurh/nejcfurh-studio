'use client';

import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import { CldUploadButton } from 'next-cloudinary';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';

import MessageInput from './MessageInput';

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: { message: '' }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    //clear values from the form
    setValue('message', '', { shouldValidate: true });
    axios.post('/api/messages', {
      ...data,
      conversationId: conversationId
    });
  };

  const handleUpload = (result: {
    info?: string | { secure_url?: string };
  }) => {
    const info = result?.info;
    const image = typeof info === 'object' ? info?.secure_url : undefined;
    axios.post('/api/messages', {
      image,
      conversationId: conversationId
    });
  };

  return (
    <div className="flex w-full items-center gap-2 border-t bg-white px-4 py-4 lg:gap-4">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="o4ffoebx"
      >
        <HiPhoto
          size={30}
          className="cursor-pointer text-gray-600 transition hover:text-gray-800"
        />
      </CldUploadButton>

      {/* wrap destructured handleSubmit from react-hook-form around our own onSubmit --> handleSubmit from react-hook-form will provide the data argument for our own onSubmit */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full items-center gap-2 lg:gap-4"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message!"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-full bg-gray-600 p-2 transition hover:bg-gray-800"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
