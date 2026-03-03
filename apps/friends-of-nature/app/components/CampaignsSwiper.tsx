'use client';

import { ArrowLeftIcon, ArrowRightIcon, MapPin } from 'lucide-react';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { cn } from 'lib/utils';

import AnimatedDiv from './AnimatedDiv';


const campaigns = [
  {
    id: 1,
    title: 'Sarah and Friends',
    location: 'Austin, TX',
    image: '/images/friends-garden-campaign.png',
    description:
      'Want to create a pond for birds to support local wildlife, provide a peaceful oasis, and promote biodiversity.',
    votes: 102,
    goal: 1500
  },
  {
    id: 2,
    title: 'Green Oasis Project',
    location: 'Seattle, WA',
    image: '/images/friends-garden-campaign.png',
    description:
      'A community effort to plant trees and flowers to combat urban heat and pollution.',
    votes: 984,
    goal: 2000
  },
  {
    id: 3,
    title: 'Butterfly Haven',
    location: 'San Diego, CA',
    image: '/images/friends-garden-campaign.png',
    description:
      'Creating a dedicated butterfly garden to support pollinators and protect endangered butterfly species.',
    votes: 456,
    goal: 1800
  },
  {
    id: 4,
    title: 'Urban Farming Hub',
    location: 'New York, NY',
    image: '/images/friends-garden-campaign.png',
    description:
      'Transforming abandoned city lots into urban farms to provide fresh produce for low-income communities.',
    votes: 732,
    goal: 2500
  },
  {
    id: 5,
    title: 'Coastal Cleanup Initiative',
    location: 'Miami, FL',
    image: '/images/friends-garden-campaign.png',
    description:
      'Organizing regular cleanups to remove plastic waste from beaches and protect marine wildlife.',
    votes: 1200,
    goal: 3000
  },
  {
    id: 6,
    title: 'Rewilding the Forest',
    location: 'Denver, CO',
    image: '/images/friends-garden-campaign.png',
    description:
      'Restoring deforested areas by planting native trees and reintroducing local wildlife habitats.',
    votes: 845,
    goal: 2200
  }
];

const CampaignsSwiper = (): React.ReactNode => {
  return (
    <div className="relative min-h-full w-full md:px-10">
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        autoHeight={false}
        centeredSlides
        loop
        rewind={false}
        watchSlidesProgress
        slidesPerView={1.35}
        navigation={{
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev'
        }}
        breakpoints={{
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 8 }
        }}
      >
        {campaigns.map((campaign) => (
          <SwiperSlide
            key={campaign.id}
            className="mb-10 flex !h-[500px] w-[85%]"
          >
            <div className="relative h-full rounded-3xl bg-[#396089] shadow-md">
              <div className="relative">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  width={400}
                  height={400}
                  className="object-cover"
                />
                <div className="absolute left-3 top-3 flex flex-row items-center justify-center gap-2 rounded-full bg-gray-500/80 px-2 font-archivo text-sm text-white">
                  <MapPin size={14} />{' '}
                  <span className="mt-1">{campaign.location}</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-5 text-white">
                <h3 className="font-regular w-2/3 font-decoy text-3xl">
                  {campaign.title}
                </h3>
                <p className="font-work-sans text-sm opacity-80">
                  {campaign.description}
                </p>
              </div>
              <div className="absolute bottom-0 h-10 w-full overflow-hidden rounded-b-3xl bg-[#76A5D8A6]/50 md:mt-10 md:w-1/2">
                <div className="absolute inset-0 flex items-center justify-start px-5">
                  <span className="text-sm text-black">
                    <strong>{campaign.votes}</strong> / {campaign.goal} votes to
                    get funded
                  </span>
                </div>
                <AnimatedDiv
                  className={cn(
                    'h-10 rounded-br-3xl rounded-tr-3xl bg-[#B4BD02]'
                  )}
                  initial={{ width: '10%', opacity: 1 }}
                  whileInView={{
                    width: `${(campaign.votes / campaign.goal) * 100}%`
                  }}
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{
                    width: { duration: 1.5, ease: 'easeOut' }
                  }}
                  viewport={{ once: true }}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button
        type="button"
        className="swiper-prev absolute left-7 top-[40%] z-20 -translate-y-1/2 rounded-full bg-[#618ec6ba] p-3 text-white shadow-md"
      >
        <ArrowLeftIcon size={24} />
      </button>
      <button
        type="button"
        className="swiper-next absolute right-7 top-[40%] z-20 -translate-y-1/2 rounded-full bg-[#618ec6ba] p-3 text-white shadow-md"
      >
        <ArrowRightIcon size={24} />
      </button>

      {/* Discover More Button */}
      <div className="text-center">
        <button
          type="button"
          className="rounded-full border-2 border-[#F0E5B2] border-opacity-50 px-6 py-3 text-lg font-semibold text-[#F0E5B2]"
        >
          Discover all Campaigns
        </button>
      </div>
    </div>
  );
};

export default CampaignsSwiper;
