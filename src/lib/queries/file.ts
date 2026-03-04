import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import type { FileData } from '../api';
import type { AxiosRequestConfig } from 'axios';

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
        headers: { 'Content-Type': 'multipart/form-data' },
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
    mutationFn: async ({ id, folder_id }: { id: number; folder_id: number | null }) => {
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
