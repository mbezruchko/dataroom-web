import { Navigate, useParams, useLocation } from "react-router-dom";
import { useWorkspaces } from "@/lib/queries/workspace";
import { Loader2 } from "lucide-react";

export function WorkspaceRedirect() {
    const { workspaceGuid } = useParams<{ workspaceGuid: string }>();
    const { data: workspaces, isLoading } = useWorkspaces();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!workspaceGuid && workspaces && workspaces.length > 0) {
        const defaultWorkspace = workspaces[0].guid;
        const path = location.pathname === '/' ? '/root' : location.pathname;
        return <Navigate to={`/${defaultWorkspace}${path}`} replace />;
    }

    // Fallback if no workspaces exist
    if (!workspaceGuid) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center p-4">
                <h1 className="text-xl font-bold mb-2">No workspace found</h1>
                <p className="text-muted-foreground">Please create a workspace to continue.</p>
            </div>
        );
    }

    return null;
}
