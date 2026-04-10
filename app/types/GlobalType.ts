export interface UseUsersProps {
  pageIndex: number;
  pageSize: number;
  search: string;
}

export interface GetUsersParams  {
  page?: number;
  limit?: number;
  search?: string;
};

export interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
}