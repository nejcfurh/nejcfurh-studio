'use server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import type { IList } from '@/lib/models/user';
import { revalidatePath } from 'next/cache';

export async function getLists(): Promise<IList[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) throw new Error('User not found');

  return JSON.parse(JSON.stringify(user.lists || []));
}

export async function addCard(formData: {
  listName: string;
  listImg: string;
  listBody: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const { listName, listImg, listBody } = formData;

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) throw new Error('User not found');

  user.lists.push({
    name: listName,
    url: listImg,
    body: listBody,
    items: [],
    completedItems: []
  });
  await user.save();

  revalidatePath('/todos');
  return JSON.parse(JSON.stringify(user.lists));
}

export async function deleteCard(listId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) throw new Error('User not found');

  const listIndex = user.lists.findIndex(
    (list: IList) => list._id.toString() === listId
  );
  if (listIndex === -1) throw new Error('List not found');

  const imageName = extractImageName(user.lists[listIndex].url);
  user.lists.splice(listIndex, 1);
  await user.save();

  revalidatePath('/todos');
  return {
    lists: JSON.parse(JSON.stringify(user.lists)),
    image: imageName
  };
}

export async function updateCard(data: {
  listId: string;
  listName: string;
  listBody: string;
  listImg: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const { listId, listName, listBody, listImg } = data;

  await connectDB();
  await User.updateOne(
    { _id: session.user.id, 'lists._id': listId },
    {
      $set: {
        'lists.$.name': listName,
        'lists.$.body': listBody,
        'lists.$.url': listImg
      }
    }
  );

  const updatedUser = await User.findById(session.user.id);
  revalidatePath('/todos');
  return JSON.parse(JSON.stringify(updatedUser.lists));
}

export async function addItem(listName: string, newItem: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  await User.updateOne(
    { _id: session.user.id, 'lists.name': listName },
    { $push: { 'lists.$.items': { name: newItem } } }
  );

  const updatedUser = await User.findById(session.user.id);
  revalidatePath('/todos');
  return JSON.parse(JSON.stringify(updatedUser.lists));
}

export async function completeItem(listName: string, itemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  const user = await User.findOne({
    _id: session.user.id,
    'lists.name': listName
  });
  if (!user) throw new Error('List not found');

  const list = user.lists.find((l: IList) => l.name === listName);
  const itemIndex = list.items.findIndex(
    (item: { _id: { toString: () => string } }) =>
      item._id.toString() === itemId
  );

  if (itemIndex === -1) throw new Error('Task not found');

  const [completedItem] = list.items.splice(itemIndex, 1);
  completedItem.date = new Date();
  list.completedItems.push(completedItem);

  await user.save();
  revalidatePath('/todos');
  return JSON.parse(JSON.stringify(user.lists));
}

export async function deleteCompletedItem(listName: string, itemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await connectDB();
  const user = await User.findOne({
    _id: session.user.id,
    'lists.name': listName
  });
  if (!user) throw new Error('List not found');

  const list = user.lists.find((l: IList) => l.name === listName);
  const itemIndex = list.completedItems.findIndex(
    (item: { _id: { toString: () => string } }) =>
      item._id.toString() === itemId
  );

  if (itemIndex === -1) throw new Error('Task not found');

  list.completedItems.splice(itemIndex, 1);
  await user.save();

  revalidatePath('/todos');
  return JSON.parse(JSON.stringify(user.lists));
}

function extractImageName(url: string) {
  const parts = url.split('/');
  return parts[parts.length - 1];
}
