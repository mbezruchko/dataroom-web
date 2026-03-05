import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import type { SearchResponse } from '../api';

export const useSearch = (query: string, workspaceGuid?: string) => {
  return useQuery({
    queryKey: ['search', query, workspaceGuid],
    queryFn: async () => {
      const { data } = await api.get<SearchResponse>(`/search`, {
        params: { query, workspace_guid: workspaceGuid },
      });
      return data;
    },
    enabled: query.length > 0,
  });
};

export const useFavorites = (workspaceGuid?: string) => {
  return useQuery({
    queryKey: ['favorites', workspaceGuid],
    queryFn: async () => {
      const { data } = await api.get<SearchResponse>('/search/favorites', {
        params: { workspace_guid: workspaceGuid }
      });
      return data;
    },
  });
};

export const useTrash = (workspaceGuid?: string) => {
  return useQuery({
    queryKey: ['trash', workspaceGuid],
    queryFn: async () => {
      const { data } = await api.get<SearchResponse>('/search/trash', {
        params: { workspace_guid: workspaceGuid }
      });
      return data;
    },
  });
};

export const useEmptyTrash = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workspaceGuid: string) => {
      await api.delete(`/search/trash/empty`, {
        params: { workspace_guid: workspaceGuid }
      });
    },
    onSuccess: (_, workspaceGuid) => {
      queryClient.invalidateQueries({ queryKey: ['trash', workspaceGuid] });
    },
  });
};
