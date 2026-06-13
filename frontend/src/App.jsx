import { useState, useEffect } from 'react';
import QuickLogForm from './components/QuickLogForm';
import HistoryList from './components/HistoryList';
import Calendar from './components/Calendar';
import Insights from './components/Insights';
import ReportExportView from './components/Report';

function App() {
  const [entries, setEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('log'); // Navigation control: 'log', 'calendar', 'insights', 'report'

  const fetchEntries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/entries');
      if (!res.ok) throw new Error("Could not fetch database records");
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error("API Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleEntryAdded = (newEntry) => {
    // Immediate state synchronization so lists render without manual page refreshing
    setEntries([newEntry, ...entries]);
  };

  return (
    <div className="mobile-canvas">
      {/* Dynamic Navigation Tab Bar header section */}
      <nav className="tab-navigation">
        <button className={activeTab === 'log' ? 'active' : ''} onClick={() => setActiveTab('log')}>📝 Log</button>
        <button className={activeTab === 'calendar' ? 'active' : ''} onClick={() => setActiveTab('calendar')}>📅 Calendar</button>
        <button className={activeTab === 'insights' ? 'active' : ''} onClick={() => setActiveTab('insights')}>💡 Insights</button>
        <button className={activeTab === 'report' ? 'active' : ''} onClick={() => setActiveTab('report')}>📋 Report</button>
      </nav>

      {/* Main viewport area layout shell switching sections content */}
      <main className="app-content-area" style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        {activeTab === 'log' && (
          <>
            <QuickLogForm onEntryAdded={handleEntryAdded} />
            <div style={{ margin: '24px 0' }} />
            <HistoryList entries={entries} />
          </>
        )}
        {activeTab === 'calendar' && <Calendar />}
        {activeTab === 'insights' && <Insights />} 
        {activeTab === 'report' && <ReportExportView />}
      </main>
    </div>
  );
}

export default App;