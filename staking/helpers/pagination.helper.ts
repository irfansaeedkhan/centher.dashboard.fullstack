const DEFAULT_PAGE_SIZE = 10;

export function getPaginationInfo(
  page?: number,
  pageSize?: number
): { limit: number; skip: number } {
  const limit = pageSize ? +pageSize : +DEFAULT_PAGE_SIZE;
  let skip = page ? (page === 1 ? 0 : +limit * (+page - 1)) : 0;
  return { limit, skip };
}
