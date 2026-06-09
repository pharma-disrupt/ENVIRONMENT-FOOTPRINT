import { create } from 'zustand';

interface FootprintData {
  totalEmissions: number; // kg CO2e
  dailyAverage: number;
  weeklyAverage: number;
  monthlyAverage: number;
  breakdown: {
    transport: number;
    energy: number;
    food: number;
    shopping: number;
    flights: number;
  };
  trend: {
    date: string;
    emissions: number;
  }[];
  lastUpdated: string;
}

interface FootprintState {
  data: FootprintData | null;
  isLoading: boolean;
  error: string | null;
  fetchFootprint: () => Promise<void>;
  updateFootprint: (data: Partial<FootprintData>) => void;
  clearFootprint: () => void;
}

export const useFootprintStore = create<FootprintState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchFootprint: async () => {
    set({ isLoading: true, error: null });
    try {
      // API call will be implemented
      console.log('Fetching footprint data...');
      // Simulated data for now
      const mockData: FootprintData = {
        totalEmissions: 2450,
        dailyAverage: 35,
        weeklyAverage: 245,
        monthlyAverage: 1050,
        breakdown: {
          transport: 800,
          energy: 600,
          food: 500,
          shopping: 300,
          flights: 250,
        },
        trend: [],
        lastUpdated: new Date().toISOString(),
      };
      set({ data: mockData });
    } catch (error) {
      set({ error: 'Failed to fetch footprint data' });
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateFootprint: (data: Partial<FootprintData>) => {
    set((state) => ({
      data: state.data ? { ...state.data, ...data } : (data as FootprintData),
    }));
  },

  clearFootprint: () => {
    set({ data: null });
  },
}));
