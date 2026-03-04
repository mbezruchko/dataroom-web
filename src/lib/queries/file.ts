import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
    onSuccess: (_, { files }) => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      const count = files.length;
      toast.success(count === 1 ? 'File uploaded' : `Uploaded files: ${count}`);
    },
    onError: () => {
      toast.error('Failed to upload file(s)');
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
      toast.success('File deleted');
    },
    onError: () => {
      toast.error('Failed to delete file');
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
    onSuccess: (_, { is_favorite }) => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      toast.success(is_favorite ? 'File added to favorites' : 'File removed from favorites');
    },
    onError: () => {
      toast.error('Failed to change favorite');
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
      toast.success('File restored');
    },
    onError: () => {
      toast.error('Failed to restore file');
    },
  });
};
