import { NextRequest } from 'next/server';

export interface RouteHandlerContext<T = Record<string, string>> {
  params: T;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

export interface APIErrorResponse {
  error: string;
  code: number;
  details?: any;
}

export interface APIConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
} 