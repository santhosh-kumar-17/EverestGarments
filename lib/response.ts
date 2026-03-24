export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export function successResponse<T>(
  message: string,
  data?: T
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message: string, error?: string): ApiResponse {
  return {
    success: false,
    message,
    error: error || message,
  };
}

export function sendResponse(
  status: number,
  success: boolean,
  message: string,
  data?: any,
  error?: string
): Response {
  const response = {
    success,
    message,
    ...(data && { data }),
    ...(error && { error }),
  };
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
