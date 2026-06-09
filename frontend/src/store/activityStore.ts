import { create } from 'zustand';

interface Activity {
  id: string;
  userId: string;
  category: 'transport' | 'energy' | 'food' | 'shopping' | 'flight';
  type: string;
  value: number;
  unit: string;
  emissions: number; // kg CO2e
  date: string;
  notes?: string;
  createdAt: string;
}

interface ActivityState {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  fetchActivities: (filters?: { category?: string; dateFrom?: string; dateTo?: string }) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Promise<void>;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  isLoading: false,
  error: null,

  fetchActivities: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching activities with filters:', filters);
      // API call will be implemented
      set({ activities: [] });
    } catch (error) {
      set({ error: 'Failed to fetch activities' });
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addActivity: async (activity) => {
    set({ isLoading: true });
    try {
      console.log('Adding activity:', activity);
      // API call will be implemented
      const newActivity: Activity = {
        ...activity,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ activities: [newActivity, ...state.activities] }));
    } catch (error) {
      set({ error: 'Failed to add activity' });
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateActivity: (id, updates) => {
    set((state) => ({
      activities: state.activities.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  },

  deleteActivity: (id) => {
    set((state) => ({
      activities: state.activities.filter((a) => a.id !== id),
    }));
  },

  clearActivities: () => {
    set({ activities: [] });
  },
}));
