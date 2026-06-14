import React, {useState, useEffect} from 'react';
import './Report.css';

// 1. Explicitly export or declare the scale configuration array
const BRISTOL_SCALE = [
  { type: 1, label: "Type 1", emoji: "🌰", color: "#C8956C" },
  { type: 2, label: "Type 2", emoji: "🍇", color: "#B87A5A" },
  { type: 3, label: "Type 3", emoji: "🪵", color: "#D4A85A" },
  { type: 4, label: "Type 4", emoji: "🌭", color: "#7BBF96" },
  { type: 5, label: "Type 5", emoji: "💧", color: "#6FB3B0" },
  { type: 6, label: "Type 6", emoji: "🥞", color: "#F0D080" },
  { type: 7, label: "Type 7", emoji: "💦", color: "#E89090" }
];

export default function ReportExportView({ entries = [] }) {
  
  // New States to manage the live dynamic AI summary text and loading speeds
  const [liveAISummary, setLiveAISummary] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Automatically fetch live analysis from the backend when entries change
  useEffect(() => {
    if (!entries || entries.length === 0) return;

    async function fetchLiveAISummary() {
      try {
        setIsLoadingAI(true);
        // Note: Replace 'localhost:5000' with your live Vultr server IP when deploying!
        const response = await fetch('http://localhost:5000/api/insights/ai-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.summary) {
          setLiveAISummary(data.summary);
        }
      } catch (err) {
        console.error("Failed to fetch live AI summary:", err);
        setLiveAISummary("Unable to generate analysis at this time. Please check your internet connection.");
      } finally {
        setIsLoadingAI(false);
      }
    }

    fetchLiveAISummary();
  }, [entries]);

  if (!entries || entries.length === 0) {
    return (
      <div className="report-empty">
        <div style={{ fontSize: '2.5rem' }}>📄</div>
        <p className="empty-hint">Log a few bowel movements to generate your clinical tracking report.</p>
      </div>
    );
  }

  const totalLogs = entries.length;

  // Trailing 7 days calculation
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentEntries = entries.filter(e => new Date(e.timestamp) >= sevenDaysAgo);
  const sevenDayCount = recentEntries.length;
  const averageFrequency = (sevenDayCount / 7).toFixed(1);

  // Frequency mapping calculation
  const distributionCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
  entries.forEach(entry => {
    const type = parseInt(entry.bristolScale, 10);
    if (type >= 1 && type <= 7) {
      distributionCounts[type] += 1;
    }
  });

  const maxBarValue = Math.max(...Object.values(distributionCounts), 1);

  let primaryType = "None";
  let maxCount = -1;
  Object.entries(distributionCounts).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count;
      primaryType = `Type ${type}`;
    }
  });

  // Extract recorded AI analysis notes safely
  const medicalAILogs = entries.filter(e => e.aiAnalysis && e.aiAnalysis.trim() !== "");

  const handleCopyClipboardReport = () => {
    const serializedLines = [
      "=== DIGESTIVE HEALTH CLINICAL REPORT ===",
      `Generated: ${new Date().toLocaleDateString()}`,
      `Total Logs Captured: ${totalLogs} entries`,
      `7-Day Frequency Index: ${averageFrequency} per day`,
      `Primary Stool Profile: ${primaryType}`,
      "\n--- TYPE DISTRIBUTION ---",
      ...Object.entries(distributionCounts).map(([type, count]) => `Type ${type}: ${count} entries`)
    ];

    navigator.clipboard?.writeText(serializedLines.join("\n"))
      .then(() => alert("Report successfully copied to clipboard."))
      .catch(() => alert("Clipboard write block occurred."));
  };

  return (
    <div id="tab-report" className="report-canvas">
      <h2 className="tab-heading">Digestive Health Report</h2>
      
      <div className="info-notice">
        This summary aggregates data from your tracked bowel movements to provide structured insights for clinical reference or personal tracking.
      </div>

      {/* Section 1: Overview Metrics */}
      <section className="report-section">
        <h3 className="section-label">Overview Metrics</h3>
        <div className="report-stat-row">
          <span className="report-stat-label">Reporting Period</span>
          <span className="report-stat-val">Past 7 Days</span>
        </div>
        <div className="report-stat-row">
          <span className="report-stat-label">Total Logs Captured</span>
          <span className="report-stat-val">{totalLogs} entries</span>
        </div>
        <div className="report-stat-row">
          <span className="report-stat-label">Average Logging Frequency</span>
          <span className="report-stat-val">{averageFrequency} / day</span>
        </div>
        <div className="report-stat-row">
          <span className="report-stat-label">Primary Consistency Type</span>
          <span className="report-stat-val">
            {primaryType} {primaryType === "Type 4" && <span className="concern-badge concern--none">Ideal</span>}
          </span>
        </div>
      </section>

      {/* Section 2: Distribution Graph Bars */}
      <section className="report-section">
        <h3 className="section-label">Bristol Type Distribution</h3>
        {BRISTOL_SCALE.map(b => {
          const currentCount = distributionCounts[b.type] || 0;
          const dynamicPercentageWidth = (currentCount / maxBarValue) * 100;

          return (
            <div className="report-type-row" key={b.type}>
              <span className="report-stat-label" style={{ minWidth: '60px' }}>
                {b.label} {b.emoji}
              </span>
              <div className="report-type-bar-track">
                <div 
                  className="report-type-bar-fill" 
                  style={{ 
                    width: `${dynamicPercentageWidth}%`, 
                    backgroundColor: b.color 
                  }}
                />
              </div>
              <span className="report-type-count">{currentCount}</span>
            </div>
          );
        })}
      </section>

      {/* Section 3: Dynamic Live AI Insights */}
      <section className="report-section">
        <h3 className="section-label">AI Analysis Report</h3>
        {isLoadingAI ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}>
            <span style={{ fontSize: '1.2rem', animation: 'spin 1s linear infinite' }}>🔄</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-fg)', margin: 0 }}>
              Gemini is evaluating your 30-day health metrics trend...
            </p>
          </div>
        ) : liveAISummary ? (
          <div className="report-ai-entry" style={{ borderLeft: '3px solid var(--primary)' }}>
            <div className="report-ai-entry__meta" style={{ marginBottom: '8px', color: 'var(--primary)' }}>
              🤖 Live Gemini Insight Engine
            </div>
            <p className="report-ai-entry__text" style={{ whiteSpace: 'pre-line', margin: 0, lineHeight: '1.4' }}>
              {liveAISummary}
            </p>
          </div>
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--muted-fg)', margin: 0 }}>
            No dynamic trend notes generated. Check connection to your backend server.
          </p>
        )}
      </section>

      {/* Flex container holding action buttons matching your layout styling */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="btn btn-primary" onClick={handleCopyClipboardReport}>
          📋 Copy Report Data
        </button>
        
        <button 
          className="btn btn-ghost" 
          onClick={() => window.print()}
          style={{ width: '100%', cursor: 'pointer' }}
        >
          📥 Download Clean Medical PDF
        </button>
      </div>
    </div>
  );
}