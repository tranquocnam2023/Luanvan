export class PaginationResponse<T> {
  data: T[]; // The actual items (array of T)
  pageIndex: number; // Current page index
  pageSize: number;  // Items per page
  totalPages: number; // Total number of pages
  totalCounts: number; // Total record count in the database

  /**
   * Constructs a PaginationResponse instance.
   * @param items - The list of items for the current page
   * @param count - Total count of records
   * @param pageIndex - Current page index (1-based)
   * @param pageSize - Number of items per page
   */
  constructor(items: T[], count: number, pageIndex: number = 1, pageSize: number = 10) {
    this.data = items;
    this.totalCounts = count;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.totalPages = Math.ceil(count / pageSize);
  }

  /**
   * Checks if this is the first page.
   */
  isFirstPage(): boolean {
    return this.pageIndex === 1;
  }

  /**
   * Checks if this is the last page.
   */
  isLastPage(): boolean {
    return this.pageIndex === this.totalPages;
  }

  /**
   * Gets the next page index.
   */
  getNextPage(): number {
    return this.isLastPage() ? this.pageIndex : this.pageIndex + 1;
  }

  /**
   * Gets the previous page index.
   */
  getPreviousPage(): number {
    return this.isFirstPage() ? this.pageIndex : this.pageIndex - 1;
  }

  /**
   * Factory method to create an empty PaginationResponse (e.g., for no results).
   */
  static empty<T>(pageIndex: number = 1, pageSize: number = 10): PaginationResponse<T> {
    return new PaginationResponse<T>([], 0, pageIndex, pageSize);
  }
}