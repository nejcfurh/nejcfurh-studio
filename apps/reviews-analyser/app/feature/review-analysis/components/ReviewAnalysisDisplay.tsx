import { type ReviewAnalysis } from '../actions/schema';
import CategoryAnalysis from './CategoryAnalysis';
import KeyInsights from './KeyInsights';
import OverallSentiment from './OverallSentiment';

export function ReviewAnalysisDisplay({
  analysis,
}: {
  analysis: ReviewAnalysis;
}) {
  return (
    <div className="space-y-6">
      {/* OVERALL SENTIMENT */}
      <OverallSentiment sentiment={analysis.sentiment} />

      {/* CATEGORY ANALYSIS */}
      <CategoryAnalysis categories={analysis.categories} />

      {/* KEY INSIGHTS */}
      <KeyInsights summary={analysis.summary} />
    </div>
  );
}
