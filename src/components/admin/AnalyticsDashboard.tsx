import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { MetadataStorageService } from '../../services/metadataStorageService';
import { TRAIT_CATEGORIES } from '../../utils/traitConfig';
import { Card } from '../ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    headDistribution: {},
    rarityDistribution: {},
    powerLevelRanges: {},
    moonstoneGeneration: {},
    interactionStats: {
      totalInteractions: 0,
      chatCount: 0,
      callCount: 0,
      simpCount: 0
    }
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const service = MetadataStorageService.getInstance();
    const allMetadata = await service.getAllMetadata();

    // Process head distribution
    const headCounts = Object.fromEntries(
      Object.keys(TRAIT_CATEGORIES.HEAD.weights).map(head => [head, 0])
    );
    allMetadata.forEach(nft => {
      headCounts[nft.traits.head]++;
    });

    // Process other stats...
    setStats({
      headDistribution: headCounts,
      // ... other stats processing
    });
  };

  const headChartData = {
    labels: Object.keys(stats.headDistribution),
    datasets: [{
      label: 'Head Type Distribution',
      data: Object.values(stats.headDistribution),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'
      ]
    }]
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Head Type Distribution</h3>
          <Pie data={headChartData} />
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Power Level Distribution</h3>
          <Bar 
            data={{
              labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
              datasets: [{
                label: 'Power Levels',
                data: Object.values(stats.powerLevelRanges),
                backgroundColor: '#6366f1'
              }]
            }}
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Interaction Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {stats.interactionStats.chatCount}
              </p>
              <p className="text-sm text-gray-600">Total Chats</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {stats.interactionStats.callCount}
              </p>
              <p className="text-sm text-gray-600">Video Calls</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-600">
                {stats.interactionStats.simpCount}
              </p>
              <p className="text-sm text-gray-600">Simp Actions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {stats.interactionStats.totalInteractions}
              </p>
              <p className="text-sm text-gray-600">Total Interactions</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Moonstone Economy</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Moonstone Generated</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.moonstoneGeneration.total}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Burned in Last 24h</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.moonstoneGeneration.burned24h}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 