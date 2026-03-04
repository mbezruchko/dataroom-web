import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { FolderDetailed, SearchResponse, FolderData, FileData, FolderBreadcrumb } from './api';
import type { AxiosRequestConfig } from 'axios';

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
    mutationFn: async ({ id, parent_id }: { id: number, parent_id?: number | null }) => {
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

interface UploadVariables {
  files: File[];
  folder_id: number | null;
  onUploadProgress?: (progressEvent: any) => void;
}

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ files, folder_id, onUploadProgress }: UploadVariables) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      if (folder_id !== null) {
        formData.append('folder_id', folder_id.toString());
      }
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      };

      const { data } = await api.post<FileData[]>('/files/upload', formData, config);
      return { data, folder_id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, folder_id }: { id: number, folder_id: number | null }) => {
      await api.delete(`/files/${id}`);
      return { id, folder_id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['trash'] });
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

export const useToggleFavoriteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_favorite }: { id: number; is_favorite: boolean }) => {
      const { data } = await api.patch(`/files/${id}/favorite`, { is_favorite });
      return { id, is_favorite, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
    },
  });
};

export const useRestoreFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { data } = await api.post(`/files/${id}/restore`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['trash'] });
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
