export type QueryResponse<T> = {
  error?: {
    message: string;
  };
  data?: T;
  code?: number;
  count?: number;
  page?: number;
  totalPages?: number;
  totalCount?: number;
  limit?: number;
};

export type MutationResponse = {
  success: boolean;
};
