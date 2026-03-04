import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  selectedFileIds: number[];
  toggleFileSelection: (id: number) => void;
  clearFileSelection: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  selectedFileIds: [],
  toggleFileSelection: (id) => set((state) => {
    const isSelected = state.selectedFileIds.includes(id);
    return {
      selectedFileIds: isSelected
        ? state.selectedFileIds.filter(fId => fId !== id)
        : [...state.selectedFileIds, id]
    };
  }),
  clearFileSelection: () => set({ selectedFileIds: [] }),
}));