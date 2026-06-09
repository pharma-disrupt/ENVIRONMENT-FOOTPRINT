import { useChallengesStore } from '@store/challengeStore';

export function useChallenges() {
  const { challenges, isLoading, error, fetchChallenges, joinChallenge, leaveChallenge } = useChallengesStore();

  return {
    challenges,
    isLoading,
    error,
    fetchChallenges,
    joinChallenge,
    leaveChallenge,
  };
}
