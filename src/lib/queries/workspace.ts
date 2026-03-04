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
