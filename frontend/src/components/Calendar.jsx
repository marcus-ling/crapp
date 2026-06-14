// frontend/src/components/Calendar.jsx
import React, { useState, useEffect } from 'react';

// 1. PLACE THE COLOR HELPER OUTSIDE THE COMPONENT FUNCTION HERE
const getHeatColor = (avgScore) => {
  if (!avgScore) return 'transparent';
  if (avgScore <= 2.5) return 'rgba(184, 134, 11, 0.2)'; // Constipated - Muted Gold tone
  if (avgScore > 2.5 && avgScore <= 4.5) return 'rgba(109, 184, 142, 0.25)'; // Normal - Soft Green
  return 'rgba(224, 92, 60, 0.2)'; // Loose - Soft Red
};

export default function Calendar() {
  // Setup standard state variables matching your endpoints [cite: 321-322]
  const [monthlyData, setMonthlyData] = useState({});
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12 [cite: 322]

  // Dynamic calendar date structural calculations 
  const totalDays = new Date(year, month, 0).getDate(); // Total days in current month [cite: 322]
  const firstDayIndex = new Date(year, month - 1, 1).getDay(); // Weekday column offset
  
  const blankPrefixDays = Array.from({ length: firstDayIndex });
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  useEffect(() => {
    // Fetches the aggregated heatmap information from your Phase 2, Step 3 backend route [cite: 313, 323]
    fetch(`http://149.248.61.125:5000/api/entries/calendar/${year}/${month}`)
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(d => { map[d.day] = d; }); // Map array items onto day keys [cite: 323]
        setMonthlyData(map);
      })
      .catch(err => console.error("Error loading calendar heatmap data:", err));
  }, [year, month]);

  // 2. YOUR REPLACEMENT RETURN STATEMENT GOES HERE:
  return (
    <div className="card">
      <div className="cal-days-header">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={idx} className="cal-day-label">{day}</div>
        ))}
      </div>
      <div className="cal-grid">
        {blankPrefixDays.map((_, i) => <div key={`blank-${i}`} className="cal-cell" />)}
        {daysArray.map(dayNum => {
          const dayData = monthlyData[dayNum];
          const cellBg = dayData ? getHeatColor(dayData.avgScore) : 'var(--muted)';
          return (
            <div 
              key={dayNum} 
              className={`cal-cell ${dayData ? 'has-entries' : ''}`}
              style={{ background: cellBg }}
            >
              {dayNum}
              {dayData?.flagged && ( // Matches your backend entry schema tracking property [cite: 93, 315]
                <div className="cal-dots">
                  <div className="cal-dot" style={{ background: 'var(--red)' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

