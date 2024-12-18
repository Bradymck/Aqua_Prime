declare module '@privy-io/react-auth' {
  export interface PrivyUser {
    wallet?: {
      address: string;
    };
    email?: string;
  }

  export interface PrivyInterface {
    login: () => Promise<void>;
    authenticated: boolean;
    user: PrivyUser | null;
    ready: boolean;
    signOut: () => Promise<void>;
  }

  export function usePrivy(): PrivyInterface;
  export function PrivyProvider(props: { children: React.ReactNode; appId: string; config?: any }): JSX.Element;
} 