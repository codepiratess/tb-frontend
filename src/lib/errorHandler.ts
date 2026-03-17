import { AxiosError } from 'axios';

export function handleApiError(error: AxiosError): string {
  const response = error.response?.data as any;

  if (response?.errors) {
    // Validation errors array from NestJS (class-validator)
    return response.errors
      .map((e: any) => {
        if (e.constraints) {
          return Object.values(e.constraints).join(', ');
        }
        return e.message;
      })
      .join('\n');
  }

  if (response?.message) {
    return Array.isArray(response.message)
      ? response.message.join(', ')
      : response.message;
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Try again.';
  }

  if (!error.response) {
    return 'Network error. Check your connection.';
  }

  const statusMessages: Record<number, string> = {
    400: 'Invalid request data',
    401: 'Please login to continue',
    403: "You don't have permission",
    404: 'Not found',
    409: 'This already exists',
    422: 'Validation failed',
    429: 'Too many requests. Wait a moment.',
    500: 'Server error. Try again later.',
  };

  return statusMessages[error.response.status] || 'Something went wrong';
}
