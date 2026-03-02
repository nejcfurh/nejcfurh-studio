'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import ScrollToDecryptSkeleton from './ScrollToDecryptSkeleton';
import ScrollMarginComponent from './ScrollMarginComponent';

export interface ScrollToDecryptProps {
  title?: string;
  subtitle?: string;
  trackLength?: number;
  startOffset?: number;
  endOffset?: number;
  titleClassName?: string;
  subtitleClassName?: string;
  containerClassName?: string;
  enableScrollContent?: boolean;
}

const ScrollToDecrypt: React.FC<ScrollToDecryptProps> = ({
  title = 'Scroll to Decrypt',
  subtitle = 'Watch the text reveal as you scroll',
  trackLength = 40,
  startOffset = -1.8,
  endOffset = 0.7,
  titleClassName = '',
  subtitleClassName = '',
  containerClassName = '',
  enableScrollContent = true,
}) => {
  const headingRef = useRef<HTMLDivElement>(null);

  const randomString = (length: number): string => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?~';
    return [...Array(length)]
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join('');
  };

  const escapeHTML = (str: string): string =>
    str.replace(
      /[&<>"']/g,
      char =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[char] || char
    );

  const splitIntoChars = (text: string) => {
    const words: { chars: string[]; isWhitespace: boolean }[] = [];
    let currentWord: string[] = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ') {
        if (currentWord.length > 0) {
          words.push({ chars: currentWord, isWhitespace: false });
          currentWord = [];
        }
        words.push({ chars: [' '], isWhitespace: true });
      } else {
        currentWord.push(char);
      }
    }

    if (currentWord.length > 0) {
      words.push({ chars: currentWord, isWhitespace: false });
    }

    return words;
  };

  const renderEncryptedText = (text: string) => {
    const words = splitIntoChars(text);
    let charIndex = 0;

    return words.map((word, wordIndex) => {
      if (word.isWhitespace) {
        charIndex++;
        return (
          <span key={`space-${wordIndex}`} className="whitespace">
            {' '}
          </span>
        );
      }

      return (
        <span key={`word-${wordIndex}`} className="word whitespace-nowrap">
          {word.chars.map(char => {
            const currentCharIndex = charIndex++;
            return (
              <span
                key={currentCharIndex}
                data-char={char}
                className="char relative inline-block w-[1ch] h-lh overflow-hidden"
                style={
                  {
                    '--char-index': currentCharIndex,
                  } as React.CSSProperties
                }
              >
                <span
                  className="absolute w-[1ch] left-1/2 bottom-0 -translate-x-1/2 wrap-break-word whitespace-break-spaces"
                  dangerouslySetInnerHTML={{
                    __html: char + escapeHTML(randomString(trackLength)),
                  }}
                />
              </span>
            );
          })}
        </span>
      );
    });
  };

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.style.setProperty('--track', trackLength.toString());
      headingRef.current.style.setProperty('--start', startOffset.toString());
      headingRef.current.style.setProperty('--end', endOffset.toString());
    }
  }, [trackLength, startOffset, endOffset]);

  return (
    <div className={`w-full ${containerClassName}`}>
      {enableScrollContent && (
        <ScrollMarginComponent text="Scroll down to decrypt the text..." />
      )}
      <header className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="w-full flex items-center justify-center">
            <div className="font-mono uppercase">
              <span className="sr-only">{title}</span>
              <div
                ref={headingRef}
                className="encrypted mx-auto"
                style={
                  {
                    '--step-start': 'calc(var(--start, 0) * 1%)',
                    '--step-end': 'calc(var(--end, -0.2) * 1%)',
                    viewTimeline: '--heading',
                  } as React.CSSProperties
                }
                aria-hidden="true"
              >
                <h1
                  className={`leading-none m-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl ${titleClassName}`}
                  style={{
                    fontSize: titleClassName ? undefined : 'var(--fluid-type)',
                  }}
                >
                  {renderEncryptedText(title)}
                </h1>
                {subtitle && (
                  <p
                    className={`m-0 opacity-80 leading-none mt-4 sm:mt-6 md:mt-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl ${subtitleClassName}`}
                  >
                    {renderEncryptedText(subtitle)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {enableScrollContent && (
        <ScrollMarginComponent text="Scroll up to scramble the text..." />
      )}
    </div>
  );
};

export const ScrollToDecryptWithSuspense = ({
  enableScrollContent,
  containerClassName,
  ...props
}: ScrollToDecryptProps) => {
  return (
    <Suspense
      fallback={
        <ScrollToDecryptSkeleton
          enableScrollContent={enableScrollContent}
          containerClassName={containerClassName}
        />
      }
    >
      <ScrollToDecrypt {...props} />
    </Suspense>
  );
};
