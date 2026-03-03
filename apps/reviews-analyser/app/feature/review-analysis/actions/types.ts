import { ReviewAnalysis } from './schema';

export type AnalyseReviewState = {
  success: boolean;
  errors?: string[];
  result?: ReviewAnalysis;
  loading?: boolean;
  content?: string;
};
