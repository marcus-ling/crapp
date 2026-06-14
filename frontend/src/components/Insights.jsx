import React, { useState, useEffect } from 'react';

export default function Insights() {
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  
  const [computedStats, setComputedStats] = useState({
    avgScale: '0.0',
    totalLogs: 0,
    maxStreak: 0
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/entries')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(entries => {
        if (!entries || entries.length === 0) {
          setComputedStats({ avgScale: '0.0', totalLogs: 0, maxStreak: 0 });
          setLoading(false);
          return;
        }

        const totalLogs = entries.length;

        const sumTypes = entries.reduce((acc, curr) => acc + (parseInt(curr.bristolScale, 10) || 4), 0);
        const avgScale = (sumTypes / totalLogs).toFixed(1);

        const loggedDates = new Set(entries.map(e => new Date(e.timestamp).toDateString()));
        let currentStreak = 0;
        let checkDate = new Date();
        
        while (loggedDates.has(checkDate.toDateString())) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
          if (currentStreak > 365) break;
        }

        setComputedStats({ avgScale, totalLogs, maxStreak: currentStreak });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error calculating client insights:", err);
        setLoading(false);
      });
  }, []);

  const generateAISummary = async () => {
    setLoadingAI(true);
    setAiSummary('');

    if (computedStats.totalLogs === 0) {
      setAiSummary("Please log a few entries first to generate a summary.");
      setLoadingAI(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/insights/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Backend error');

      const data = await res.json();
      setAiSummary(data.summary);
    } catch (err) {
      setAiSummary('Could not generate summary — please check your connection and try again.');
      console.error('AI summary error:', err);
    }

    setLoadingAI(false);
  };

  if (loading) return <div className="card">Loading insights...</div>;

  return (
    <div>
      <div className="score-grid" style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div className="score-card" style={{ flex: 1, background: 'var(--card)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div className="score-val" style={{ color: 'var(--green)', fontSize: '1.6rem', fontWeight: 'bold' }}>{computedStats.avgScale}</div>
          <div className="score-sub" style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', marginTop: '4px' }}>Avg Scale</div>
        </div>
        
        <div className="score-card" style={{ flex: 1, background: 'var(--card)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div className="score-val" style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>{computedStats.totalLogs}</div>
          <div className="score-sub" style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', marginTop: '4px' }}>Total Logs</div>
        </div>
        
        <div className="score-card" style={{ flex: 1, background: 'var(--card)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div className="score-val" style={{ color: 'var(--primary-dark)', fontSize: '1.6rem', fontWeight: 'bold' }}>{computedStats.maxStreak} days</div>
          <div className="score-sub" style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', marginTop: '4px' }}>Logging Streak</div>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>AI Health Summary</h3>
        
        <button 
          className="btn btn-primary"
          onClick={generateAISummary}
          disabled={loadingAI}
          style={{ width: 'auto', padding: '10px 20px', marginBottom: '14px', cursor: 'pointer' }}
        >
          {loadingAI ? 'Analyzing Logs...' : 'Generate AI Summary'}
        </button>

        {aiSummary && (
          <div style={{ 
            background: 'var(--card)', 
            border: '1px solid var(--border)',
            borderRadius: '12px', 
            padding: '16px',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--foreground)' }}>{aiSummary}</p>
            <p style={{ fontSize: '11px', color: 'var(--muted-fg)', marginTop: '10px', marginBottom: 0 }}>
              This summary is generated from your logged data to help you communicate with your doctor. It is not a medical diagnosis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}