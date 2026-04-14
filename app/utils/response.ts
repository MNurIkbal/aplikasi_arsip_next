import { NextResponse } from "next/server";

// Interface untuk pagination (khusus tabel/list)
interface MetaData {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

// Interface standar response API
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T ;
  meta?: MetaData;
}

interface ApiResponseSuccess<T> {
  success: boolean;
  message: string;
  data: T | null;
}

/**
 * Helper untuk response sukses biasa (Object/Single Data)
 */
export function successResponse<T>(data: T | null = null, message: string = "Success", status: number = 200) {
  const response: ApiResponseSuccess<T> = {
    success: true,
    message,
    data,
  };
  return NextResponse.json(response, { status });
}

/**
 * Helper untuk response sukses data tabel (Paginasi/List)
 */
export function sendTableResponse<T>(
  data: T[], 
  meta: MetaData, 
  message: string = "Success"
) {
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    meta,
  };
  return NextResponse.json(response, { status: 200 });
}

/**
 * Helper untuk response error
 */
export function sendError(
  message: string = "Internal Server Error", 
  status: number = 500, 
  error?: any
) {
  return NextResponse.json(
    {
      success: false,
      message,
      // Debug hanya muncul di terminal/console, atau di json jika mode development
      ...(process.env.NODE_ENV === "development" && { 
        debug: error instanceof Error ? error.message : error 
      }),
    },
    { status }
  );
}