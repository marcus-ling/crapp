// frontend/src/components/HistoryList.jsx
import React from 'react';

export default function HistoryList({ entries }) {
  // Helper to dynamically extract emojis based on stool consistency scores
  const getEmojiForScale = (scale) => {
    const emojis = { 1: "🧱", 2: "🍇", 3: "🌽", 4: "🐍", 5: "🧽", 6: "🌾", 7: "💧" };
    return emojis[scale] || "💩";
  };

  // Helper to map logged color words onto structural HEX values
  const getColorHex = (colorName) => {
    const colors = {
      "Brown": "#7A431D", "Dark Brown": "#4A2306", "Green": "#4E6E36",
      "Yellow": "#D4A343", "Pale/Clay": "#C7BCA1", "Black": "#24201E", "Red/Bloody": "#A83232"
    };
    return colors[colorName] || "#7A431D";
  };

  return (
    <div>
      <div className="label-xs" style={{ marginBottom: '12px' }}>Recent Logs</div>
      
      {entries.length === 0 ? (
        <p className="empty-hint" style={{ textAlign: 'center', color: 'var(--muted-fg)', padding: '20px' }}>
          No entries logged yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entries.map(entry => (
            <div key={entry._id || entry.timestamp} className="history-entry">
              <span className="entry-emoji">{getEmojiForScale(entry.bristolScale)}</span>
              
              <div className="entry-meta">
                <div className="entry-type">
                  <span>Type {entry.bristolScale}</span>
                  <div 
                    className="dot-color" 
                    style={{ background: getColorHex(entry.color) }} 
                    title={entry.color} 
                  />
                  {entry.flagged && <span style={{ color: 'var(--red)', marginLeft: 'auto' }}>⚠️ Flagged</span>}
                </div>
                
                <div className="entry-time">
                  {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                {entry.notes && <div className="entry-notes">{entry.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}