import React, { useState, useEffect } from 'react';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { BackupMonitor } from './BackupMonitor';
import { BatchOperationsManager } from './BatchOperationsManager';
import { MetadataManager } from './MetadataManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  BarChart, 
  Users, 
  Database, 
  Settings, 
  AlertTriangle,
  Activity
} from 'lucide-react';

// New component for real-time monitoring
const RealTimeMonitor: React.FC = () => {
  const [alerts, setAlerts] = useState<{
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: Date;
  }[]>([]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'alert') {
        setAlerts(prev => [...prev, {
          level: data.level,
          message: data.message,
          timestamp: new Date(data.timestamp)
        }]);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Real-Time Monitoring</h3>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Active Users</h4>
          <div className="text-2xl font-bold text-purple-600">
            {/* Real-time user count */}
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="font-medium mb-2">Active Chats</h4>
          <div className="text-2xl font-bold text-blue-600">
            {/* Real-time chat count */}
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="font-medium mb-2">Moonstone Activity</h4>
          <div className="text-2xl font-bold text-yellow-600">
            {/* Real-time moonstone transactions */}
          </div>
        </Card>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <Alert key={index} variant={alert.level === 'error' ? 'destructive' : 'default'}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {alert.message}
              <span className="text-xs text-gray-500 ml-2">
                {alert.timestamp.toLocaleTimeString()}
              </span>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};

// New component for asset management
const AssetManager: React.FC = () => {
  const [headAssets, setHeadAssets] = useState([
    'Gold Combover', 'Neko Mask', 'Monocle', 'Messy Hair Hat',
    'Jason', 'Horn', 'Grey Combover', 'Green Slicked',
    'Green Mohawk', 'Gold Swirl', 'Gold Slick', 'Gold Horn',
    'Devil Horns', 'Fast Food Goggles', 'Evil Clown'
  ]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Asset Management</h3>
      <div className="grid grid-cols-3 gap-4">
        {headAssets.map(asset => (
          <Card key={asset} className="p-4">
            <img 
              src={`/assets/Head/${asset}.png`}
              alt={asset}
              className="w-full h-32 object-contain mb-2"
            />
            <p className="text-sm font-medium text-center">{asset}</p>
            <div className="mt-2 flex justify-center space-x-2">
              <button className="text-xs text-blue-600">Edit</button>
              <button className="text-xs text-red-600">Disable</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="analytics">
        <TabsList>
          <TabsTrigger value="analytics">
            <BarChart className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="assets">
            <Database className="w-4 h-4 mr-2" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Activity className="w-4 h-4 mr-2" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="users">
          <MetadataManager />
        </TabsContent>

        <TabsContent value="assets">
          <AssetManager />
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-2 gap-8">
            <RealTimeMonitor />
            <BackupMonitor />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <BatchOperationsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 