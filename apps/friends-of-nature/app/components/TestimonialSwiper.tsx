'use client';

import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';


const testimonials = [
  {
    id: 1,
    name: 'Emma Caldwell',
    color: '#1A5632',
    image: '/images/emma.png',
    testimonial:
      'Added a bird bath, some plants—wildlife showed up! Never knew conservation could be this fun!'
  },
  {
    id: 2,
    name: 'Jordan Reyes',
    color: '#9c4915',
    image: '/images/jordan.png',
    testimonial:
      'My backyard went from boring to a buzzing ecosystem. Watching wildlife on my garden cam is amazing!'
  },
  {
    id: 3,
    name: 'Lucas Bennett',
    color: '#95772A',
    image: '/images/lucas.png',
    testimonial:
      'Planted a few native flowers, and now my yard is full of butterflies and bees. It’s like a tiny nature reserve!'
  },
  {
    id: 4,
    name: 'Sophie Mitchell',
    color: '#9B445E',
    image: '/images/sophie.png',
    testimonial:
      'I swapped my lawn for wildflowers, and now birds and pollinators visit daily. Never thought a small change could make such a big impact!'
  }
];

const TestimonialSwiper = (): React.ReactNode => {
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
        slidesPerView={1.3}
        navigation={{
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev'
        }}
        breakpoints={{
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 8 }
        }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide
            key={testimonial.id}
            className="mb-10 flex !h-[450px] w-[85%]"
          >
            <div
              className="relative flex h-full flex-col justify-end rounded-t-2xl rounded-br-2xl border-2 shadow-md"
              style={{
                borderColor: testimonial.color,
                color: testimonial.color
              }}
            >
              {/* QUOTES SVG */}
              <svg
                className="mx-5"
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.3"
                  d="M18.5908 0.477051C22.0766 0.477051 24.1422 2.15053 24.1422 4.78026C24.1422 9.68113 17.1707 11.7132 16.0088 17.2117C21.6893 17.2117 26.5952 21.754 26.5952 28.4479C26.5952 34.6636 23.2385 41.4771 13.2976 41.4771C3.35667 41.4771 0 34.6636 0 27.0135C0 13.0281 9.68271 0.477051 18.5908 0.477051ZM50.9956 0.477051C54.3523 0.477051 56.547 2.15053 56.547 4.78026C56.547 9.68113 49.4464 11.7132 48.2845 17.2117C54.0941 17.2117 59 21.754 59 28.4479C59 34.6636 55.5142 41.4771 45.7024 41.4771C35.6324 41.4771 32.2757 34.6636 32.2757 27.0135C32.2757 13.0281 41.9584 0.477051 50.9956 0.477051Z"
                  fill={testimonial.color}
                />
              </svg>
              <div className="flex flex-col gap-4 p-5 text-white">
                <p
                  className="font-regular font-decoy text-xl"
                  style={{ color: testimonial.color }}
                >
                  {testimonial.testimonial}
                </p>
                <div className="flex flex-row items-center gap-4">
                  <Image
                    src={testimonial.image}
                    width={50}
                    height={50}
                    alt="placeholder"
                  />
                  <h3
                    className="font-regular w-2/3 font-decoy text-xl"
                    style={{ color: testimonial.color }}
                  >
                    {testimonial.name}
                  </h3>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialSwiper;
