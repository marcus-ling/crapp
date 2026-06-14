import React from 'react';

const getColorHex = (colorName) => {
  if (!colorName) return "#7A431D";
  const n = String(colorName).toLowerCase();

  const colors = {
    // canonical / user-facing names
    "brown": "#7A431D",
    "dark brown": "#4A2306",
    "green": "#4E6E36",
    "yellow": "#D4A343",
    "pale/clay": "#C7BCA1",
    "black": "#24201E",
    "red/bloody": "#A83232",

    // common variants from seed data or legacy values
    "dark-brown": "#4A2306",
    "light-brown": "#7A431D",
    "pale-clay": "#C7BCA1"
  };

  return colors[n] || colors[n.replace(/\-/g, ' ')] || "#7A431D";
};

const getEmojiForScale = (scale) => {
  const emojis = {
    1: "🧱", 2: "🍇", 3: "🌽",
    4: "🐍", 5: "🧽", 6: "🌾", 7: "💧"
  };
  return emojis[scale] || "💩";
};

const getBristolLabel = (scale) => {
  const labels = {
    1: "Severe constipation",
    2: "Mild constipation",
    3: "Normal",
    4: "Optimal",
    5: "Lacking fiber",
    6: "Mild diarrhea",
    7: "Severe diarrhea"
  };
  return labels[scale] || "Unknown";
};

export default function HistoryList({ entries }) {
  return (
    <div>
      <div className="label-xs" style={{ marginBottom: '12px' }}>Recent Logs</div>

      {entries.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--muted-fg)', padding: '20px' }}>
          No entries logged yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entries.map(entry => (
            <div key={entry._id || entry.timestamp} className="history-entry">

              {/* Left: emoji */}
              <span className="entry-emoji">
                {getEmojiForScale(entry.bristolScale)}
              </span>

              {/* Right: details */}
              <div className="entry-meta" style={{ flex: 1 }}>

                {/* Top row: type label + color dot + color name */}
                <div className="entry-type" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Type {entry.bristolScale}</span>
                  <span style={{ color: 'var(--muted-fg)', fontSize: '12px' }}>
                    {getBristolLabel(entry.bristolScale)}
                  </span>
                  <div
                    style={{
                      width: 12, height: 12, borderRadius: '50%',
                      background: getColorHex(entry.color),
                      border: '1px solid rgba(0,0,0,0.2)',
                      flexShrink: 0
                    }}
                    title={entry.color || 'Brown'}
                  />
                  {entry.color && (
                    <span style={{ fontSize: '11px', color: 'var(--muted-fg)' }}>
                      {entry.color}
                    </span>
                  )}
                </div>

                {/* Second row: date + time + duration */}
                <div className="entry-time" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>
                    {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    {' • '}
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {entry.duration && (
                    <span style={{
                      fontSize: '11px',
                      background: 'var(--surface-2, #f0f0f0)',
                      padding: '2px 6px',
                      borderRadius: '10px'
                    }}>
                      ⏱ {entry.duration}
                    </span>
                  )}
                </div>

                {/* Notes (if any) */}
                {entry.notes && (
                  <div style={{
                    fontSize: '12px',
                    marginTop: '4px',
                    color: 'var(--muted-fg)',
                    fontStyle: 'italic'
                  }}>
                    "{entry.notes}"
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}