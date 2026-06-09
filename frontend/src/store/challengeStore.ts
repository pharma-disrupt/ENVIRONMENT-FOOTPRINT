import { create } from 'zustand';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'community';
  startDate: string;
  endDate: string;
  participantCount: number;
  userJoined: boolean;
  userProgress?: number;
}

interface ChallengeState {
  challenges: Challenge[];
  isLoading: boolean;
  error: string | null;
  fetchChallenges: () => Promise<void>;
  joinChallenge: (id: string) => Promise<void>;
  leaveChallenge: (id: string) => void;
}

export const useChallengesStore = create<ChallengeState>((set) => ({
  challenges: [],
  isLoading: false,
  error: null,

  fetchChallenges: async () => {
    set({ isLoading: true });
    try {
      console.log('Fetching challenges...');
      set({ challenges: [] });
    } catch (error) {
      set({ error: 'Failed to fetch challenges' });
    } finally {
      set({ isLoading: false });
    }
  },

  joinChallenge: async (id) => {
    set({ isLoading: true });
    try {
      set((state) => ({
        challenges: state.challenges.map((c) =>
          c.id === id ? { ...c, userJoined: true, participantCount: c.participantCount + 1 } : c
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to join challenge' });
    } finally {
      set({ isLoading: false });
    }
  },

  leaveChallenge: (id) => {
    set((state) => ({
      challenges: state.challenges.map((c) =>
        c.id === id ? { ...c, userJoined: false, participantCount: Math.max(0, c.participantCount - 1) } : c
      ),
    }));
  },
}));
