'use client';

import { useActionState, useRef, useState } from 'react';
import { BsLightningCharge } from 'react-icons/bs';
import { FaExclamationTriangle, FaSpinner, FaTrash } from 'react-icons/fa';

import { analyseReview } from '../actions/analyse';
import { ReviewAnalysisDisplay } from './ReviewAnalysisDisplay';

export function ReviewAnalysisForm() {
  // STATE
  const [isTextAreaEmpty, setIsTextAreaEmpty] = useState(false);
  const [state, formAction, isPending] = useActionState(analyseReview, {
    success: false
  });

  // REFS
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="mx-auto my-5 max-w-4xl space-y-8 p-6 py-12">
      {/* HEADER */}
      <div className="space-y-4 text-center">
        <div className="inline-block">
          <h1 className="mb-3 bg-linear-to-r from-purple-200 via-pink-200 to-amber-200 bg-clip-text text-6xl font-bold text-transparent">
            Product Review Analyser
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-300">
          Paste a customer review to get insights on sentiment, key themes, and
          actionable recommendations for your product.
        </p>
      </div>

      {/* FORM */}
      <form
        action={(formData) => {
          setIsTextAreaEmpty(false);
          formAction(formData);
        }}
        className="flex w-full flex-col items-center justify-center space-y-6 rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="relative w-full">
          {/* CLEAR BUTTON */}
          <button
            type="button"
            className="absolute right-2 bottom-4 z-10 rounded-full bg-red-500/70 p-2 text-white transition-all duration-300 hover:cursor-pointer hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPending}
            onClick={() => {
              if (textareaRef.current) {
                textareaRef.current.value = '';
                setIsTextAreaEmpty(true);
              }
            }}
          >
            <FaTrash className="h-4 w-4" />
          </button>

          {/* TEXTAREA */}
          <textarea
            ref={textareaRef}
            id="content"
            aria-label="Customer review content"
            name="content"
            rows={6}
            className={`placeholder-white-60 w-full resize-none rounded-xl border-2 bg-white/10 px-5 py-4 text-lg text-white shadow-lg backdrop-blur-sm transition-all focus:border-transparent focus:ring-2 focus:ring-purple-400 focus:outline-none ${
              state.errors
                ? 'border-red-500 focus:ring-red-400'
                : 'border-white/30'
            }`}
            placeholder="Example: The product quality is excellent and shipping was fast. However, customer service could be more responsive..."
            disabled={isPending}
            defaultValue={state.content ?? ''}
          />
          {state.errors && (
            <div className="mt-2 rounded-lg border border-red-500/50 bg-red-500/20 p-3">
              <p className="flex items-center gap-2 text-sm text-red-200">
                <FaExclamationTriangle className="h-5 w-5" />
                {state.errors.join('. ')}
              </p>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:cursor-pointer hover:opacity-90 hover:shadow-xl focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <>
              <FaSpinner className="h-5 w-5 animate-spin" />
              Analysing Review...
            </>
          ) : (
            <>
              <BsLightningCharge className="h-5 w-5" />
              Analyse Review
            </>
          )}
        </button>
      </form>

      {/* RESULTS */}
      {state.result && !isTextAreaEmpty && (
        <div className="animate-fade-in">
          <ReviewAnalysisDisplay analysis={state.result} />
        </div>
      )}
    </div>
  );
}
