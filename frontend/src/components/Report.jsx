import React from 'react';
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
    const type = parseInt(entry.bristolType, 10);
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

      {/* Section 3: AI Insights Logs List */}
      <section className="report-section">
        <h3 className="section-label">AI Analysis Notes</h3>
        {medicalAILogs.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--muted-fg)', margin: 0 }}>
            No automatic trend notes captured inside current database log selections.
          </p>
        ) : (
          medicalAILogs.slice(0, 5).map(e => {
            // FIX: Added safe lookup protection if type mapping isn't fully found
            const entryType = parseInt(e.bristolType, 10);
            const scaleMeta = BRISTOL_SCALE.find(x => x.type === entryType) || { emoji: "📝", label: `Type ${entryType || 'Unknown'}` };

            return (
              <div className="report-ai-entry" key={e._id || e.id || e.timestamp}>
                <div className="report-ai-entry__meta">
                  {scaleMeta.emoji} {scaleMeta.label} · {new Date(e.timestamp).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                </div>
                <p className="report-ai-entry__text">{e.aiAnalysis}</p>
              </div>
            );
          })
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