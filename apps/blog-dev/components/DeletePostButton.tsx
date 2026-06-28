'use client';

import { deletePost } from '@/lib/actions/posts';
import { Trash2 } from 'lucide-react';

export default function DeletePostButton({ postId }: { postId: string }) {
  return (
    <button
      onClick={() => deletePost(postId)}
      className="text-muted cursor-pointer rounded-full p-2 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
      aria-label="Delete post"
    >
      <Trash2 size={14} />
    </button>
  );
}
