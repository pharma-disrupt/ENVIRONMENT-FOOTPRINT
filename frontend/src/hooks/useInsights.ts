import { useInsightsStore } from '@store/insightStore';

export function useInsights() {
  const { insights, isLoading, error, fetchInsights, markAsRead, dismissInsight } = useInsightsStore();

  return {
    insights,
    isLoading,
    error,
    fetchInsights,
    markAsRead,
    dismissInsight,
  };
}
