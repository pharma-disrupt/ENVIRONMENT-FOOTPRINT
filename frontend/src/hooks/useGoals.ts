import { useGoalsStore } from '@store/goalStore';

export function useGoals() {
  const { goals, isLoading, error, fetchGoals, addGoal, updateGoal, deleteGoal } = useGoalsStore();

  return {
    goals,
    isLoading,
    error,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}
