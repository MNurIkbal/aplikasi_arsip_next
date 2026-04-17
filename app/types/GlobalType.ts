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

export interface ArsipType {
  initialData: any[];
  meta: { total: number; totalPages: number };
  serverPage: number;
  serverLimit: number;
  serverSearch: string;
}

export interface GetArsipParams {
  search?: string;
  page: number;
  limit: number;
  sort : string;
  order : string;
}

export interface ArsipPageProps {
    serverPage: number;
    serverLimit: number;
    serverSearch: string;
}


export interface ArsipFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}