'use client';

import { createPost } from '@/lib/actions/posts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const composeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  content: z.string().min(1, 'Post content is required'),
  imageLink: z.string().optional()
});

type ComposeFormData = z.infer<typeof composeSchema>;

export default function ComposeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ComposeFormData>({
    resolver: zodResolver(composeSchema)
  });

  const onSubmit = async (data: ComposeFormData) => {
    const formData = new FormData();
    formData.set('title', data.title);
    formData.set('author', data.author);
    formData.set('content', data.content);
    formData.set('imageLink', data.imageLink || '');
    await createPost(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <label className="mb-2 block text-sm font-medium">Title</label>
        <input
          {...register('title')}
          placeholder="Give your post a title..."
          className="border-border focus:border-foreground w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors focus:ring-0 focus:outline-none"
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Author</label>
        <input
          {...register('author')}
          placeholder="Who is writing this?"
          className="border-border focus:border-foreground w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors focus:ring-0 focus:outline-none"
        />
        {errors.author && (
          <p className="mt-1.5 text-xs text-red-500">{errors.author.message}</p>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Content</label>
        <textarea
          {...register('content')}
          rows={8}
          placeholder="Write your post content..."
          className="border-border focus:border-foreground w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors focus:ring-0 focus:outline-none"
        />
        {errors.content && (
          <p className="mt-1.5 text-xs text-red-500">
            {errors.content.message}
          </p>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">
          Cover image URL{' '}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <input
          {...register('imageLink')}
          placeholder="https://example.com/image.jpg"
          className="border-border focus:border-foreground w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors focus:ring-0 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-accent text-accent-foreground cursor-pointer self-start rounded-full px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? 'Publishing...' : 'Publish post'}
      </button>
    </form>
  );
}
