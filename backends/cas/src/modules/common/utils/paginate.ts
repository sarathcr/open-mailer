export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function paginate<T>(
  data: T[],
  total: number,
  pagination?: { page?: number; limit: number },
): PaginationResult<T> {
  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? total;
  const totalPages = pagination ? Math.ceil(total / pagination.limit) : 1;

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}
