'use server';

import { generateObject, google } from '@repo/shared/ai-sdk';
import { AnalyseReviewState } from './types';
import { reviewAnalysisSchema } from './schema';
import z from 'zod';

export async function analyseReview(
  _: AnalyseReviewState,
  formData: FormData
): Promise<AnalyseReviewState> {
  try {
    const content = formData.get('content');

    const validationResult = z
      .string()
      .min(3, 'Review content must be at least 3 characters long')
      .max(4000, 'Review content must be less than 4000 characters')
      .safeParse(content);

    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.issues.map(err => err.message),
        content: typeof content === 'string' ? content : '',
      };
    }

    const parsedContent = validationResult.data;

    const { object } = await generateObject({
      model: google('gemini-2.5-flash-lite'),
      schema: reviewAnalysisSchema,
      prompt: `Analyse this customer product review and categorise it according to the specified schema.

        Customer Review: "${parsedContent}"

        Please analyse the review and provide:

        1. Overall sentiment (positive, negative, or mixed)
        2. Category ratings for:
           - product_quality: How the customer feels about the product quality (good/bad/neutral)
           - shipping: Their experience with shipping and delivery (good/bad/neutral)
           - customer_service: Their experience with customer service (good/bad/neutral)
           - value_for_money: Whether they think it's worth the price (good/bad/neutral)
           - artificial_intelligence: Whether they think the artificial intelligence is bringing value to the product (good/bad/neutral)
           - hardware: Whether they think the hardware is good or bad (good/bad/neutral)
           - software: Whether they think the mobile app is good or bad (good/bad/neutral)
           - privacy: Whether they think their privacy is protected or not (good/bad/neutral)
           - pricing: Whether they think the price is in line with the perceived value (good/bad/neutral)
           - ease_of_use: Whether they think the product is easy to use (good/bad/neutral)
        3. Summary including:
           - overall_experience: The overall experience of the customer (if any)
           - main_complaint: The primary issue mentioned (if any)
           - main_praise: The main positive aspect highlighted (if any)
           - recommendation: One sentence business action for improvement

        If a category is not mentioned in the review, mark it as "neutral". If the review is not related to the product return nothing. Keep the review as is and do not modify it. Make sure to be as concise as possible. Do not add any information that is not in the review. If any other product is mentioned in the review, ignore it.
      `,
    });

    return {
      success: true,
      result: object,
      content: typeof content === 'string' ? content : '',
    };
  } catch (error) {
    console.error('Error analysing review:', error);
    return {
      success: false,
      errors: [
        'An error occurred while analysing the review. Please try again.',
      ],
      content: '',
    };
  }
}
