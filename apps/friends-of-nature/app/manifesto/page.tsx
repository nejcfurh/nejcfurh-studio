import type { AnalyticsClientPageEvent } from '@features/analytics/types.client';
import { PageVisitTracker } from '@shared-analytics/index';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import AnimatedDiv from '../components/AnimatedDiv';
import AnimatedText from '../components/AnimatedText';
import AnimatedTitle from '../components/AnimatedTitle';
import ManifestoCard from '../components/ManifestoCard';
import { PageName } from '../constants/data/page.data';


const manifestoCards = [
  {
    id: 0,
    name: 'Reverence for Life',
    color: '#F4A1BA',
    titleColor: '#9B445E',
    content:
      'We believe that nature is not merely a resource to be used but a vast, interconnected web of life. Each species, each ecosystem, and each natural process has intrinsic value and deserves respect. Our goal is to elevate the moral standing of nature and foster a sense of wonder for all living things, whether plants, animals, or entire ecosystems.',
    commitments: [
      'Cultivate a deep sense of gratitude for the natural world through education, exploration, and mindful living.',
      'Recognize and uphold the intrinsic value of non-human life in our decisions, policies, and interactions with the environment.'
    ]
  },
  {
    id: 1,
    name: 'Sustainable Stewardship',
    color: '#FC7E2F',
    titleColor: '#863E11',
    content:
      'We regard ourselves as caretakers of the Earth. We accept the moral responsibility to use Earth’s resources wisely—conserving rather than consuming, restoring rather than depleting. True sustainability balances societal needs with nature’s capacity to regenerate itself, ensuring that future generations have the same opportunities to flourish as we do.',
    commitments: [
      'Reduce waste, minimize resource consumption, and adopt regenerative practices at home, in our communities, and in industry.',
      'Advocate for responsible governance that safeguards ecosystems, protects endangered species, and prioritizes long-term sustainability over short-term gains.'
    ]
  },
  {
    id: 2,
    name: 'Harmony with Local and Global Communities',
    color: '#B4BD02',
    titleColor: '#1A5632',
    content:
      'Environmental challenges transcend borders. Forest depletion in one region affects climate patterns across the globe; pollution in one waterway impacts countless downstream ecosystems. Our vision embraces both local engagement and international collaboration, uniting people across cultures, languages, and national boundaries with the shared purpose of protecting our common home.',
    commitments: [
      'Nurture local relationships with the environment through green community initiatives, urban agriculture, and habitat restoration projects.',
      'Collaborate across regions and nations to share best practices, address pressing environmental threats, and build global networks of support and solidarity.'
    ]
  },
  {
    id: 3,
    name: 'Empowerment through Education',
    color: '#76A5D8',
    titleColor: '#396089',
    content:
      'We believe that knowledge is the bedrock of meaningful change. When people understand the importance of biodiversity, the fragility of ecosystems, and the consequences of human activity, they are inspired to take informed, decisive action. Education is our most powerful tool in cultivating environmental responsibility and igniting passion for a healthier future.',
    commitments: [
      'We believe that knowledge is the bedrock of meaningful change. When people understand the importance of biodiversity, the fragility of ecosystems, and the consequences of human activity, they are inspired to take informed, decisive action. Education is our most powerful tool in cultivating environmental responsibility and igniting passion for a healthier future.',
      'Provide accessible information about ecological challenges and sustainable solutions, transforming science and data into tangible, practical guidance for all.'
    ]
  },
  {
    id: 4,
    name: 'Ethical Innovation',
    color: '#FBB603',
    titleColor: '#95772A',
    content:
      'While technological progress and modernization have often strained the environment, we also recognize the potential for innovation to heal the Earth. Renewable energy, green technologies, and sustainable design can dramatically reduce humanity’s footprint and restore damaged habitats. We champion responsible science and engineering that place ecological integrity at the forefront.',
    commitments: [
      'Support research and development focused on renewable energies, sustainable agriculture, ecological restoration, and zero-waste manufacturing.',
      'Champion government policies and private-sector initiatives that encourage responsible innovation and penalize ecological harm.'
    ]
  },
  {
    id: 5,
    name: 'Inclusivity and Justice',
    color: '#F4A1BA',
    titleColor: '#9B445E',
    content:
      'Environmental challenges disproportionately affect marginalized and vulnerable communities, from low-income neighborhoods near industrial pollution to indigenous peoples confronting resource extraction in ancestral lands. True environmental progress requires a commitment to justice, ensuring all voices are heard and all communities benefit from a healthier planet.',
    commitments: [
      'Stand in solidarity with frontline communities most affected by ecological damage, recognizing that environmental stewardship and social justice are inseparable.',
      'Promote inclusive decision-making processes, ensuring that people of all backgrounds, cultures, and social statuses have a seat at the table.'
    ]
  },
  {
    id: 6,
    name: 'A Call to Action',
    color: '#B4BD02',
    titleColor: '#1A5632',
    content:
      'No single organization, government, or individual can solve the challenges we face alone. Real and lasting progress requires collective effort and a willingness to transform our lifestyles, economies, and systems of governance. Each and every one of us can be an agent of positive change, whether through grassroots activism, responsible consumption, creative innovation, or civic engagement.',
    commitments: [
      'Use our voices, our votes, and our everyday choices to champion policies and practices that safeguard nature’s balance.',
      'Build global partnerships and local networks, share resources and successes, and celebrate the diverse solutions that arise from collaborative environmental action.'
    ]
  }
];

