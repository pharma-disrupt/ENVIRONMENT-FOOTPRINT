import { create } from 'zustand';

interface Insight {
  id: string;
  title: string;
  description: string;
  category: 'tip' | 'recommendation' | 'alert';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
}

interface InsightState {
  insights: Insight[];
  isLoading: boolean;
  error: string | null;
  fetchInsights: () => Promise<void>;
  markAsRead: (id: string) => void;
  dismissInsight: (id: string) => void;
}

export const useInsightsStore = create<InsightState>((set) => ({
  insights: [],
  isLoading: false,
  error: null,

  fetchInsights: async () => {
    set({ isLoading: true });
    try {
      console.log('Fetching insights...');
      set({ insights: [] });
    } catch (error) {
      set({ error: 'Failed to fetch insights' });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: (id) => {
    set((state) => ({
      insights: state.insights.map((i) => (i.id === id ? { ...i, isRead: true } : i)),
    }));
  },

  dismissInsight: (id) => {
    set((state) => ({ insights: state.insights.filter((i) => i.id !== id) }));
  },
}));
