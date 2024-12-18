import React from 'react';
import { Providers } from '@/providers/providers';

interface ClientLayoutProps {
  children: React.ReactNode;
  geistSans: string;
  geistMono: string;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, geistSans, geistMono }) => {
  return (
    <div className={`${geistSans} ${geistMono} font-sans`}>
      <Providers>
        {children}
      </Providers>
    </div>
  );
};

export default ClientLayout;
