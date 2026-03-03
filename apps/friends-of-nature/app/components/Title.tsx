'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import AnimatedText from 'app/components/AnimatedText';

import AnimatedDiv from './AnimatedDiv';


const Title = (): React.ReactNode => {
  const wordRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  const words = ['beautiful', 'easy', 'rewarding'];

  useEffect(() => {
    const animateInterval = setInterval((): void => {
      setIsVisible(true);
    }, 750);

    return (): void => {
      clearInterval(animateInterval);
    };
  }, []);

  useEffect(() => {
    const changeWordInterval = setInterval((): void => {
      setWordIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);

    return (): void => {
      clearInterval(changeWordInterval);
    };
  }, []);

  return (
    <div className="mt-10 flex w-full items-center justify-center px-5 md:w-2/3">
      <div className="text-center leading-tight text-[#F0E5B2] md:pl-20 md:text-left">
        <AnimatedText
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="font-decoy text-3xl md:text-8xl"
        >
          Conservation{' '}
          <span className="mx-1 inline-block align-middle md:scale-150">
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.4375 10.4273C13.9375 11.6008 14.7721 12.9397 15.6485 13.871C13.4368 11.5211 10.1468 10.0935 6.94234 10.5249C4.69983 10.8265 2.57971 12.1217 1.30403 13.996C-0.409843 16.5138 0.380245 19.2879 2.34641 21.4454C4.54522 23.8583 7.45808 24.1392 10.5029 24.499C10.8626 27.5438 11.1435 30.4566 13.5565 32.6554C15.7139 34.6216 18.488 35.4117 21.0058 33.6978C22.8801 32.4221 24.1758 30.3016 24.4769 28.0595C24.9079 24.8555 23.4802 21.5655 21.1308 19.3533C22.0626 20.2302 23.4006 21.0648 24.5745 21.5644C25.9298 22.1418 27.4176 22.3914 28.8885 22.3632C30.2675 22.3365 31.8634 22.0628 32.8701 21.0314C33.9047 19.9713 34.4996 18.4146 34.3144 16.9354C34.094 15.1785 32.8506 13.6843 31.3602 12.732C29.9204 11.812 28.2566 11.3196 26.6106 10.8523C27.467 11.0169 28.4009 10.0848 28.1477 9.2221C27.9654 8.59959 27.2444 8.28308 26.6201 8.38176C26.7188 7.75748 26.4023 7.03648 25.7798 6.85416C24.9166 6.60137 23.984 7.53482 24.1495 8.39129C23.6827 6.7448 23.1898 5.08144 22.2698 3.64167C21.3175 2.15124 19.8238 0.907407 18.0664 0.68744C16.5872 0.502252 15.0301 1.09667 13.9704 2.13174C12.9391 3.13845 12.6653 4.73438 12.6387 6.11338C12.6105 7.58422 12.8601 9.07202 13.4375 10.4273Z"
                fill="#F4A1BA"
              />
            </svg>
          </span>{' '}
          Starts in{' '}
          <span className="mx-1 inline-block align-middle md:scale-150">
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
          <span>your Yard</span>{' '}
          <span className="mx-1 inline-block align-middle md:scale-150">
            <svg
              width="32"
              height="31"
              viewBox="0 0 32 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30.1679 21.7399C30.4447 20.7259 29.8475 18.9312 29.8475 18.9312C29.8475 18.9312 31.2738 17.6836 31.5507 16.6696C32.2316 14.172 30.8131 11.6368 27.8686 10.7777C29.5019 8.16969 28.8875 5.32729 26.7282 3.9148C25.8516 3.34135 23.9611 3.36102 23.9611 3.36102C23.9611 3.36102 23.2217 1.62099 22.3451 1.04754C20.1858 -0.364947 17.3354 0.210885 15.5998 2.75278C13.633 0.399066 10.7418 0.115111 8.72622 1.73963C7.90805 2.39954 7.33644 4.20619 7.33644 4.20619C7.33644 4.20619 5.45337 4.37835 4.63466 5.0379C2.61835 6.66352 2.27506 9.5563 4.15076 11.9871C1.23644 13.231 -0.00646809 16.004 0.871675 18.478C1.22775 19.4812 2.76344 20.5816 2.76344 20.5816C2.76344 20.5816 2.29637 22.4927 2.653 23.4963C3.53022 25.9681 6.17932 27.1639 9.12971 26.0347C9.27711 29.1903 11.4336 31.1381 14.0502 30.9519C15.1121 30.8762 16.6766 29.683 16.6766 29.683C16.6766 29.683 18.2992 30.6494 19.3619 30.5735C21.9804 30.3869 24.0236 28.1366 23.9954 24.9686C26.9735 25.713 29.487 24.2398 30.1686 21.7411L30.1679 21.7399Z"
                fill="#FC7E2F"
              />
            </svg>
          </span>
        </AnimatedText>
        <AnimatedText
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-5 w-full text-center font-decoy text-xl md:mt-12 md:text-left md:text-4xl"
        >
          and it’s{' '}
          <span ref={wordRef} className="relative inline-block font-bold">
            f*cking
            <svg
              width="98"
              height="15"
              viewBox="0 0 98 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`absolute -left-3 top-6 transition-all duration-500 ease-out md:left-4 md:top-10 md:scale-125 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <path
                d="M1.00018 9.02251C20.3547 5.31928 66.6302 -0.266514 96.8965 7.01613"
                stroke="#B4BD02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset={isVisible ? '0' : '100'}
                className="transition-all duration-700 ease-out"
              />
              <path
                d="M96.897 7.01614C79.903 6.3508 42.8756 6.13601 30.7183 10.5996"
                stroke="#B4BD02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset={isVisible ? '0' : '100'}
                className="transition-all duration-700 ease-out"
              />
            </svg>
          </span>{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={words[wordIndex]}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {words[wordIndex]}.
            </motion.span>
          </AnimatePresence>
        </AnimatedText>
        <AnimatedDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-20 hidden md:flex"
        >
          <Link href="/how-to-help" className="no-tap-highlight">
            <div className="rounded-full bg-[#F4A1BA] px-12 py-3 font-archivo text-[#9B445E] shadow-lg shadow-primary/50 md:px-24 md:py-3 md:text-2xl">
              How can I help?
            </div>
          </Link>
        </AnimatedDiv>
      </div>
    </div>
  );
};

export default Title;
