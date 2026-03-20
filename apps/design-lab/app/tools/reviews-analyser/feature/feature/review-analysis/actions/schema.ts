import z from 'zod';

export const reviewAnalysisSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'mixed']),
  categories: z.object({
    product_quality: z.enum(['good', 'bad', 'neutral']),
    shipping: z.enum(['good', 'bad', 'neutral']),
    customer_service: z.enum(['good', 'bad', 'neutral']),
    value_for_money: z.enum(['good', 'bad', 'neutral']),
    artificial_intelligence: z.enum(['good', 'bad', 'neutral']),
    hardware: z.enum(['good', 'bad', 'neutral']),
    software: z.enum(['good', 'bad', 'neutral']),
    privacy: z.enum(['good', 'bad', 'neutral']),
    pricing: z.enum(['good', 'bad', 'neutral']),
    ease_of_use: z.enum(['good', 'bad', 'neutral'])
  }),
  summary: z.object({
    overall_experience: z.string().optional(),
    main_complaint: z.string().optional(),
    main_praise: z.string().optional(),
    recommendation: z.string()
  })
});

export type ReviewAnalysis = z.infer<typeof reviewAnalysisSchema>;
