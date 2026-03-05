import mongoose, { Schema } from 'mongoose';

export interface IItem {
  _id: string;
  name: string;
  date: Date;
}

export interface IList {
  _id: string;
  name: string;
  url: string;
  body?: string;
  items: IItem[];
  completedItems: IItem[];
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string | null;
  googleId?: string;
  facebookId?: string;
  gitHubId?: string;
  twitterXId?: string;
  lists: IList[];
  avatar?: string;
}

const itemsSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now }
});

const listSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  body: { type: String, required: false },
  items: [itemsSchema],
  completedItems: [itemsSchema]
});

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name!'],
    unique: false
  },
  email: {
    type: String,
    required: [true, 'Please provide an email!'],
    unique: true
  },
  password: {
    type: String,
    required: [
      function (this: IUser) {
        return (
          !this.googleId &&
          !this.facebookId &&
          !this.gitHubId &&
          !this.twitterXId
        );
      },
      'Please provide a password!'
    ],
    unique: false,
    default: null
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  },
  gitHubId: {
    type: String,
    unique: true,
    sparse: true
  },
  twitterXId: {
    type: String,
    unique: true,
    sparse: true
  },
  lists: [listSchema],
  avatar: {
    type: String,
    required: false,
    unique: false
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
