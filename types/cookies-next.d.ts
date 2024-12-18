declare module 'cookies-next' {
  export interface CookieOptions {
    path?: string;
    domain?: string;
    maxAge?: number;
    secure?: boolean;
    sameSite?: boolean | 'strict' | 'lax' | 'none';
    httpOnly?: boolean;
  }

  export function getCookie(key: string): string | undefined;
  export function setCookie(key: string, value: string, options?: CookieOptions): void;
  export function deleteCookie(key: string, options?: CookieOptions): void;
  export function hasCookie(key: string): boolean;
}
