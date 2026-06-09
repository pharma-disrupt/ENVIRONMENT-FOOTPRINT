import { useFootprintStore } from '@store/footprintStore';

export function useFootprint() {
  const { data, isLoading, error, fetchFootprint, updateFootprint, clearFootprint } = useFootprintStore();

  return {
    footprint: data,
    isLoading,
    error,
    fetchFootprint,
    updateFootprint,
    clearFootprint,
  };
}
