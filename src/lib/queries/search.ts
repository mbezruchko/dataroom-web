import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { SearchResponse } from '../api';

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const { data } = await api.get<SearchResponse>(`/search`, {
        params: { query },
      });
      return data;
    },
    enabled: query.length > 0,
  });
};

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await api.get<SearchResponse>('/search/favorites');
      return data;
    },
  });
};

export const useTrash = () => {
  return useQuery({
    queryKey: ['trash'],
    queryFn: async () => {
      const { data } = await api.get<SearchResponse>('/search/trash');
      return data;
    },
  });
};
