import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface FileData {
  id: number;
  guid: string;
  name: string;
  size: number;
  folder_id: number;
  is_deleted: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface FolderData {
  id: number;
  guid: string;
  name: string;
  parent_id: number | null;
  is_deleted: boolean;
  is_favorite: boolean;
  files_count: number;
  created_at: string;
  updated_at: string;
}

export interface FolderDetailed extends FolderData {
  subfolders: FolderData[];
  files: FileData[];
}

export interface FolderBreadcrumb {
  id: number;
  guid: string;
  name: string;
}

export interface SearchResponse {
  folders: FolderData[];
  files: FileData[];
}