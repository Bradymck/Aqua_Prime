'use client'

import { useState, useEffect } from 'react';
import { DatingProfileGenerator } from '@/components/DatingProfileGenerator';
import type { PlatypusProfile } from '@/types/platypus-passions';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<PlatypusProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      console.log('Starting to fetch profiles...');
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/profiles/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 5 }),
      });

      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch profiles: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);

      if (data.success && Array.isArray(data.profiles)) {
        console.log('Setting profiles:', data.profiles.length);
        setProfiles((currentProfiles) => {
          // If this is the first fetch, just set the profiles
          if (currentProfiles.length === 0) {
            return data.profiles;
          }
          // Otherwise, append new profiles
          return [...currentProfiles, ...data.profiles];
        });
      } else {
        throw new Error(data.error || 'Invalid response format');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error fetching profiles:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    console.log('ProfilesPage mounted');
    fetchProfiles();
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    console.log('Swiping:', direction);
    if (currentProfile >= profiles.length - 2) {
      // Fetch more profiles when we're close to running out
      console.log('Fetching more profiles...');
      fetchProfiles();
    }
    setCurrentProfile(prev => prev + 1);
  };

  const handleSuperlike = () => {
    // Handle superlike action
    handleSwipe('right');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Profiles</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={fetchProfiles}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-md mx-auto h-[80vh]">
        <DatingProfileGenerator
          profiles={profiles}
          currentProfile={currentProfile}
          onSwipe={handleSwipe}
          onSuperlike={handleSuperlike}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}