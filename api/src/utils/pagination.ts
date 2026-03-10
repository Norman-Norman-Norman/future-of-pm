/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: Current page number
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Number of items per page
 *           example: 20
 *         total:
 *           type: integer
 *           description: Total number of items matching the query
 *           example: 150
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 *           example: 8
 *   parameters:
 *     pageParam:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *         minimum: 1
 *       description: Page number (1-based)
 *     limitParam:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 20
 *         minimum: 1
 *       description: Number of items per page
 *     sortOrderParam:
 *       in: query
 *       name: sortOrder
 *       schema:
 *         type: string
 *         enum: [asc, desc]
 *         default: asc
 *       description: Sort direction
 */

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function parsePaginationParams(query: Record<string, string | string[] | undefined>): PaginationParams {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.max(1, parseInt(query.limit as string) || 20);
  const sortBy = query.sortBy as string | undefined;
  const sortOrder: 'asc' | 'desc' = query.sortOrder === 'desc' ? 'desc' : 'asc';
  return { page, limit, sortBy, sortOrder };
}

export function applyPaginationSortFilter<T>(
  items: T[],
  params: PaginationParams,
  filters: Record<string, unknown> = {},
  allowedSortFields: string[] = []
): PaginatedResponse<T> {
  let result = [...items];

  // Apply filters
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === '') continue;
    result = result.filter(item => {
      const rec = item as Record<string, unknown>;
      return String(rec[key]) === String(value);
    });
  }

  // Apply sorting (only if sortBy is in the allowed fields list, or no list is given)
  if (params.sortBy && (allowedSortFields.length === 0 || allowedSortFields.includes(params.sortBy))) {
    const field = params.sortBy;
    const dir = params.sortOrder === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[field];
      const bVal = (b as Record<string, unknown>)[field];
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      if (aVal < bVal) return -1 * dir;
      if (aVal > bVal) return 1 * dir;
      return 0;
    });
  }

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / params.limit));
  const start = (params.page - 1) * params.limit;
  const data = result.slice(start, start + params.limit);

  return {
    data,
    pagination: { page: params.page, limit: params.limit, total, totalPages },
  };
}
