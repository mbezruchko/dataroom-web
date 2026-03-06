import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../api';
import type { FolderDetailed, FolderData, FolderBreadcrumb, FileData } from '../api';

export const useFolder = (folderId: string | 'root', workspaceGuid?: string | null) => {
  return useQuery({
    queryKey: ['folder', folderId, workspaceGuid],
    queryFn: async () => {
      if (folderId === 'root') {
        const url = workspaceGuid ? `/folders?workspace_guid=${workspaceGuid}` : '/folders';
        const filesUrl = workspaceGuid ? `/files?workspace_guid=${workspaceGuid}` : '/files';
        const folders = (await api.get<FolderData[]>(url)).data;
        const files = (await api.get<FileData[]>(filesUrl)).data;
        return {
          id: 0,
          guid: 'root',
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

export const useFolderPath = (folderId: string | 'root') => {
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
    mutationFn: async ({ name, parent_guid, workspace_guid }: { name: string; parent_guid?: string | null, workspace_guid?: string }) => {
      const { data } = await api.post<FolderData>('/folders', { name, parent_guid, workspace_guid });
      return { data, parent_guid };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      toast.success('Folder created');
    },
    onError: () => {
      toast.error('Failed to create folder');
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ guid, parent_id }: { guid: string; parent_id?: string | null }) => {
      await api.delete(`/folders/${guid}`);
      return { guid, parent_id };
    },
    onSuccess: ({ parent_id }: { parent_id?: string | null }) => {
      const cacheId = parent_id ?? 'root';
      queryClient.invalidateQueries({ queryKey: ['folder', cacheId] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      toast.success('Folder deleted');
    },
    onError: () => {
      toast.error('Failed to delete folder');
    },
  });
};

export const useToggleFavoriteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ guid, is_favorite }: { guid: string; is_favorite: boolean }) => {
      const { data } = await api.patch(`/folders/${guid}/favorite`, { is_favorite });
      return { guid, is_favorite, data };
    },
    onSuccess: (_, { is_favorite }) => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      toast.success(is_favorite ? 'Folder added to favorites' : 'Folder removed from favorites');
    },
    onError: () => {
      toast.error('Failed to change favorite');
    },
  });
};

export const useRenameFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ guid, name }: { guid: string; name: string }) => {
      const { data } = await api.patch<FolderData>(`/folders/${guid}`, { name });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['folderPath'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Folder renamed');
    },
    onError: () => {
      toast.error('Failed to rename folder');
    },
  });
};
