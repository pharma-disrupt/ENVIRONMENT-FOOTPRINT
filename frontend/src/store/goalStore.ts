import { create } from 'zustand';

interface Goal {
  id: string;
  userId: string;
  type: 'reduction' | 'activity' | 'challenge';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  status: 'active' | 'completed' | 'failed';
  createdAt: string;
}

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
}

export const useGoalsStore = create<GoalState>((set) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true });
    try {
      console.log('Fetching goals...');
      set({ goals: [] });
    } catch (error) {
      set({ error: 'Failed to fetch goals' });
    } finally {
      set({ isLoading: false });
    }
  },

  addGoal: async (goal) => {
    set({ isLoading: true });
    try {
      const newGoal: Goal = { ...goal, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      set((state) => ({ goals: [...state.goals, newGoal] }));
    } catch (error) {
      set({ error: 'Failed to add goal' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateGoal: (id, updates) => {
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  },

  deleteGoal: (id) => {
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
  },
}));
