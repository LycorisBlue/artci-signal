/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/types/api-error.ts
export type ApiError<T = string> = {
  status: number;
  message: string;
  data?: {
    errorType?: T;
    errors?: Record<string, string>;
    [key: string]: any;
  };
};
