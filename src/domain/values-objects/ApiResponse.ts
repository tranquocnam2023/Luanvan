import { PaginationResponse } from "./PaginationResponse";

export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errorCode: string;
  statusCode: number;

  /**
   * Constructs an ApiResponse instance.
   */
  constructor({
    success,
    message,
    data,
    errorCode = "",
    statusCode = 0,
  }: {
    success: boolean;
    message: string;
    data: T | null;
    errorCode?: string;
    statusCode?: number;
  }) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }

  /**
   * Creates an ApiResponse from a JSON object.
   * Hỗ trợ data đơn giản (object/mảng) và paginated (nếu có metadata).
   * @param assumePaginated - If true, wrap simple arrays into PaginationResponse<T> (use for lists expecting pagination).
   */
  static fromJson<T>(
    json: Record<string, any>,
    itemMapper?: (item: any) => any,
    assumePaginated = false  // NEW: Toggle for array wrapping
  ): ApiResponse<T> {
    let data: T | null = null;
    const rawData = json.data ?? json.Data;

    if (rawData !== undefined && rawData !== null) {
      // NEW: Handle paginated object structure first (backend-ready)
      if (typeof rawData === 'object' && rawData.items && typeof rawData.totalCounts === 'number') {
        const items = Array.isArray(rawData.items) 
          ? (itemMapper ? rawData.items.map(itemMapper) : rawData.items) as any[]
          : [];
        const paginated = new PaginationResponse<T>(
          items as T[],  // T here assumes caller sets T=PaginationResponse<U> or handles union
          rawData.totalCounts,
          rawData.pageIndex || 1,
          rawData.pageSize || 10
        );
        data = paginated as unknown as T;  // Safe if assumePaginated=true and T=PaginationResponse<U>
      }
      // If array: Wrap ONLY if assumePaginated=true, else keep as-is
      else if (Array.isArray(rawData)) {
        const items = itemMapper ? rawData.map(itemMapper) : rawData;
        if (assumePaginated) {
          const paginated = new PaginationResponse<T>(items as T[], items.length, 1, items.length || 10);
          data = paginated as unknown as T;
        } else {
          data = items as T;  // Keep simple array
        }
      }
      // Simple object
      else if (typeof rawData === 'object') {
        data = (itemMapper ? itemMapper(rawData) : rawData) as T;
      }
    }

    return new ApiResponse<T>({
      success: json.success ?? json.Success ?? false,
      message: json.message ?? json.Message ?? "No message provided",
      data,
      errorCode: json.errorCode ?? json.ErrorCode ?? "",
      statusCode: json.statusCode ?? json.StatusCode ?? 0,
    });
  }

  /**
   * Chuyên cho paginated response (nếu backend update JSON structure).
   * Always wraps arrays or {items,...} into PaginationResponse<T>.
   */
  static fromJsonPaginated<T>(
    json: Record<string, any>,
    itemMapper?: (item: any) => any
  ): ApiResponse<PaginationResponse<T>> {
    let paginatedData: PaginationResponse<T> | null = null;
    const rawData = json.data ?? json.Data;

    if (rawData) {
      // Paginated structure
      if (rawData.items && typeof rawData.totalCounts === 'number') {
        const items = Array.isArray(rawData.items) 
          ? (itemMapper ? rawData.items.map(itemMapper) : rawData.items) as T[]
          : [];
        paginatedData = new PaginationResponse<T>(
          items,
          rawData.totalCounts,
          rawData.pageIndex || 1,
          rawData.pageSize || 10
        );
      } 
      // Fallback: Wrap simple array
      else if (Array.isArray(rawData)) {
        const items = itemMapper ? rawData.map(itemMapper) : rawData;
        paginatedData = new PaginationResponse<T>(items as T[], items.length, 1, items.length || 10);
      }
      // For single object, wrap as 1-item paginated (edge case)
      else if (typeof rawData === 'object') {
        const items = itemMapper ? [itemMapper(rawData)] : [rawData];
        paginatedData = new PaginationResponse<T>(items as T[], 1, 1, 1);
      }
    }

    return new ApiResponse<PaginationResponse<T>>({
      success: json.success ?? false,
      message: json.message ?? "No message provided",
      data: paginatedData,
      errorCode: json.errorCode ?? "",
      statusCode: json.statusCode ?? 0,
    });
  }

  // ... (isSuccess, success, error unchanged)

  /**
   * Checks if the API response indicates success.
   */
  isSuccess(): boolean {
    return this.success === true;
  }

  /**
   * Factory method to create a successful ApiResponse.
   */
  static success<T>(
    data: T,
    message = "Thành công",
    statusCode = 200,
    errorCode = ""
  ): ApiResponse<T> {
    return new ApiResponse<T>({ success: true, message, data, errorCode, statusCode });
  }

  /**
   * Factory method to create a failed ApiResponse.
   */
  static error<T>(
    message = "Thất bại",
    data: T | null = null,
    statusCode = 400,
    errorCode = ""
  ): ApiResponse<T> {
    return new ApiResponse<T>({ success: false, message, data, errorCode, statusCode });
  }
}