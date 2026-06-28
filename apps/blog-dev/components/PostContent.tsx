'use client';

import { fadeInUp, staggerContainer } from '@/utils/motion';
import { useReducedMotion } from '@repo/ui/animation';
import {
  AnimatedDiv,
  AnimatedText,
  AnimatedTitle
} from '@repo/ui/animation/core';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PostContentProps {
  title: string;
  author: string;
  content: string;
  formattedDate: string;
}

export default function PostContent({
  title,
  author,
  content,
  formattedDate
}: PostContentProps) {
  const reduce = useReducedMotion();

  return (
    <AnimatedDiv
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? false : 'hidden'}
      animate="visible"
      className="mx-auto max-w-2xl px-6 py-12"
    >
      <AnimatedDiv variants={reduce ? undefined : fadeInUp}>
        <Link
          href="/"
          className="text-secondary hover:text-white-100 mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-300"
        >
          <ArrowLeft size={14} />
          Back to posts
        </Link>
      </AnimatedDiv>

      <AnimatedDiv
        variants={reduce ? undefined : fadeInUp}
        className="text-secondary mb-6 flex items-center gap-3 font-mono text-sm tracking-wider uppercase"
      >
        <span className="text-white-100">{author.toUpperCase()}</span>
        <span className="bg-accent h-1 w-1 rounded-full" />
        <time>{formattedDate}</time>
      </AnimatedDiv>

      <AnimatedTitle
        variants={reduce ? undefined : fadeInUp}
        className="text-gradient-white text-4xl leading-tight font-bold tracking-tight"
      >
        {title}
      </AnimatedTitle>

      <AnimatedText
        variants={reduce ? undefined : fadeInUp}
        className="text-secondary mt-8 text-lg leading-relaxed whitespace-pre-line"
      >
        {content}
      </AnimatedText>
    </AnimatedDiv>
  );
}
