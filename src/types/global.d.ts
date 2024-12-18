declare module '@/types/*';
declare module '@/services/*';
declare module '@/utils/*';
declare module '@/lib/*';
declare module '@/components/*';

declare module 'ws' {
  export = WebSocket;
}

declare module 'nodemailer' {
  export = nodemailer;
} 