'use client'

import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import TraitMixerV2 from '../../components/TraitMixerV2'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import Header from '../../components/Header'

const APPROVED_ADDRESSES = [
  '0x2026bd9b69593a4002e87049dea6c724654dc38b', // Replace with your address
  '0x4c687C82F2eCcdD993F028E5b39b706F60A7a544'
];

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Page</h1>
      {/* Add your admin page content here */}
    </div>
  );
}
