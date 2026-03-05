import type { FileData, FolderData } from "./api";

export type SortField = 'name' | 'date' | 'size';
export type SortOrder = 'asc' | 'desc';

export const sortResources = <T extends FileData | FolderData>(
  items: T[],
  field: SortField,
  order: SortOrder
): T[] => {
  return [...items].sort((a, b) => {
    // Keep favorites on top
    if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;

    let comparison = 0;
    switch (field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date': {
        const dateA = new Date(a.updated_at || a.created_at).getTime();
        const dateB = new Date(b.updated_at || b.created_at).getTime();
        comparison = dateA - dateB;
        break;
      }
      case 'size': {
        const sizeA = 'size' in a ? (a.size as number || 0) : ('files_count' in a ? (a as FolderData).files_count : 0);
        const sizeB = 'size' in b ? (b.size as number || 0) : ('files_count' in b ? (b as FolderData).files_count : 0);
        comparison = sizeA - sizeB;
        break;
      }
    }

    return order === 'asc' ? comparison : -comparison;
  });
};
