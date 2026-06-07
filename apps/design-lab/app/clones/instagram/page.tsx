import BackButton from '@/components/buttons/BackButton';
import BookmarkIcon from '@/features/clones/instagram/components/BookmarkIcon';
import CommentIcon from '@/features/clones/instagram/components/CommentIcon';
import HeartIcon from '@/features/clones/instagram/components/HeartIcon';
import ShareIcon from '@/features/clones/instagram/components/ShareIcon';
import {
  INSTAGRAM_POSTS,
  INSTAGRAM_STORIES,
  INSTAGRAM_SUGGESTIONS
} from '@/features/clones/instagram/constants';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Instagram Clone | Design Lab',
  description: 'Instagram Clone page with Tailwind CSS.'
};

export default function InstagramClonePage() {
  return (
    <div className="bg-white text-black">
      <BackButton className="fixed z-40 border-2 border-black bg-white backdrop-blur-sm" />

      {/* HEADER */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-4 flex h-24 items-center justify-between xl:mx-auto xl:max-w-6xl">
          {/* LEFT - LOGO */}
          <div className="hidden w-24 cursor-pointer lg:inline-grid">
            <Image
              className="ml-3 scale-125"
              src="https://cdn2.downdetector.com/static/uploads/logo/Instagram_Logo_Large.png"
              alt="instagram-logo"
              width={96}
              height={28}
            />
          </div>
          <div className="w-11 cursor-pointer lg:hidden">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Instagram-Icon.png/800px-Instagram-Icon.png"
              alt="instagram-icon"
              width={44}
              height={44}
            />
          </div>
          {/* MIDDLE - SEARCH */}
          <div className="relative mx-2 mt-1 max-w-[220px] min-w-0 flex-1 sm:mx-0 sm:max-w-none sm:flex-none">
            <div className="absolute top-2 left-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <input
              placeholder="Search..."
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 text-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none"
              type="text"
            />
          </div>
          {/* RIGHT - ICONS */}
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="hidden h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-125 md:inline-flex"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-125"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <Image
              className="cursor-pointer rounded-full"
              src="https://instagram.fmbx3-1.fna.fbcdn.net/v/t51.2885-19/29738893_1674362152653728_8788898698584129536_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fmbx3-1.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2gFbJUI3SAQ-8P-pqIjDpysc8XxYABz5fkAG39BG-U8SE-9sOXsLXEYk3GL-DaiXrk0&_nc_ohc=qa9QchLiLOoQ7kNvwFFzbig&_nc_gid=RM7g-bWDnTFl2GWFP9G7Fw&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfyZSzi4iaLX5mAX3-ofgwtCZ0s7iBzsn1y44jGRwFjTBw&oe=69C31F10&_nc_sid=7a9f4b"
              alt="user"
              width={40}
              height={40}
            />
          </div>
        </div>
      </div>

      {/* FEED*/}
      <main className="mx-auto grid grid-cols-1 md:max-w-6xl md:grid-cols-3">
        <section className="md:col-span-2">
          {/* STORIES */}
          <div className="scrollbar-none flex space-x-2 overflow-x-scroll rounded-sm border border-gray-200 p-4 sm:p-6">
            {INSTAGRAM_STORIES.map((story) => (
              <div key={story.name} className="group relative cursor-pointer">
                <Image
                  className="rounded-full border-2 border-violet-700 p-[1.5px] transition-transform duration-200 ease-out group-hover:scale-110"
                  src={story.img}
                  alt={story.name}
                  width={56}
                  height={56}
                />
                {story.isUser && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="absolute top-4 left-4 h-6 w-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                )}
                <p className="w-14 truncate text-center text-xs">
                  {story.name}
                </p>
              </div>
            ))}
          </div>

          {/* POSTS */}
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.user + post.caption}
              className="my-7 rounded-md border border-gray-200 bg-white"
            >
              {/* POST HEADER */}
              <div className="flex items-center p-5">
                <Image
                  className="mr-3 rounded-full border border-gray-200 p-1"
                  src={post.avatar}
                  alt={post.user}
                  width={48}
                  height={48}
                />
                <p className="flex-1 font-bold">{post.user}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </div>
              {/* POST IMAGE */}
              <Image
                className="w-full object-contain"
                src={post.image}
                alt="post"
                width={1296}
                height={864}
              />
              {/* POST BUTTONS */}
              <div className="flex justify-between px-4 pt-4">
                <div className="flex items-center space-x-4">
                  <HeartIcon filled={post.liked} />
                  <CommentIcon />
                  <ShareIcon />
                </div>
                <BookmarkIcon filled={post.saved} />
              </div>
              {/* CAPTION */}
              <p className="truncate p-5">
                {post.likes && (
                  <>
                    <span className="font-bold">{post.likes}</span>
                    <br />
                  </>
                )}
                <span className="mr-2 font-bold">{post.user}</span>
                {post.caption}
              </p>
              {/* COMMENTS */}
              <div className="scrollbar-none relative mx-4 max-h-28 overflow-y-scroll">
                {post.comments.map((comment) => (
                  <div
                    key={comment.user + comment.text}
                    className="mb-2 flex items-center space-x-2"
                  >
                    <Image
                      className="rounded-full object-cover"
                      src={comment.img}
                      alt={comment.user}
                      width={28}
                      height={28}
                    />
                    <p className="font-semibold">{comment.user}</p>
                    <p className="flex-1 truncate">{comment.text}</p>
                    <p>{comment.time}</p>
                  </div>
                ))}
              </div>
              {/* INPUT */}
              <form className="flex items-center p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                  />
                </svg>
                <input
                  className="flex-1 border-none bg-transparent focus:ring-0 focus:outline-none"
                  type="text"
                  placeholder="Enter your comment here..."
                />
                <button className="font-bold text-blue-400">Post</button>
              </form>
            </div>
          ))}
        </section>

        {/* RIGHT SIDEBAR */}
        <section className="hidden md:col-span-1 md:inline-grid">
          <div className="fixed w-[380px]">
            {/* MINI PROFILE */}
            <div className="mt-14 ml-10 flex items-center justify-between">
              <Image
                className="rounded-full border border-gray-200 p-[2px]"
                src="https://instagram.fmbx3-1.fna.fbcdn.net/v/t51.2885-19/29738893_1674362152653728_8788898698584129536_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fmbx3-1.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2gEZ2AgUCSGqf8h_cbX7I9kQ6ILo6mVD8yzh6BW3yKtkh_7GxhOxb9QFUx_OYPciJe4&_nc_ohc=ux76tjNqoRoQ7kNvwGEVHMS&_nc_gid=3W5AviYUyreuocFdHF2JIg&edm=APoiHPcBAAAA&ccb=7-5&oh=00_Af9cuGh2OpboTwwzeR3nzA2m3PekSpwPnmLi9INtXrB8EA&oe=6A2A9CD0&_nc_sid=22de04"
                alt="user"
                width={64}
                height={64}
              />
              <div className="ml-4 flex-1">
                <h2 className="font-bold">nejcfurh</h2>
                <h3 className="text-sm text-gray-400">Welcome to IG Clone</h3>
              </div>
              <button className="text-sm font-semibold text-blue-400">
                Sign out
              </button>
            </div>
            {/* SUGGESTIONS */}
            <div className="mt-4 ml-10">
              <div className="mb-5 flex justify-between text-sm">
                <h3 className="font-bold text-gray-400">Suggestions for you</h3>
                <button className="font-semibold text-gray-600">See all</button>
              </div>
              {INSTAGRAM_SUGGESTIONS.map((s) => (
                <div
                  key={s.name}
                  className="mt-3 flex items-center justify-between"
                >
                  <Image
                    className="rounded-full border border-gray-200 p-[2px]"
                    src={s.img}
                    alt={s.name}
                    width={40}
                    height={40}
                  />
                  <div className="ml-4 flex-1">
                    <h2 className="text-sm font-semibold">{s.name}</h2>
                    <h3 className="text-sm text-gray-400">{s.role}</h3>
                  </div>
                  <button className="text-sm font-semibold text-blue-400">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
