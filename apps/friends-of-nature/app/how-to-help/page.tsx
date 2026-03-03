'use client';

import { AnalyticsClientEventType } from '@features/analytics/constants';
import {
  type AnalyticsClientPageEvent,
  type ConfigSubmissionEvent
} from '@features/analytics/types.client';
import type { Week } from '@features/how-to-help-flow/types';
import { PageVisitTracker, useAnalytics } from '@shared-analytics/index';
import { cn } from 'lib/utils';
import { ArrowLeft, ArrowRight, Loader2Icon, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import type { Plant } from '../api/pollinator-plants/route';
import AnimatedDiv from '../components/AnimatedDiv';
import AnimatedText from '../components/AnimatedText';
import AnimatedTitle from '../components/AnimatedTitle';
import { PageName } from '../constants/data/page.data';

const SimpleSVG = ({
  path,
  fill
}: {
  path: string;
  fill: string;
}): React.ReactNode => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} fill={fill} />
    </svg>
  );
};

const FundingPage = (): React.ReactNode => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [displayButtons, setDisplayButtons] = useState(true);
  const [locationChange, setLocationChange] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);
  const [pollinatorPlants, setPollinatorPlants] = useState<[] | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [plan, setPlan] = useState<Week[] | null>(null);

  const { trackEvent } = useAnalytics<ConfigSubmissionEvent>();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [userAnswer, setUserAnswer] = useState({
    name: '',
    email: '',
    timeInAWeek: '15 minutes',
    whatMattersMost: [] as string[],
    locationCity: '',
    locationState: '',
    locationCountry: '',
    plan
  });

  const icons = useMemo(
    () => [
      {
        name: 'pollinators',
        icon: 'M13.5277 11.279C11.7258 12.6132 10.2527 14.3622 9.21722 16.3525C8.31192 18.0932 7.55814 20.2092 7.47225 22.1814C7.44983 22.6954 7.48757 23.2369 7.75615 23.6753C8.71178 25.2344 11.3533 25.0341 12.8013 24.4647C14.3137 23.87 15.5161 22.5342 15.9515 20.9646C15.6873 21.725 15.4198 22.5106 15.4712 23.3137C15.5226 24.1169 15.9772 24.9507 16.7419 25.1949C17.5964 25.467 18.5378 24.9052 18.9983 24.1333C19.4589 23.3615 19.553 22.4321 19.6362 21.5368C19.303 22.2258 19.6291 23.1064 20.2351 23.5727C20.8412 24.039 21.6524 24.1542 22.4139 24.0922C23.3033 24.0198 24.3044 23.588 24.4986 22.7141C24.5719 22.3844 24.5155 22.041 24.4592 21.708C24.0932 19.5487 23.7191 17.3608 22.817 15.3661C21.915 13.3709 20.4102 11.5566 18.3764 10.7579C18.9316 10.0414 18.8753 8.92005 18.2517 8.26283C17.3447 7.30826 15.6074 7.81901 14.6605 8.46471C14.2273 8.76041 13.8832 9.21246 13.7963 9.73802C13.7191 10.2049 13.985 10.9367 13.5282 11.2785L13.5277 11.279Z"'
      },
      {
        name: 'birds',
        icon: 'M9.38135 18.7115C8.90956 19.147 7.27647 20.3446 6.80469 20.8164C6.80469 21.319 7.65691 22.1056 9.04524 23.3871L9.09102 23.4293C10.2233 24.4745 10.8935 24.3245 11.087 24.1189L14.0629 20.018C15.079 20.3688 17.5105 21.0196 19.1073 20.8164C21.1033 20.5624 22.4461 19.6188 24.1518 16.8607C25.0223 15.453 24.8655 12.3727 24.5873 10.9452L25.7123 9.23957L23.7163 9.02183C23.6437 8.88876 23.3751 8.52828 22.8816 8.15085C22.0106 7.48481 20.9945 7.71533 19.7969 8.15085C17.9397 8.82621 16.2403 11.163 15.9137 11.5622C15.5871 11.9614 12.8653 15.772 12.5387 16.1712C12.212 16.5704 9.85313 18.276 9.38135 18.7115Z'
      },
      {
        name: 'butterflies',
        icon: 'M13.6327 11.8902C13.936 12.6021 14.4423 13.4143 14.9739 13.9793C13.6323 12.5537 11.6365 11.6877 9.69255 11.9494C8.33218 12.1324 7.04606 12.9181 6.2722 14.0551C5.23252 15.5824 5.7118 17.2653 6.90453 18.574C8.23839 20.0378 10.0054 20.2082 11.8525 20.4264C12.0707 22.2735 12.2411 24.0405 13.7049 25.3744C15.0136 26.5671 16.6965 27.0464 18.2238 26.0067C19.3608 25.2328 20.1468 23.9464 20.3295 22.5864C20.5909 20.6427 19.7249 18.6469 18.2997 17.305C18.8649 17.8369 19.6765 18.3432 20.3887 18.6462C21.2109 18.9965 22.1134 19.1479 23.0057 19.1308C23.8422 19.1146 24.8103 18.9486 25.421 18.3229C26.0487 17.6798 26.4095 16.7355 26.2972 15.8382C26.1635 14.7724 25.4092 13.866 24.5051 13.2883C23.6317 12.7302 22.6223 12.4315 21.6238 12.148C22.1434 12.2479 22.7099 11.6824 22.5563 11.1591C22.4457 10.7815 22.0083 10.5894 21.6296 10.6493C21.6895 10.2706 21.4975 9.83323 21.1198 9.72263C20.5962 9.56928 20.0305 10.1355 20.1309 10.6551C19.8477 9.65629 19.5487 8.64725 18.9906 7.77385C18.4129 6.86971 17.5068 6.11517 16.4407 5.98173C15.5434 5.86939 14.5988 6.22998 13.956 6.85788C13.3303 7.46857 13.1643 8.43671 13.1481 9.27325C13.131 10.1655 13.2824 11.068 13.6327 11.8902Z'
      },
      {
        name: 'plants',
        icon: 'M13.9287 19.9966C13.1318 19.4536 10.8532 19.5071 9.90479 19.3344C8.80577 19.1342 7.60551 18.6735 7.32453 17.4933C7.17053 16.8465 7.50764 16.1684 8.14091 15.9648C8.69831 15.7858 9.08541 16.1052 9.47395 16.3725C10.7724 17.2651 12.3214 17.6767 13.8757 17.9966C14.4859 18.1223 15.0319 17.5874 14.9086 16.9775C14.7386 16.1356 14.0674 15.333 13.2836 14.8971C12.1253 14.2536 10.758 14.1083 9.53306 13.6031C9.11119 13.4292 8.6876 13.195 8.44902 12.8062C8.05935 12.1722 8.31367 11.2792 8.89288 10.8113C9.4721 10.3434 10.2846 10.2495 11.0151 10.3953C12.8332 10.7576 14.2178 12.4071 15.929 12.9743C16.5021 13.1644 17.0283 12.6045 16.7969 12.0475C16.2135 10.6406 14.0594 9.45623 14.4372 7.87442C14.7101 6.73144 16.3356 6.34576 17.3119 7.00143C18.2875 7.65744 18.6386 8.95879 18.5387 10.1298C18.4771 10.8507 18.2817 11.6122 18.5795 12.2717C18.9507 13.0939 19.9494 13.428 20.8503 13.48C21.7511 13.5319 22.6786 13.3944 23.5418 13.6582C24.4051 13.9216 25.1902 14.7959 24.9293 15.6591C24.7945 16.105 24.4098 16.4391 23.9865 16.6341C22.1716 17.4694 20.2069 16.066 18.2156 15.6873C17.6985 15.5889 17.2185 15.979 17.2145 16.5051C17.2073 17.4155 17.9011 18.3743 18.8411 18.4212C19.2615 18.4421 19.6735 18.3137 20.0915 18.2623C21.6203 18.0745 23.346 19.35 23.1082 20.8704C22.9078 22.1504 21.458 22.9219 20.1641 22.8349C19.1055 22.764 18.1381 22.2755 17.2196 21.7229C16.8907 21.5248 16.4659 21.6714 16.3183 22.0255C15.81 23.2451 16.0189 24.5871 15.8094 25.8882C15.7907 26.0033 15.6768 26.0772 15.5644 26.0465C15.0349 25.9002 14.3969 25.7286 13.3523 25.4443C13.2654 25.4206 13.2177 25.3276 13.249 25.2434C13.5202 24.5169 14.1489 21.3599 14.244 20.961C14.3364 20.5733 14.2758 20.232 13.9293 19.9963L13.9287 19.9966Z'
      }
    ],
    []
  );

  useEffect((): void => {
    const detectLocation = async (): Promise<void> => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        if (data.city) {
          setUserAnswer((prev) => ({
            ...prev,
            locationCity: data.city,
            locationState: data.region,
            locationCountry: data.country_name
          }));
        }
      } catch {
        // User can enter location manually
      }
    };

    detectLocation();
  }, []);

  const timeOptions = useMemo(
    () => ['15 minutes', '1 hour', 'Whatever it takes'],
    []
  );

  useEffect((): void => {
    const index = timeOptions.indexOf(userAnswer.timeInAWeek);

    if (index !== -1) {
      setSliderValue(index);
    }
  }, [timeOptions, userAnswer.timeInAWeek]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number.parseInt(e.target.value);

    setSliderValue(value);
    setUserAnswer({ ...userAnswer, timeInAWeek: timeOptions[value] });
  };

  const handleLocationChange = (): void => {
    setLocationChange(true);
    setPollinatorPlants(null);
  };

  const handleNext = (): void => {
    if (step === 8) {
      setIsLoadingPlan(true);
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevious = (): void => {
    if (step === 1) {
      router.push('/');

      return;
    }

    if (step === 6) {
      setStep(step - 2);
      setDisplayButtons(true);

      return;
    }

    if (step === 9) {
      setUserAnswer({ ...userAnswer, email: '' });
    }

    setStep((prev) => prev - 1);
  };

  useEffect(() => {
    if (step === 5) {
      setDisplayButtons((prev) => !prev);

      const timer = setInterval((): void => {
        if (step === 5 || step === 11) {
          setDisplayButtons(true);
          setStep((prev) => prev + 1);
        }
      }, 2500);

      return (): void => clearInterval(timer);
    }

    if (step === 9) {
      setDisplayButtons(true);
    }

    if (step === 8) {
      setDisplayButtons(false);
      const generatePlan = async (): Promise<void> => {
        setIsLoadingPlan(true);
        try {
          const response = await fetch('/api/generate-plan', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              locationCity: userAnswer.locationCity,
              locationState: userAnswer.locationState,
              locationCountry: userAnswer.locationCountry,
              timeInAWeek: userAnswer.timeInAWeek,
              whatMattersMost: userAnswer.whatMattersMost
            })
          });

          if (response.ok) {
            const data = await response.json();

            setPlan(data.weeks || []);
          }
        } catch (error) {
          return error as void;
        } finally {
          setIsLoadingPlan(false);
        }
      };

      generatePlan();
    }

    if (step === 9) {
      setUserAnswer({ ...userAnswer, plan });
    }

    if (step === 10) {
      setDisplayButtons(false);
    }
  }, [step]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    if (inputRef.current?.checkValidity()) {
      try {
        setIsLoading(false);
        handleNext();

        trackEvent({
          eventName: AnalyticsClientEventType.FRIENDS_OF_NATURE_CONFIG,
          properties: { ...userAnswer }
        });
      } catch {
        setIsLoading(false);
      }
    } else {
      inputRef.current?.reportValidity();
      setIsLoading(false);
    }
  };

  const handleShareClick = async (): Promise<void> => {
    const url = 'https://www.friendsofnature.com';
    const title = `I've just joined Friends of Nature!`;
    const text = 'Check this out and join me!';

    if (navigator.share && navigator.canShare && navigator.canShare({ url })) {
      await navigator.share({ title, text, url });
    }

    setIsShared(true);
  };

  const fetchPollinatorPlants = useCallback(async (): Promise<void> => {
    if (userAnswer.locationCity && pollinatorPlants === null) {
      try {
        setIsLoadingPlants(true);
        const response = await fetch('/api/pollinator-plants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            locationCity: userAnswer.locationCity,
            locationState: userAnswer.locationState,
            locationCountry: userAnswer.locationCountry
          })
        });

        if (response.ok) {
          const data = await response.json();

          if (data && data.plants && Array.isArray(data.plants)) {
            setPollinatorPlants(data.plants);
            setIsLoadingPlants(false);
          }
        }
      } catch (error) {
        setIsLoadingPlants(false);

        return error as void;
      }
    }
  }, [
    userAnswer.locationCity,
    userAnswer.locationState,
    userAnswer.locationCountry,
    pollinatorPlants
  ]);

  useEffect((): void => {
    if (userAnswer.locationCity && !locationChange) {
      fetchPollinatorPlants();
    }
  }, [userAnswer.locationCity, fetchPollinatorPlants, locationChange]);

  return (
    <div
      className={
        (cn('w-screen bg-[#B4BD02]'),
        (step === 7 && !isLoadingPlants) || (step === 8 && !isLoadingPlan)
          ? 'h-full'
          : 'h-dvh md:h-screen')
      }
      style={{
        backgroundColor:
          step === 1 || step === 2 || step === 5 || step === 8 || step === 10
            ? '#1A5632'
            : '#B4BD02'
      }}
    >
      <div className="relative flex h-full w-full flex-col md:mx-auto md:min-h-screen md:w-1/2 md:items-center md:justify-center">
        {/* TITLE IMAGE (Fixed at the Top) */}
        <div className="mt-10 flex items-center justify-center md:mb-10">
          <AnimatedDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: 0 }}
            className="w-1/4 md:w-1/4"
          >
            <Image
              src="/images/friends-of-nature-footer.png"
              width={600}
              height={600}
              alt="Friends of Nature"
              className="opacity-80"
            />
          </AnimatedDiv>
        </div>

        {/* STEPS CONTENT (Expands and is Top-Aligned) */}
        <div className="flex w-full grow flex-col items-center justify-start">
          {step === 1 && (
            <AnimatedDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 0 }}
              className="my-10 flex w-full flex-col items-center justify-center gap-3 px-5"
            >
              <AnimatedTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="font-decoy text-center text-2xl text-[#B4BD02] md:text-3xl"
              >
                We&apos;ve been told <br className="md:hidden" /> conservation
                happens in <br className="hidden md:block" />
                remote places, in national parks, by scientists.
              </AnimatedTitle>
              <AnimatedText
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.4 }}
                className="font-decoy mb-5 text-center text-2xl text-[#B4BD02] md:text-3xl"
              >
                Real change starts at <br className="md:hidden" />{' '}
                <span className="text-[#f0e5b2]">home</span>
              </AnimatedText>
              <AnimatedDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <Image
                  src="/images/how-to-help.png"
                  width={150}
                  height={150}
                  alt="How to help"
                  className="md:mb-5 md:w-[250px]"
                />
              </AnimatedDiv>
            </AnimatedDiv>
          )}

          {step === 2 && (
            <AnimatedDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 0 }}
              className="my-10 mt-20 flex w-full flex-col items-center justify-center gap-2 px-5 md:mt-40"
            >
              <AnimatedTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="font-decoy text-center text-3xl text-[#B4BD02] md:text-4xl"
              >
                By answering a couple of short questions we will craft a custom
                tailored backyard conservation journey for you.
              </AnimatedTitle>
              <AnimatedText
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.4 }}
                className="font-decoy mt-16 w-2/3 text-center text-sm text-[#B4BD02] italic md:w-1/2 md:text-xl"
              >
                just 15 minutes per week can make all the difference
              </AnimatedText>
              {/* <AnimatedDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.4 }}
                className="flex w-full flex-col items-center justify-center gap-2 pt-2"
              >
                <Image
                  src="/images/step-1.png"
                  alt="step 1"
                  width={170}
                  height={170}
                  className="mb-4"
                />
                <div className="w-fit rounded-full border-2 border-[#f0e5b2]/50 bg-[#f0e5b2]/20 px-4 py-[2px] text-center font-archivo font-bold text-[#f0e5b2]">
                  STEP 1
                </div>
                <p className="text-center font-decoy text-2xl font-bold text-[#f0e5b2]">
                  Share your info
                </p>
                <p className="mt-4 text-center font-archivo text-xl text-[#f0e5b2]/80">
                  Tell us where you are and how much time you can give.
                </p>
              </AnimatedDiv> */}
            </AnimatedDiv>
          )}
          {/* 
          {step === 3 && (
            <AnimatedDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 0 }}
              className="my-10 flex w-full flex-col items-center justify-center gap-2 px-5"
            >
              <AnimatedTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="w-1/2 text-center font-decoy text-4xl text-[#B4BD02]"
              >
                How can you help?
              </AnimatedTitle>
              <AnimatedDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.4 }}
                className="flex w-full flex-col items-center justify-center gap-2 pt-2"
              >
                <Image
                  src="/images/step-2.png"
                  alt="step 1"
                  width={170}
                  height={170}
                  className="mb-4"
                />
                <div className="w-fit rounded-full border-2 border-[#f0e5b2]/50 bg-[#f0e5b2]/20 px-4 py-[2px] text-center font-archivo font-bold text-[#f0e5b2]">
                  STEP 2
                </div>
                <p className="text-center font-decoy text-2xl font-bold text-[#f0e5b2]">
                  Get Personalized Tips
                </p>
                <p className="mt-4 text-center font-archivo text-xl text-[#f0e5b2]/80">
                  We&apos;ll send you simple, impactful ways to help nature.
                </p>
              </AnimatedDiv>
            </AnimatedDiv>
          )} */}

          {/* {step === 4 && (
            <AnimatedDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 0 }}
              className="my-10 flex w-full flex-col items-center justify-center gap-2 px-5"
            >
              <AnimatedTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="w-1/2 text-center font-decoy text-4xl text-[#B4BD02]"
              >
                How can you help?
              </AnimatedTitle>
              <AnimatedDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.4 }}
                className="flex w-full flex-col items-center justify-center gap-2 pt-2"
              >
                <Image
                  src="/images/step-3.png"
                  alt="step 1"
                  width={170}
                  height={170}
                  className="mb-4"
                />
                <div className="w-fit rounded-full border-2 border-[#f0e5b2]/50 bg-[#f0e5b2]/20 px-4 py-[2px] text-center font-archivo font-bold text-[#f0e5b2]">
                  STEP 3
                </div>
                <p className="text-center font-decoy text-2xl font-bold text-[#f0e5b2]">
                  Make a difference
                </p>
                <p className="mt-2 text-center font-archivo text-xl text-[#f0e5b2]/80">
                  Take action and see your efforts grow!
                </p>
              </AnimatedDiv>
            </AnimatedDiv>
          )} */}

          {step === 3 && (
            <AnimatedDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 0 }}
              className="my-10 flex w-full flex-col items-center justify-center gap-10 px-5"
            >
              <AnimatedTitle className="font-decoy w-full text-center text-3xl text-[#1A5632] md:text-4xl">
                How much time can you dedicate to backyard conservation weekly?
              </AnimatedTitle>
              <AnimatedDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.5 }}
                className="flex w-full flex-col gap-5"
              >
                <div className="no-tap-highlight relative flex flex-col items-center rounded-lg bg-[#B4BD02] px-5">
                  {/* PLANT IMAGE */}
                  <AnimatedDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    className="mt-4 mb-2 h-[80px] w-[80px] md:mt-12"
                  >
                    {sliderValue === 0 && (
                      <Image
                        src="/images/10minutes.png"
                        width={80}
                        height={80}
                        alt="seedling"
                        className="md:scale-125"
                      />
                    )}
                    {sliderValue === 1 && (
                      <Image
                        src="/images/30minutes.png"
                        width={80}
                        height={80}
                        alt="seedling"
                        className="mt-1 scale-125 md:scale-150"
                      />
                    )}
                    {sliderValue === 2 && (
                      <Image
                        src="/images/allthetime.png"
                        width={80}
                        height={80}
                        alt="seedling"
                        className="mt-3 scale-150 md:scale-[1.75]"
                      />
                    )}
                  </AnimatedDiv>

                  {/* Time label */}
                  <div className="font-decoy mt-8 mb-8 text-3xl text-[#1A5632] md:mt-16">
                    {timeOptions[sliderValue]}
                  </div>

                  {/* Custom slider track */}
                  <div className="relative w-full max-w-xs md:max-w-md">
                    {/* Slider track background */}
                    <div className="absolute top-1/2 h-4 w-full -translate-y-1/2 rounded-full bg-[#1A5632]/30" />

                    {/* Slider filled part */}
                    <div
                      className="absolute top-1/2 h-4 -translate-y-1/2 rounded-full bg-[#1A5632]/50"
                      style={{
                        width: `${sliderValue * 50}%`,
                        left: 0
                      }}
                    />

                    {/* Slider dots */}
                    <div className="relative flex h-full items-center justify-between">
                      {[0, 1, 2].map((value) => (
                        <div
                          key={value}
                          className="flex items-center justify-center"
                          style={{ width: '1.25rem', height: '1.25rem' }}
                        >
                          <div
                            className={`rounded-full transition-transform duration-200 ${
                              value === sliderValue
                                ? 'border border-[#B4BD02] bg-[#1A5632]'
                                : 'bg-[#B4BD02]/50'
                            }`}
                            style={{
                              backgroundColor:
                                sliderValue > value ? '#B4BD02' : '#1A5632',
                              width: '0.75rem',
                              height: '0.75rem',
                              transform:
                                value === sliderValue
                                  ? 'scale(2.3)'
                                  : 'scale(1)'
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Actual slider input (invisible but functional) */}
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="1"
                      value={sliderValue}
                      onChange={handleSliderChange}
                      className="absolute top-0 h-2 w-full cursor-pointer opacity-0"
                    />
                  </div>
                </div>
              </AnimatedDiv>
            </AnimatedDiv>
          )}

          {step === 4 && (
            <AnimatedDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 0 }}
              className="my-10 flex w-full flex-col items-center justify-center gap-5 px-5"
            >
              <AnimatedTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="font-decoy w-full text-center text-4xl text-[#1A5632]"
              >
                What should we call you?
              </AnimatedTitle>
              {/* <AnimatedText
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.4 }}
                className="mb-2 mt-2 text-center font-archivo text-black/75"
              >
                Let's get on a first-name basis. <br />
                What should we call you?
              </AnimatedText> */}
              <AnimatedDiv className="flex w-full flex-col gap-1 md:mt-10 md:w-1/2">
                <p className="font-archivo mt-10 text-[#1A5632]">
                  Your first name
                </p>
                <input
                  type="text"
                  value={userAnswer.name}
                  required
                  onChange={(e): void =>
                    setUserAnswer({ ...userAnswer, name: e.target.value })
                  }
                  className="rounded-xl border-2 border-[#1A5632]/30 bg-[#B4BD02] p-3 text-[#1A5632] outline-none placeholder:text-[#1A5632] focus:outline-none"
                />
              </AnimatedDiv>
            </AnimatedDiv>
          )}

          {step === 5 && (
            <AnimatedDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 0 }}
              className="my-32 flex w-full flex-1 flex-col items-center justify-start gap-5 px-5"
            >
              <AnimatedTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="line- font-decoy w-[90%] text-center text-6xl text-[#f0e5b2]"
              >
                Nice to meet you, <br />{' '}
                <span className="text-6xl text-[#B4BD02]">
                  {userAnswer.name}!
                </span>
              </AnimatedTitle>
            </AnimatedDiv>
          )}

          {step === 6 && (
            <AnimatedDiv className="my-10 flex w-full flex-col items-center justify-between gap-5 px-5">
              {locationChange ? (
                <React.Fragment>
                  <AnimatedTitle
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="font-decoy w-full text-center text-3xl font-normal text-[#1A5632] md:mb-10 md:text-4xl"
                  >
                    Where should we adapt your{' '}
                    <br className="hidden md:block" />
                    experience to?
                  </AnimatedTitle>
                  <div className="mb-5 flex w-full flex-1 flex-col gap-5">
                    <div className="flex w-full flex-col gap-1">
                      <p className="font-archivo text-[#1A5632]">City</p>
                      <input
                        type="text"
                        placeholder="Austin"
                        required
                        onChange={(e): void =>
                          setUserAnswer({
                            ...userAnswer,
                            locationCity: e.target.value
                          })
                        }
                        className="rounded-xl border-2 border-[#1A5632]/30 bg-[#B4BD02] p-3 text-[#1A5632] outline-none placeholder:text-[#1A5632]/30 focus:outline-none"
                      />
                    </div>

                    <div className="flex w-full flex-col gap-1 md:grid md:grid-cols-2 md:gap-5">
                      <div className="flex w-full flex-col gap-1">
                        <p className="font-archivo text-[#1A5632]">State</p>
                        <input
                          type="text"
                          placeholder="Texas"
                          required
                          onChange={(e): void =>
                            setUserAnswer({
                              ...userAnswer,
                              locationState: e.target.value
                            })
                          }
                          className="rounded-xl border-2 border-[#1A5632]/30 bg-[#B4BD02] p-3 text-[#1A5632] outline-none placeholder:text-[#1A5632]/30 focus:outline-none"
                        />
                      </div>

                      <div className="mt-5 flex w-full flex-col gap-1 md:mt-0">
                        <p className="font-archivo text-[#1A5632]">Country</p>
                        <input
                          type="text"
                          placeholder="United States"
                          required
                          onChange={(e): void =>
                            setUserAnswer({
                              ...userAnswer,
                              locationCountry: e.target.value
                            })
                          }
                          className="rounded-xl border-2 border-[#1A5632]/30 bg-[#B4BD02] p-3 text-[#1A5632] outline-none placeholder:text-[#1A5632]/30 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-10 flex w-full justify-end gap-5 px-5">
                    <button
                      type="button"
                      className="flex flex-row items-center justify-center rounded-full border-2 border-[#1A5632] bg-[#B4BD02] p-3 disabled:opacity-20"
                      onClick={(): void => {
                        setLocationChange(false);
                      }}
                    >
                      <ArrowLeft color="#1A5632" />
                    </button>
                    <button
                      type="button"
                      disabled={
                        !userAnswer.locationCity ||
                        !userAnswer.locationState ||
                        !userAnswer.locationCountry
                      }
                      className="flex flex-row items-center justify-center rounded-full border-2 border-[#1A5632] bg-[#1A5632] p-3 disabled:opacity-20"
                      onClick={(): void => {
                        setLocationChange(false);
                      }}
                    >
                      <ArrowRight color="#B4BD02" />
                    </button>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <AnimatedTitle className="font-decoy w-full text-center text-3xl font-normal text-[#1A5632] md:text-4xl">
                    We will adapt your experience to
                  </AnimatedTitle>
                  <div className="font-decoy flex flex-col items-center justify-center gap-2 text-center text-3xl font-bold text-[#1A5632] md:text-4xl">
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
                      {userAnswer.locationCity.length === 0 ? (
                        <span className="flex items-center gap-3 text-lg whitespace-nowrap">
                          Location could not be found!
                        </span>
                      ) : (
                        <React.Fragment>
                          <span className="mt-10 flex items-center gap-3 whitespace-nowrap">
                            <MapPin color="#f0e5b2" size={32} />{' '}
                            {userAnswer.locationCity},{' '}
                          </span>
                          <span className="mt-10 ml-[2px] flex items-center gap-3 whitespace-nowrap">
                            {userAnswer.locationState ===
                            userAnswer.locationCity
                              ? userAnswer.locationCountry
                              : userAnswer.locationState}
                          </span>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                  <AnimatedDiv className="flex w-full flex-col items-center justify-center gap-2">
                    <button
                      type="button"
                      className="font-archivo no-tap-highlight mt-8 rounded-full text-[#1A5632] underline opacity-60"
                      onClick={(): void => handleLocationChange()}
                    >
                      {userAnswer.locationCity === ''
                        ? 'Set location manually.'
                        : 'That is not my correct location.'}
                    </button>
                  </AnimatedDiv>
                </React.Fragment>
              )}
            </AnimatedDiv>
          )}

          {step === 7 && (
            <AnimatedDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 0 }}
              className="my-10 flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden px-5"
            >
              <div className="font-decoy w-full text-center text-4xl text-[#1A5632]">
                Native plants in <br className="md:hidden" /> your area
              </div>
              <div className="font-decoy mt-2 w-full text-center text-sm font-bold text-[#1A5632]">
                select those that you are already growing
              </div>

              {isLoadingPlants || !pollinatorPlants ? (
                <div className="mt-20 flex h-full w-full flex-col items-center justify-start">
                  <Loader2Icon
                    size={48}
                    color="#1A5632"
                    className="animate-spin md:h-52 md:w-52"
                  />
                </div>
              ) : (
                <div className="mt-2 mb-20 flex h-full w-full flex-col items-center justify-around gap-2 md:mt-12 md:mb-28 md:grid md:grid-cols-2 md:gap-5">
                  {pollinatorPlants.map((plant: Plant): React.ReactNode => {
                    const isSelected = userAnswer.whatMattersMost.includes(
                      plant.name
                    );

                    return (
                      <button
                        key={plant.name}
                        type="button"
                        className={`font-archivo no-tap-highlight flex w-full flex-row items-center gap-2 rounded-xl border-2 border-[#1A5632]/30 px-2 py-2 text-lg transition-all duration-300 ease-in-out ${
                          isSelected
                            ? 'bg-[#1A5632] text-[#F0E5B2]'
                            : 'bg-[#F0E5B24D] text-[#1A5632] md:hover:border-2 md:hover:border-[#1A5632] md:hover:bg-[#1A5632]/10'
                        }`}
                        onClick={(): void => {
                          if (isSelected) {
                            setUserAnswer({
                              ...userAnswer,
                              whatMattersMost:
                                userAnswer.whatMattersMost.filter(
                                  (item) => item !== plant.name
                                )
                            });
                          } else {
                            setUserAnswer({
                              ...userAnswer,
                              whatMattersMost: [
                                ...userAnswer.whatMattersMost,
                                plant.name
                              ]
                            });
                          }
                        }}
                      >
                        <div className="flex flex-row gap-2">
                          <SimpleSVG
                            path={icons[0].icon}
                            fill={isSelected ? '#F0E5B2' : '#1A5632'}
                          />{' '}
                          <div className="flex flex-col">
                            <div className="font-archivo w-full text-left text-base font-bold">
                              {plant.name}
                            </div>
                            <div className="font-archivo w-full text-left text-xs">
                              <span className="font-bold">Supports:</span>{' '}
                              {plant.pollinators_support.join(', ')}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </AnimatedDiv>
          )}

          {step === 8 && (
            <div className="my-10 flex flex-1 flex-col items-center justify-start gap-5 overflow-x-hidden px-5">
              {isLoadingPlan && (
                <div className="mt-20 flex h-full w-full flex-col items-center justify-start">
                  <Loader2Icon
                    size={72}
                    color="#F0E5B2"
                    className="animate-spin md:h-52 md:w-52"
                  />
                  <h1 className="font-decoy mt-10 text-center text-4xl text-[#F0E5B2]">
                    generating <br className="md:hidden" /> a plan{' '}
                    <span className="animate-pulse">...</span>
                  </h1>
                </div>
              )}
              {!isLoadingPlan && plan && (
                <div className="flex h-full w-full flex-col items-center justify-start">
                  {/* TITLE */}
                  <h1 className="font-decoy w-[90%] text-center text-3xl text-[#f0e5b2] md:text-6xl">
                    Here is your plan,{' '}
                    <span className="mx-1 inline-block scale-100 align-middle">
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
                    <span className="text-4xl text-[#B4BD02] md:text-7xl">
                      {userAnswer.name}!
                    </span>
                  </h1>
                  <p className="font-archivo mt-5 text-center text-lg text-[#f0e5b2] md:mt-8 md:text-xl">
                    Here&apos;s an overview of your personalised plan. <br />
                    We will send you detailed instructions each week over email.
                  </p>
                  <div className="mt-10 mb-16 flex w-full flex-col items-center justify-center gap-5">
                    {plan.map((week) => (
                      <div
                        key={week.week}
                        className={`font-archivo flex w-full flex-col rounded-2xl px-4 py-4`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h2 className="text-xl font-bold text-[#f0e5b2]">
                            {week.week}: {week.title}
                          </h2>
                        </div>
                        <div className="flex flex-col gap-3">
                          {week.tasks.map((task) => (
                            <div
                              key={task.taskTitle}
                              className="rounded-lg bg-[#F0E5B2]/10 p-3"
                            >
                              <h4 className="mb-2 font-bold text-[#f0e5b2]">
                                {task.taskTitle}
                              </h4>
                              <p className="text-xs text-[#f0e5b2]/80">
                                Estimated time: {task.estimatedTime}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="flex flex-row items-center justify-center rounded-full border-2 border-[#f0e5b2] px-10 py-2 font-bold text-[#f0e5b2] disabled:opacity-20"
                    onClick={handleNext}
                  >
                    Send me the full plan
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 9 && (
            <AnimatedDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: 0 }}
              className="my-10 flex w-full flex-col items-center justify-between gap-5 px-5"
            >
              <AnimatedTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="font-decoy w-full text-center text-3xl text-[#1A5632] md:text-4xl"
              >
                Where should we <br className="md:hidden" />
                send a detailed plan?
              </AnimatedTitle>
              <form
                id="email-form"
                onSubmit={handleSubmit}
                className="w-full md:w-1/2"
              >
                <div className="mt-10 flex w-full flex-col justify-center gap-1">
                  <p className="font-archivo text-[#1A5632]">Email address</p>
                  <input
                    type="email"
                    style={{ borderRadius: '12px' }}
                    value={userAnswer.email}
                    ref={inputRef}
                    required
                    onChange={(e): void =>
                      setUserAnswer({
                        ...userAnswer,
                        email: e.target.value
                      })
                    }
                    className="border-2 border-[#1A5632]/30 bg-[#B4BD02] p-3 text-[#1A5632] outline-none placeholder:text-[#1A5632] focus:outline-none"
                  />
                </div>
              </form>
            </AnimatedDiv>
          )}

          {/* {step === 11 && (
            <div className="my-20 flex w-full flex-1 flex-col items-center justify-start gap-5 px-5">
              <p className="mb-5 w-full text-center font-decoy text-6xl text-[#f0e5b2]">
                I am a proud
              </p>
              <div className="w-2/3">
                <Image
                  src="/images/friend-of-nature-singular.png"
                  width={600}
                  height={600}
                  alt="Friends of Nature"
                />
              </div>
              <div className="mt-20 w-fit animate-pulse text-center font-decoy text-2xl text-[#f0e5b2]">
                <button
                  type="button"
                  className="no-tap-highlight"
                  onClick={handleNext}
                >
                  Join us!
                </button>
              </div>
            </div>
          )} */}

          {step === 10 && (
            <React.Fragment>
              <div className="my-32 flex flex-1 flex-col items-center justify-start gap-5 overflow-x-hidden px-5">
                <h1 className="font-decoy w-[90%] text-center text-5xl text-[#f0e5b2] md:text-6xl">
                  Thank you,{' '}
                  <span className="mx-1 inline-block scale-125 align-middle">
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
                  <span className="text-6xl text-[#B4BD02] md:text-7xl">
                    {userAnswer.name}!
                  </span>
                </h1>
                <p className="font-archivo mt-5 text-center text-lg text-[#f0e5b2] md:mt-16 md:text-2xl">
                  Your journey as a{' '}
                  <span className="font-bold">Friend of Nature</span> <br />{' '}
                  begins now!
                </p>
              </div>
              <div
                className="font-archivo absolute bottom-10 flex w-fit items-center justify-center rounded-full px-14 py-2 font-bold shadow-md transition-all duration-500 ease-in-out md:w-1/2"
                style={{
                  backgroundColor: isShared ? 'transparent' : '#F4A1BA',
                  borderColor: isShared ? '#f0e5b2' : '#F4A1BA',
                  border: isShared ? '1px solid #f0e5b2' : '#F4A1BA'
                }}
              >
                <button
                  type="button"
                  onClick={
                    isShared ? (): void => router.push('/') : handleShareClick
                  }
                  className="no-tap-highlight"
                  style={{ color: isShared ? '#f0e5b2' : '#1A5632' }}
                >
                  {isShared ? 'Back to homepage' : 'Share with friends'}
                </button>
              </div>
            </React.Fragment>
          )}
        </div>

        {/* BUTTONS (Fixed at the Bottom) */}
        {displayButtons && !locationChange && (
          <div className="absolute bottom-10 flex w-full justify-end gap-5 px-5">
            <button
              type="button"
              className="rounded-full border-2 border-[#1A5632] bg-[#B4BD02] p-3"
              onClick={(): void => handlePrevious()}
              style={{
                borderColor: step === 1 || step === 2 ? '#f0e5b2' : '#1A5632',
                color: step === 1 || step === 2 ? '#f0e5b2' : '#1A5632',
                backgroundColor: 'transparent'
              }}
            >
              <ArrowLeft
                color={step === 1 || step === 2 ? '#f0e5b2' : '#1A5632'}
              />
            </button>
            <button
              type={step === 9 ? 'submit' : 'button'}
              form="email-form"
              disabled={
                (step === 4 && userAnswer.name === '') ||
                (step === 7 && userAnswer.whatMattersMost.length === 0) ||
                isLoading ||
                (step === 6 && userAnswer.locationCity === '')
              }
              className="flex flex-row items-center justify-center rounded-full border-2 p-3 disabled:opacity-20"
              style={{
                borderColor: step === 1 || step === 2 ? '#f0e5b2' : '#1A5632',
                color: step === 1 || step === 2 ? '#B4BD02' : '#1A5632',
                backgroundColor:
                  step === 1 || step === 2 ? '#f0e5b2' : '#1A5632'
              }}
              onClick={(e): void => {
                if (step === 9) {
                  handleSubmit(e);
                } else {
                  handleNext();
                }
              }}
            >
              {step === 2 && (
                <p className="font-archivo pr-3 pl-2 text-base text-[#1A5632]">
                  Let&apos;s go
                </p>
              )}
              {step === 6 && (
                <p className="font-archivo pr-3 pl-2 text-base text-[#B4BD02]">
                  Looks good
                </p>
              )}
              {step === 9 && (
                <p className="font-archivo pr-3 pl-2 text-base text-[#B4BD02]">
                  Submit
                </p>
              )}
              <ArrowRight
                color={step === 1 || step === 2 ? '#1A5632' : '#B4BD02'}
              />
            </button>
          </div>
        )}
        <div
          className="absolute bottom-0 h-4 w-full rounded-tl-full rounded-tr-full bg-white/20 md:w-[120%]"
          style={{
            opacity: step === 5 ? 0 : 1,
            display: step === 8 || step === 10 ? 'none' : 'block',
            overflow: 'hidden'
          }}
        >
          <AnimatedDiv
            className="h-full rounded-r-full"
            style={{
              backgroundColor: step === 1 || step === 2 ? '#B4BD02' : '#f0e5b2',
              borderRadius: step === 9 ? '0 0 0 0' : undefined,
              transition: 'border-radius 0.5s ease-in-out'
            }}
            animate={{ width: `${(step / 9) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.FRIENDS_OF_NATURE_HOW_TO_HELP
        }}
      />
    </div>
  );
};

export default FundingPage;
