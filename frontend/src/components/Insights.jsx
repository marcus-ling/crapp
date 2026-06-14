// frontend/src/components/Insights.jsx
import React, { useState, useEffect } from 'react';

export default function Insights() {
  // 1. Setup states for backend analytics data and AI results
  const [data, setData] = useState({ correlations: [], redFlags: [] });
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    // Fetch static analytics from backend insights router endpoint
    fetch('http://localhost:5000/api/insights')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching insights:", err);
        setLoading(false);
      });
  }, []);

  const generateAISummary = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('http://localhost:5000/api/insights/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const resData = await res.json();
      setAiSummary(resData.summary || 'No summary returned.');
    } catch (err) {
      console.error("Error generating AI summary:", err);
      setAiSummary('Could not generate summary. Please try again.');
    }
    setLoadingAI(false);
  };

  if (loading) return <div className="card">Loading insights...</div>;

  const hasRedFlags = data.redFlags && data.redFlags.length > 0;

  return (
    <div>
      {/* Figma stats dashboard metrics grid */}
      <div className="score-grid">
        <div className="score-card">
          <div className="score-val" style={{ color: 'var(--green)' }}>4.2</div>
          <div className="score-sub">Avg Scale</div>
        </div>
        <div className="score-card">
          <div className="score-val">
            {data.correlations.reduce((acc, c) => acc + (c.occurrences || 0), 0) || 18}
          </div>
          <div className="score-sub">Total Logs</div>
        </div>
        <div className="score-card">
          <div className="score-val" style={{ color: 'var(--primary-dark)' }}>6 days</div>
          <div className="score-sub">Max Streak</div>
        </div>
      </div>

      {/* Styled alert box displaying any active warnings */}
      {hasRedFlags && (
        <div className="trend-card alert" style={{ marginBottom: '20px' }}>
          <span className="trend-icon">⚠️</span>
          <div className="trend-meta">
            <div className="trend-text" style={{ color: 'var(--red)', fontWeight: '600' }}>Red Flag Detected</div>
            <div className="trend-sub">
              {data.redFlags.join(' ')} 
            </div>
          </div>
        </div>
      )}

      {/* Headline Feature: AI Health Summary Section */}
      <div style={{ marginBottom: '24px', marginTop: '16px' }}>
        <h3>AI Health Summary</h3>
        <button 
          onClick={generateAISummary}
          disabled={loadingAI}
          style={{ padding: '10px 20px', marginBottom: '12px', cursor: 'pointer' }}
        >
          {loadingAI ? 'Generating...' : 'Generate AI Summary'}
        </button>
        {aiSummary && (
          <div style={{ 
            background: '#f0f7ff', 
            border: '1px solid #4a90d9',
            borderRadius: '8px', 
            padding: '16px',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>{aiSummary}</p>
            <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', marginBottom: 0 }}>
              AI-generated summary based on your logged data. Not a medical diagnosis.
            </p>
          </div>
        )}
      </div>

      {/* Trends / Note Correlations Table Section */}
      <div className="card" style={{ marginTop: '16px' }}>
        <h3>Possible Patterns</h3>
        {data.correlations.length === 0 ? (
          <p style={{ fontSize: '14px', color: 'var(--muted-fg)', marginTop: '8px' }}>
            Not enough data yet to detect patterns. Keep logging!
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Note Context</th>
                <th style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Times</th>
                <th style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {data.correlations.map((c, i) => (
                <tr key={i}>
                  <td style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>{c.context || 'General Pattern'}</td>
                  <td style={{ textAlign: 'center', borderBottom: '1px solid var(--border)' }}>{c.occurrences}</td>
                  <td style={{ textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      background: c.confidence === 'low' ? 'var(--muted)' : 'var(--green)',
                      color: c.confidence === 'low' ? 'var(--muted-fg)' : 'white'
                    }}>
                      {c.confidence}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}