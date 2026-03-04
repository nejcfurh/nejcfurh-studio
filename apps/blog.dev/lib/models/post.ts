import mongoose, { Schema } from 'mongoose';

export interface IPost {
  _id: string;
  title: string;
  content: string;
  date: number;
  author: string;
  imageLink: string;
}

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Number, required: true },
  author: { type: String, required: true },
  imageLink: { type: String, default: '' }
});

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
