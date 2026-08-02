'use client';

import { createPost } from '@/lib/actions/posts';
import { composeSchema, type ComposeFormData } from '@/lib/schemas/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { applyActionResult } from '@repo/ui/forms';
import { useForm } from 'react-hook-form';

export default function ComposeForm() {
  const form = useForm<ComposeFormData>({
    resolver: zodResolver(composeSchema),
    defaultValues: { title: '', author: '', content: '', imageLink: '' }
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = form;

  const onSubmit = async (data: ComposeFormData) => {
    form.clearErrors('root');

    try {
      const result = await createPost(data);
      applyActionResult(form, result);
    } catch {
      form.setError('root', {
        message: 'Could not publish the post. Please try again.'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <label
          htmlFor="title"
          className="text-white-100 mb-2 block text-sm font-medium"
        >
          Title
        </label>
        <input
          id="title"
          {...register('title')}
          placeholder="Give your post a title..."
          className="form-input"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p
            id="title-error"
            role="alert"
            className="mt-1.5 text-xs text-red-500"
          >
            {errors.title.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="author"
          className="text-white-100 mb-2 block text-sm font-medium"
        >
          Author
        </label>
        <input
          id="author"
          {...register('author')}
          placeholder="Who is writing this?"
          className="form-input"
          aria-invalid={!!errors.author}
          aria-describedby={errors.author ? 'author-error' : undefined}
        />
        {errors.author && (
          <p
            id="author-error"
            role="alert"
            className="mt-1.5 text-xs text-red-500"
          >
            {errors.author.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="content"
          className="text-white-100 mb-2 block text-sm font-medium"
        >
          Content
        </label>
        <textarea
          id="content"
          {...register('content')}
          rows={8}
          placeholder="Write your post content..."
          className="form-input"
          aria-invalid={!!errors.content}
          aria-describedby={errors.content ? 'content-error' : undefined}
        />
        {errors.content && (
          <p
            id="content-error"
            role="alert"
            className="mt-1.5 text-xs text-red-500"
          >
            {errors.content.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="imageLink"
          className="text-white-100 mb-2 block text-sm font-medium"
        >
          Cover image URL{' '}
          <span className="text-secondary font-normal">(optional)</span>
        </label>
        <input
          id="imageLink"
          {...register('imageLink')}
          placeholder="https://example.com/image.jpg"
          className="form-input"
          aria-invalid={!!errors.imageLink}
          aria-describedby={errors.imageLink ? 'imageLink-error' : undefined}
        />
        {errors.imageLink && (
          <p
            id="imageLink-error"
            role="alert"
            className="mt-1.5 text-xs text-red-500"
          >
            {errors.imageLink.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p role="alert" className="text-sm text-red-500">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-accent cursor-pointer self-start rounded-full px-8 py-3 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_25px_var(--accent-glow)] active:scale-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {isSubmitting ? 'Publishing...' : 'Publish post'}
      </button>
    </form>
  );
}
