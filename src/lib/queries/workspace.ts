import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type WorkspaceData } from '../api';
import { toast } from 'sonner';

export const useWorkspaces = () => {
    return useQuery({
        queryKey: ['workspaces'],
        queryFn: async () => {
            const { data } = await api.get<WorkspaceData[]>('/workspaces');
            return data;
        },
    });
};

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (name: string) => {
            const { data } = await api.post<WorkspaceData>('/workspaces', { name });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            toast.success('Workspace created');
        },
        onError: () => {
            toast.error('Failed to create workspace');
        },
    });
};
export const useUpdateWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ guid, name }: { guid: string; name: string }) => {
            const { data } = await api.patch<WorkspaceData>(`/workspaces/${guid}`, { name });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            toast.success('Workspace renamed');
        },
        onError: () => {
            toast.error('Failed to rename workspace');
        },
    });
};

export const useDeleteWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (guid: string) => {
            await api.delete(`/workspaces/${guid}`);
            return guid;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            toast.success('Workspace deleted');
        },
        onError: () => {
            toast.error('Failed to delete workspace');
        },
    });
};
