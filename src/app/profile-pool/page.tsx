'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ProfileGenerator } from '@/components/ProfileGenerator';
import { Trash2, Info } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  age: string;
  bio: string;
  traits: string[];
  alignment: string;
  rarity: string;
  powerLevel: number;
  moonstoneBonus: number;
  nftMetadata: {
    alignment: string;
    traits: string[];
  };
}

export default function ProfilePoolPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetadata, setSelectedMetadata] = useState<Record<string, any> | null>(null);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles');
      const data = await response.json();
      if (data.success) {
        setProfiles(data.profiles || []);
      } else {
        setError(data.error || 'Failed to fetch profiles');
      }
    } catch (err) {
      setError('Error fetching profiles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleNewProfilesGenerated = async () => {
    try {
      const response = await fetch('/api/profiles/generate', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success && data.profile) {
        setProfiles(prev => [data.profile, ...prev]);
      } else {
        console.error('Failed to generate profile:', data.error);
      }
    } catch (error) {
      console.error('Error generating profile:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await fetch('/api/profiles', { method: 'DELETE' });
      setProfiles([]);
    } catch (err) {
      console.error('Failed to delete profiles:', err);
    }
  };

  const renderTraits = (profile: Profile) => (
    <div className="space-y-2">
      {profile.nftMetadata?.traits?.map((trait, index) => (
        <div 
          key={index}
          className="text-sm text-gray-300 bg-gray-700 bg-opacity-50 px-3 py-2 rounded"
        >
          {trait}
        </div>
      )) || (
        <div className="text-sm text-gray-400">No personality traits available</div>
      )}
    </div>
  );

  const renderMetadataModal = () => {
    if (!selectedMetadata) return null;

    const formattedMetadata = {
      alignment: selectedMetadata.alignment,
      traits: selectedMetadata.traits
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
        onClick={() => setSelectedMetadata(null)}
      >
        <div 
          className="bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" 
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">NFT Metadata</h3>
            <button 
              onClick={() => setSelectedMetadata(null)} 
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <pre className="text-sm bg-gray-900 p-4 rounded overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(formattedMetadata, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Platypus Dating Pool</h1>
        <div className="flex gap-4">
          <Button 
            onClick={handleNewProfilesGenerated}
            className="flex items-center gap-2"
          >
            Generate Profile
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAll}
            disabled={loading || profiles.length === 0}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete All
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading profiles...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col">
              <div className="relative h-96 bg-black">
                <img 
                  src={`/api/render-platypus?traits=${JSON.stringify(profile.nftMetadata)}`}
                  alt={profile.name}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => setSelectedMetadata(profile.nftMetadata)}
                  className="absolute top-2 right-2 p-2 bg-gray-900 bg-opacity-75 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <Info className="h-5 w-5 text-gray-300" />
                </button>
              </div>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                      {profile.nftMetadata.alignment}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-gray-400">Age: {profile.age}</p>
                  <span className="text-purple-400">•</span>
                  <p className="text-gray-400">{profile.rarity}</p>
                </div>
                <p className="text-gray-300 mb-4">{profile.bio}</p>
                {renderTraits(profile)}
              </div>
            </div>
          ))}
        </div>
      )}

      {renderMetadataModal()}
    </div>
  );
} 