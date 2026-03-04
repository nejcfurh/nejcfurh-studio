'use client';

import { deletePost } from '@/lib/actions/posts';
import { Trash2 } from 'lucide-react';

export default function DeletePostButton({ postId }: { postId: string }) {
  return (
    <button
      onClick={() => deletePost(postId)}
      className="text-muted cursor-pointer rounded-full p-2 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
      aria-label="Delete post"
    >
      <Trash2 size={14} />
    </button>
  );
}
