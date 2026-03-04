import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../api';
import type { FileData } from '../api';
import type { AxiosRequestConfig } from 'axios';

interface UploadVariables {
  files: File[];
  folder_guid: string | null;
  workspace_guid?: string;
  onUploadProgress?: (progressEvent: any) => void;
}

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ files, folder_guid, workspace_guid, onUploadProgress }: UploadVariables) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      if (folder_guid !== null) {
        formData.append('folder_guid', folder_guid);
      }
      if (workspace_guid) {
        formData.append('workspace_guid', workspace_guid);
      }
      const config: AxiosRequestConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      };
      const { data } = await api.post<FileData[]>('/files/upload', formData, config);
      return { data, folder_guid };
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
    mutationFn: async ({ guid, folder_id }: { guid: string; folder_id: string | null }) => {
      await api.delete(`/files/${guid}`);
      return { guid, folder_id };
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
    mutationFn: async ({ guid, is_favorite }: { guid: string; is_favorite: boolean }) => {
      const { data } = await api.patch(`/files/${guid}/favorite`, { is_favorite });
      return { guid, is_favorite, data };
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

export const useRenameFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ guid, name }: { guid: string; name: string }) => {
      const normalizedName = name.trim().toLowerCase().endsWith('.pdf') ? name.trim() : `${name.trim()}.pdf`;
      const { data } = await api.patch<FileData>(`/files/${guid}`, { name: normalizedName });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      toast.success('File renamed');
    },
    onError: () => {
      toast.error('Failed to rename file');
    },
  });
};

export const useRestoreFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ guid }: { guid: string }) => {
      const { data } = await api.post(`/files/${guid}/restore`);
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
