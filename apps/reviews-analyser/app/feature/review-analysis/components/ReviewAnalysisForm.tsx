'use client';

import { useActionState, useRef, useState } from 'react';
import { analyseReview } from '../actions/analyse';
import { ReviewAnalysisDisplay } from './ReviewAnalysisDisplay';
import { FaExclamationTriangle, FaSpinner, FaTrash } from 'react-icons/fa';
import { BsLightningCharge } from 'react-icons/bs';

export function ReviewAnalysisForm() {
  // STATE
  const [isTextAreaEmpty, setIsTextAreaEmpty] = useState(false);
  const [state, formAction, isPending] = useActionState(analyseReview, {
    success: false,
  });

  // REFS
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 my-5 py-12">
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-block">
          <h1 className="text-6xl font-bold bg-linear-to-r from-purple-200 via-pink-200 to-amber-200 bg-clip-text text-transparent mb-3">
            Product Review Analyser
          </h1>
        </div>
        <p className="text-gray-300 max-w-2xl text-lg mx-auto leading-relaxed">
          Paste a customer review to get insights on sentiment, key themes, and
          actionable recommendations for your product.
        </p>
      </div>

      {/* FORM */}
      <form
        action={formData => {
          setIsTextAreaEmpty(false);
          formAction(formData);
        }}
        className="space-y-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl w-full flex flex-col items-center justify-center"
      >
        <div className="w-full relative">
          {/* CLEAR BUTTON */}
          <button
            type="button"
            className="bg-red-500/70 text-white rounded-full p-2 hover:bg-red-600 absolute bottom-4 right-2 z-10 hover:cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending}
            onClick={() => {
              if (textareaRef.current) {
                textareaRef.current.value = '';
                setIsTextAreaEmpty(true);
              }
            }}
          >
            <FaTrash className="w-4 h-4" />
          </button>

          {/* TEXTAREA */}
          <textarea
            ref={textareaRef}
            id="content"
            aria-label="Customer review content"
            name="content"
            rows={6}
            className={`w-full text-lg px-5 py-4 bg-white/10 backdrop-blur-sm border-2 text-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-white-60 resize-none ${
              state.errors
                ? 'border-red-500 focus:ring-red-400'
                : 'border-white/30'
            }`}
            placeholder="Example: The product quality is excellent and shipping was fast. However, customer service could be more responsive..."
            disabled={isPending}
            defaultValue={state.content ?? ''}
          />
          {state.errors && (
            <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-200 flex items-center gap-2">
                <FaExclamationTriangle className="w-5 h-5" />
                {state.errors.join('. ')}
              </p>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isPending}
          className="bg-linear-to-r from-purple-500 to-pink-500 text-white py-4 px-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 duration-300 hover:opacity-90 hover:cursor-pointer"
        >
          {isPending ? (
            <>
              <FaSpinner className="w-5 h-5 animate-spin" />
              Analysing Review...
            </>
          ) : (
            <>
              <BsLightningCharge className="w-5 h-5" />
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
