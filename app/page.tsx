import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const PlatypusPassions = dynamic(
  () => import('./components/PlatypusPassions/PlatypusPassions'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    ),
  }
);

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    }>
      <PlatypusPassions />
    </Suspense>
  );
}