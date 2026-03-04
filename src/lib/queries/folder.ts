import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import type { FolderDetailed, FolderData, FolderBreadcrumb, FileData } from '../api';

export const useFolder = (folderId: number | 'root') => {
  return useQuery({
    queryKey: ['folder', folderId],
    queryFn: async () => {
      if (folderId === 'root') {
        const folders = (await api.get<FolderData[]>('/folders')).data;
        const files = (await api.get<FileData[]>('/files')).data;
        return {
          id: 0,
          name: 'Storage',
          subfolders: folders,
          files: files,
          files_count: files.length,
          parent_id: null,
          is_deleted: false,
          is_favorite: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as FolderDetailed;
      }
      const { data } = await api.get<FolderDetailed>(`/folders/${folderId}`);
      return data;
    },
  });
};

export const useFolderPath = (folderId: number | 'root') => {
  return useQuery({
    queryKey: ['folderPath', folderId],
    queryFn: async () => {
      if (folderId === 'root') return [];
      const { data } = await api.get<FolderBreadcrumb[]>(`/folders/${folderId}/path`);
      return data;
    },
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, parent_id }: { name: string; parent_id?: number | null }) => {
      const { data } = await api.post<FolderData>('/folders', { name, parent_id });
      return { data, parent_id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, parent_id }: { id: number; parent_id?: number | null }) => {
      await api.delete(`/folders/${id}`);
      return { id, parent_id };
    },
    onSuccess: ({ parent_id }: { parent_id?: number | null }) => {
      const cacheId = parent_id ?? 'root';
      queryClient.invalidateQueries({ queryKey: ['folder', cacheId] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
    },
  });
};

export const useToggleFavoriteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_favorite }: { id: number; is_favorite: boolean }) => {
      const { data } = await api.patch(`/folders/${id}/favorite`, { is_favorite });
      return { id, is_favorite, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
    },
  });
};

export const useRenameFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const { data } = await api.patch<FolderData>(`/folders/${id}`, { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
