'use client';

import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

const Header = () => {
  const { login, authenticated, signOut } = usePrivy();

  return (
    <header className="bg-gray-800/50 text-white p-4 absolute top-0 w-full z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AquaPrime
        </Link>
        <div className="flex space-x-4">
          {authenticated ? (
            <button 
              onClick={() => signOut()} 
              className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
            >
              Disconnect
            </button>
          ) : (
            <button 
              onClick={() => login()} 
              className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
            >
              Connect
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header; 