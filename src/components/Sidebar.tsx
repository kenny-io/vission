import React, { useState, useEffect } from 'react';
import { Home, BarChart2, Database, Activity, Layers } from 'lucide-react';
import { fetchNetworkHealth, NetworkHealthResponse } from '../services/api';

export const Sidebar: React.FC = () => {
  const [networkHealth, setNetworkHealth] = useState<NetworkHealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const getNetworkHealth = async () => {
      try {
        setLoading(true);
        const data = await fetchNetworkHealth();
        setNetworkHealth(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching network health:', err);
        setError('Unable to fetch network status');
      } finally {
        setLoading(false);
      }
    };
    
    getNetworkHealth();
    
    // Refresh network health every 30 seconds
    const interval = setInterval(getNetworkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format uptime to days, hours, minutes
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };
  return (
    <aside className="w-20 md:w-56 bg-primary-700 flex flex-col items-center py-6 px-2 md:px-4">
      <div className="mb-10 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <Activity className="h-5 w-5 text-primary-700" />
        </div>
        <span className="hidden md:inline text-xl font-bold text-white">Shardeum</span>
      </div>
      {/* <div className="hidden md:block text-xs text-white/80 mb-2 ml-2 self-start">
        Blockchain Analytics
      </div> */}
      
      <nav className="flex-1 w-full mt-6">
        <ul className="space-y-2">
          {/* <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/80 hover:bg-blue-700 hover:text-white">
              <Home className="h-5 w-5" /> 
              <span className="hidden md:inline">Home</span>
            </a>
          </li> */}
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary-700 bg-white font-semibold">
              <BarChart2 className="h-5 w-5" /> 
              <span className="hidden md:inline">Dashboard</span>
            </a>
          </li>
          {/* <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/80 hover:bg-blue-700 hover:text-white">
              <Database className="h-5 w-5" /> 
              <span className="hidden md:inline">Blocks</span>
            </a>
          </li> */}
        </ul>
      </nav>
      
      <div className="mt-auto pt-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mb-2 bg-white flex items-center justify-center">
            <Layers className="h-6 w-6 text-primary-700" />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-white">Network Status</div>
            {loading ? (
              <div className="text-xs text-white/70">Loading...</div>
            ) : error ? (
              <div className="text-xs text-red-300">Error</div>
            ) : (
              <div className="text-xs text-white">
                {networkHealth?.status || 'Unknown'}
              </div>
            )}
            <div className="mt-1 px-3 py-1 text-xs bg-white text-black rounded-md flex flex-col">
              {!loading && !error && networkHealth && (
                <>
                  <span>Uptime: {formatUptime(networkHealth.uptime)}</span>
                  {/* <span className="text-xs text-primary-600 mt-1">
                    {networkHealth.isServiceValidatorMode ? 'Validator' : 'Node'}
                  </span> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
