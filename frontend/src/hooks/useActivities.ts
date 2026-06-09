import { useActivityStore } from '@store/activityStore';

export function useActivities() {
  const { activities, isLoading, error, fetchActivities, addActivity, updateActivity, deleteActivity, clearActivities } =
    useActivityStore();

  return {
    activities,
    isLoading,
    error,
    fetchActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    clearActivities,
  };
}
