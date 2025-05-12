import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TimeRange } from './types/common';

function App() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gray-50  p-4">
            <Dashboard timeRange={timeRange} setTimeRange={setTimeRange} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;