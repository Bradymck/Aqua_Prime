import React from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => {
  return (
    <nav>
      <ul>
        {/* Other navigation links */}
        <li>
          <Link href="/trait-mixer-original">Original Trait Mixer</Link>
        </li>
        <li>
          <Link href="/trait-mixer-v2">Trait Mixer 2.0</Link>
        </li>
        {/* Add more navigation items as needed */}
      </ul>
    </nav>
  );
};

export default NavBar;
