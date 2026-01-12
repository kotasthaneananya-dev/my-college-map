import { useQuery, useQueryClient } from "@tanstack/react-query";
import { WikipediaService } from "@/services/wikipedia";
import { type SearchLandmarksRequest, type Landmark } from "@/types/landmark";
import { useState, useCallback } from "react";

export function useLandmarks() {
  const [searchParams, setSearchParams] = useState<SearchLandmarksRequest | null>(null);
  const queryClient = useQueryClient();

  const {
    data: landmarks = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/landmarks/search', searchParams],
    queryFn: () => searchParams ? WikipediaService.searchLandmarks(searchParams) : Promise.resolve([]),
    enabled: !!searchParams,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const searchLandmarks = useCallback((params: SearchLandmarksRequest) => {
    setSearchParams(params);
  }, []);

  const invalidateSearch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/landmarks/search'] });
  }, [queryClient]);

  return {
    landmarks,
    isLoading,
    error,
    searchLandmarks,
    refetch,
    invalidateSearch
  };
}

export function useLandmarkDetails(id?: string) {
  return useQuery({
    queryKey: ['/api/landmarks', id],
    queryFn: () => id ? WikipediaService.getLandmarkById(id) : Promise.resolve(null),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
