'use client';

import localFont from 'next/font/local';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from 'lib/utils';

const SFProTextUltraLight = localFont({
  src: '../../../public/fonts/SF-Pro-Text-Ultralight.otf'
});

const SFProTextMedium = localFont({
  src: '../../../public/fonts/SF-Pro-Text-Medium.otf'
});

const AnnieUseYourTelescope = localFont({
  src: '../../../public/fonts/AnnieUseYourTelescope-Regular.ttf'
});

const EmailForm = ({
  className,
  isModalUsage = false,
  isEarlyBird,
  onEmailSubscribeSuccess
}: {
  autoFocusInput?: boolean;
  isModalUsage?: boolean;
  className?: string;
  isEarlyBird?: boolean;
  onEmailSubscribeSuccess?: () => void;
}): React.ReactNode => {
  const [isEmailSubscribed, setIsEmailSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (email) {
      setIsEmailSubscribed(true);
      setEmail('');
      onEmailSubscribeSuccess?.();
    }
  };

  return (
    <div className={className}>
      {isEmailSubscribed ? (
        <p className="mx-auto flex w-[309px] items-center justify-center rounded-3xl border border-[#003333] bg-transparent px-2 py-[7px] leading-loose text-[#003333] transition-all duration-1000 ease-in-out md:mt-0">
          Thank you for subscribing!
        </p>
      ) : (
        <div>
          <form
            className="flex w-[90%] flex-col justify-center md:mt-0 md:w-[90%]"
            autoComplete="off"
            onSubmit={onSubmit}
          >
            <div className="relative flex pb-4">
              <div>
                <p
                  className={cn(
                    'text-left  text-xl text-[#2F2F2F]',
                    SFProTextUltraLight.className,
                    isModalUsage && 'mt-2'
                  )}
                >
                  <span className={cn('text-bold', SFProTextMedium.className)}>
                    Be the first to know
                  </span>
                  <br />
                  when we launch
                </p>
                {!isModalUsage && isEarlyBird ? (
                  <p
                    className={cn(
                      'mt-2 -rotate-3 text-2xl text-[#5F6368]',
                      AnnieUseYourTelescope.className
                    )}
                  >
                    Early birds get 20% off ;)
                  </p>
                ) : null}
                {isModalUsage ? null : (
                  <Image
                    src="/images/form_flower.png"
                    alt="flower image with butterfly"
                    className={cn(
                      'absolute right-[-70px] top-px h-full w-full max-w-[160px] object-contain object-top'
                    )}
                    sizes="100%"
                    width={0}
                    height={0}
                  />
                )}
              </div>
            </div>
            <div
              className={cn(
                'z-10 flex w-full items-center justify-center gap-[11px]',
                isModalUsage && 'mt-2 flex-col'
              )}
            >
              <input
                type="email"
                placeholder="Your email..."
                className="flex w-full rounded-xl! border border-white bg-white px-4 py-[12px] text-[#878787] placeholder-[#878787] focus:outline-none"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className={cn(
                  'w-[111px] rounded-xl bg-[#3B9858E5] py-[12px] font-medium text-white placeholder-white hover:bg-gray-500 focus:outline-none',
                  isModalUsage && 'w-full'
                )}
              >
                Sign up
              </button>
              {isModalUsage && isEarlyBird ? (
                <p
                  className={cn(
                    'mt-2  -rotate-3  self-center text-2xl text-[#5F6368]',
                    AnnieUseYourTelescope.className
                  )}
                >
                  Early birds get 20% off ;)
                </p>
              ) : null}
            </div>
            {isModalUsage ? (
              <Image
                src="/images/petal/petal_device_small.png"
                alt="petal camera device"
                className="absolute right-[-20px] top-[-15px] h-[390px] w-[160px] md:right-[-20px] md:top-[-30px] md:h-[480px] md:w-[200px]"
                sizes="100%"
                width={0}
                height={0}
              />
            ) : null}
          </form>
        </div>
      )}
    </div>
  );
};

export default EmailForm;