const Manifesto = (): React.ReactNode => {
  return (
    <div className="h-full w-full bg-[#1A5632]">
      <div className="h-full w-full rounded-b-3xl bg-[#F0E5B2] md:px-56">
        <div className="flex h-full flex-col items-center justify-center">
          {/* TITLE IMAGE */}
          <AnimatedDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 0 }}
            className="mt-10 w-1/3 md:w-[15%]"
          >
            <Image
              src="/images/friends-of-nature-green-logo.png"
              width={600}
              height={600}
              alt="Friends of Nature"
            />
          </AnimatedDiv>
          <AnimatedDiv
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0 }}
            className="mt-10 flex w-full flex-row items-center justify-start gap-5 px-5"
          >
            <Link
              href="/"
              className="transition-all duration-300 ease-in-out no-tap-highlight hover:opacity-60"
            >
              <div className="rounded-full border-2 border-[#1A5632] p-3">
                <ArrowLeft size={28} color="#1A5632" />
              </div>
            </Link>
            {/* TITLE ON DESKTOP */}
            <AnimatedTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="hidden w-full px-5 font-decoy text-[40px] text-[#1A5632] md:block"
            >
              Friends of Nature Manifesto
              <span className="mx-3 inline-block align-middle">
                <svg
                  width="32"
                  height="35"
                  viewBox="0 0 32 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.754 23.6315C10.3649 22.685 6.3929 22.7783 4.73965 22.4771C2.82387 22.1283 0.731592 21.3252 0.241806 19.2678C-0.0266406 18.1404 0.560991 16.9582 1.66491 16.6035C2.63655 16.2913 3.31133 16.8481 3.98862 17.3141C6.25208 18.8701 8.95216 19.5876 11.6616 20.1452C12.7254 20.3643 13.6771 19.4319 13.4621 18.3687C13.1658 16.901 11.9959 15.5021 10.6295 14.7422C8.61038 13.6204 6.22697 13.3672 4.09167 12.4865C3.35627 12.1834 2.61789 11.7751 2.20199 11.0974C1.52273 9.99219 1.96604 8.43554 2.97573 7.61987C3.98541 6.8042 5.40172 6.64065 6.67505 6.89468C9.84435 7.52637 12.2581 10.4016 15.241 11.3903C16.24 11.7217 17.1573 10.7458 16.7538 9.77476C15.7368 7.32228 11.9819 5.25777 12.6405 2.5004C13.1162 0.507975 15.9497 -0.164332 17.6515 0.978624C19.3523 2.12216 19.9642 4.39066 19.7901 6.43197C19.6827 7.68864 19.3421 9.01595 19.8613 10.1656C20.5084 11.5989 22.2492 12.1814 23.8196 12.2719C25.3899 12.3624 27.0067 12.1227 28.5114 12.5826C30.0164 13.0417 31.3849 14.5657 30.9301 16.0705C30.695 16.8478 30.0245 17.4301 29.2866 17.7701C26.123 19.2263 22.6981 16.7798 19.2268 16.1196C18.3254 15.9482 17.4888 16.6281 17.4817 17.5453C17.4692 19.1322 18.6786 20.8035 20.3173 20.8853C21.0501 20.9218 21.7683 20.6979 22.4969 20.6084C25.1619 20.2809 28.1702 22.5043 27.7555 25.1547C27.4063 27.3859 24.8789 28.7308 22.6235 28.5792C20.7781 28.4556 19.0918 27.6041 17.4907 26.6408C16.9174 26.2956 16.1769 26.551 15.9195 27.1683C15.0335 29.2942 15.3976 31.6337 15.0324 33.9016C14.9999 34.1022 14.8014 34.2311 14.6054 34.1776C13.6824 33.9225 12.5702 33.6235 10.7492 33.1278C10.5979 33.0865 10.5146 32.9244 10.5691 32.7777C11.042 31.5113 12.138 26.008 12.3036 25.3127C12.4648 24.6368 12.3592 24.0419 11.755 23.6309L11.754 23.6315Z"
                    fill="#B4BD02"
                  />
                </svg>
              </span>{' '}
            </AnimatedTitle>
          </AnimatedDiv>
        </div>
        {/* TITLE */}
        <AnimatedTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-8 w-full px-5 font-decoy text-[40px] text-[#1A5632] md:hidden md:text-center"
        >
          Friends of Nature Manifesto
          <span className="mx-3 inline-block align-middle">
            <svg
              width="32"
              height="35"
              viewBox="0 0 32 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.754 23.6315C10.3649 22.685 6.3929 22.7783 4.73965 22.4771C2.82387 22.1283 0.731592 21.3252 0.241806 19.2678C-0.0266406 18.1404 0.560991 16.9582 1.66491 16.6035C2.63655 16.2913 3.31133 16.8481 3.98862 17.3141C6.25208 18.8701 8.95216 19.5876 11.6616 20.1452C12.7254 20.3643 13.6771 19.4319 13.4621 18.3687C13.1658 16.901 11.9959 15.5021 10.6295 14.7422C8.61038 13.6204 6.22697 13.3672 4.09167 12.4865C3.35627 12.1834 2.61789 11.7751 2.20199 11.0974C1.52273 9.99219 1.96604 8.43554 2.97573 7.61987C3.98541 6.8042 5.40172 6.64065 6.67505 6.89468C9.84435 7.52637 12.2581 10.4016 15.241 11.3903C16.24 11.7217 17.1573 10.7458 16.7538 9.77476C15.7368 7.32228 11.9819 5.25777 12.6405 2.5004C13.1162 0.507975 15.9497 -0.164332 17.6515 0.978624C19.3523 2.12216 19.9642 4.39066 19.7901 6.43197C19.6827 7.68864 19.3421 9.01595 19.8613 10.1656C20.5084 11.5989 22.2492 12.1814 23.8196 12.2719C25.3899 12.3624 27.0067 12.1227 28.5114 12.5826C30.0164 13.0417 31.3849 14.5657 30.9301 16.0705C30.695 16.8478 30.0245 17.4301 29.2866 17.7701C26.123 19.2263 22.6981 16.7798 19.2268 16.1196C18.3254 15.9482 17.4888 16.6281 17.4817 17.5453C17.4692 19.1322 18.6786 20.8035 20.3173 20.8853C21.0501 20.9218 21.7683 20.6979 22.4969 20.6084C25.1619 20.2809 28.1702 22.5043 27.7555 25.1547C27.4063 27.3859 24.8789 28.7308 22.6235 28.5792C20.7781 28.4556 19.0918 27.6041 17.4907 26.6408C16.9174 26.2956 16.1769 26.551 15.9195 27.1683C15.0335 29.2942 15.3976 31.6337 15.0324 33.9016C14.9999 34.1022 14.8014 34.2311 14.6054 34.1776C13.6824 33.9225 12.5702 33.6235 10.7492 33.1278C10.5979 33.0865 10.5146 32.9244 10.5691 32.7777C11.042 31.5113 12.138 26.008 12.3036 25.3127C12.4648 24.6368 12.3592 24.0419 11.755 23.6309L11.754 23.6315Z"
                fill="#B4BD02"
              />
            </svg>
          </span>{' '}
        </AnimatedTitle>
        <AnimatedText
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-10 px-5 font-archivo text-xl text-[#1e1e1e]/75 md:text-2xl"
        >
          We, the Friends of Nature, stand united by our shared reverence for
          the living world and our unwavering commitment to protect, nurture,
          and celebrate the beauty of our planet. Guided by empathy,
          responsibility, and collective action, we strive to live in harmony
          with nature and all its creatures. In an age when human activity
          profoundly impacts the Earth’s delicate balance, we believe that
          caring for our world is not simply an option but an obligation—one
          that binds every individual, community, and nation. This manifesto
          sets forth the guiding principles and commitments that define us as
          Friends of Nature.
        </AnimatedText>
        <div className="mt-10 flex w-full flex-col gap-5 px-5 md:items-center">
          {manifestoCards.map((card) => (
            <AnimatedDiv
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 0 }}
            >
              <ManifestoCard
                index={card.id}
                name={card.name}
                titleColor={card.titleColor}
                color={card.color}
                content={card.content}
                commitments={card.commitments}
              />
            </AnimatedDiv>
          ))}
        </div>
        <AnimatedTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-10 w-full px-5 font-decoy text-[40px] font-bold text-[#1A5632] md:text-center"
        >
          Conclusion
        </AnimatedTitle>
        <AnimatedText
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-20 mt-5 px-5 font-archivo text-xl text-[#1e1e1e]/75 md:pb-20 md:text-2xl"
        >
          We, the Friends of Nature, stand united by our shared reverence for
          the living world and our unwavering commitment to protect, nurture,
          and celebrate the beauty of our planet. Guided by empathy,
          responsibility, and collective action, we strive to live in harmony
          with nature and all its creatures. In an age when human activity
          profoundly impacts the Earth’s delicate balance, we believe that
          caring for our world is not simply an option but an obligation—one
          that binds every individual, community, and nation. This manifesto
          sets forth the guiding principles and commitments that define us as
          Friends of Nature.
        </AnimatedText>
      </div>
      {/* FOOTER MOBILE */}
      <footer className="mt-20 flex h-full flex-col items-center justify-center md:hidden">
        <div className="w-1/3 md:w-1/6">
          <Image
            src="/images/friends-of-nature-footer.png"
            width={600}
            height={600}
            alt="Friends of Nature"
          />
        </div>
        {/* SOCIAL MEDIA LINKS */}
        <div className="mt-10 flex flex-row gap-20">
          {/* INSTAGRAM */}
          <Link
            href="https://www.instagram.com/wearefriendsofnature/"
            target="_blank"
            className="transition-all duration-300 ease-in-out no-tap-highlight hover:opacity-60"
          >
            <Image
              src="/images/instagram.png"
              alt="instagram social link"
              width={30}
              height={30}
            />
          </Link>
          {/* FACEBOOK */}
          <Link
            href="https://www.facebook.com/profile.php?id=61574106477241"
            target="_blank"
            className="transition-all duration-300 ease-in-out no-tap-highlight hover:opacity-60"
          >
            <Image
              src="/images/facebook.png"
              alt="facebook social link"
              width={30}
              height={30}
            />
          </Link>
          {/* TIK TOK */}
          <Link
            href="https://www.tiktok.com/@wearefriendsofnature"
            target="_blank"
            className="transition-all duration-300 ease-in-out no-tap-highlight hover:opacity-60"
          >
            <Image
              src="/images/tiktok.png"
              alt="tiktok social link"
              width={30}
              height={30}
            />
          </Link>
        </div>
        <AnimatedText
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0 }}
          className="my-10 text-white/50"
        >
          © 2025 Friends of Nature. All Rights Reserved.
        </AnimatedText>
      </footer>
      {/* FOOTER DESKTOP */}
      <footer className="mt-20 hidden h-full flex-row items-center justify-between px-16 pb-10 md:flex">
        <AnimatedText
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0 }}
          className="my-10 text-white/50"
        >
          © 2025 Friends of Nature. <br /> All Rights Reserved.
        </AnimatedText>
        <div className="w-1/3 md:w-[10%]">
          <Image
            src="/images/friends-of-nature-footer.png"
            width={600}
            height={600}
            alt="Friends of Nature"
          />
        </div>
        {/* SOCIAL MEDIA LINKS */}
        <div className="mb-10 mt-10 flex flex-row items-center gap-16">
          {/* INSTAGRAM */}
          <Link
            href="https://www.instagram.com/wearefriendsofnature/"
            target="_blank"
            className="transition-all duration-300 ease-in-out no-tap-highlight hover:opacity-60"
          >
            <Image
              src="/images/instagram.png"
              alt="instagram social link"
              width={30}
              height={30}
            />
          </Link>
          {/* FACEBOOK */}
          <Link
            href="https://www.facebook.com/profile.php?id=61574106477241"
            target="_blank"
            className="transition-all duration-300 ease-in-out no-tap-highlight hover:opacity-60"
          >
            <Image
              src="/images/facebook.png"
              alt="facebook social link"
              width={30}
              height={30}
            />
          </Link>
          {/* TIK TOK */}
          <Link
            href="https://www.tiktok.com/@wearefriendsofnature"
            target="_blank"
            className="transition-all duration-300 ease-in-out no-tap-highlight hover:opacity-60"
          >
            <Image
              src="/images/tiktok.png"
              alt="tiktok social link"
              width={30}
              height={30}
            />
          </Link>
        </div>
      </footer>
      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.FRIENDS_OF_NATURE_MANIFESTO
        }}
      />
    </div>
  );
};

export default Manifesto;
