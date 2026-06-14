// frontend/src/components/QuickLogForm.jsx
import React, { useState } from 'react';

// Data configurations placed safely outside the component function block
const BRISTOL_TYPES = [
  { id: 1, emoji: "🧱", name: "Type 1", desc: "Separate hard lumps, like nuts (severe constipation)" },
  { id: 2, emoji: "🍇", name: "Type 2", desc: "Lumpy and sausage-like (mild constipation)" },
  { id: 3, emoji: "🌽", name: "Type 3", desc: "Sausage-like with cracks on surface (normal)" },
  { id: 4, emoji: "🐍", name: "Type 4", desc: "Smooth, soft sausage or snake (optimal)" },
  { id: 5, emoji: "🧽", name: "Type 5", desc: "Soft blobs with clear-cut edges (lacking fiber)" },
  { id: 6, emoji: "🌾", name: "Type 6", desc: "Mushy stool, fluffy pieces, ragged edges (mild diarrhea)" },
  { id: 7, emoji: "💧", name: "Type 7", desc: "Watery, no solid pieces, entirely liquid (severe diarrhea)" }
];

const COLORS = [
  { name: "Brown", hex: "#7A431D" },
  { name: "Dark Brown", hex: "#4A2306" },
  { name: "Green", hex: "#4E6E36" },
  { name: "Yellow", hex: "#D4A343" },
  { name: "Pale/Clay", hex: "#C7BCA1" },
  { name: "Black", hex: "#24201E" },
  { name: "Red/Bloody", hex: "#A83232" }
];

export default function QuickLogForm({ onEntryAdded }) {
  // Initialize state parameters
  const [bristolScale, setBristolScale] = useState(4); // Defaulting to the type 4 normal state
  const [selectedColor, setSelectedColor] = useState("Brown");
  const [duration, setDuration] = useState("2-5 mins");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://149.248.61.125:5000/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bristolScale, 
          color: selectedColor, 
          duration, 
          notes,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!res.ok) throw new Error("Server failed to log configuration entry.");
      
      const newEntry = await res.json();
      
      if (onEntryAdded) {
        onEntryAdded(newEntry);
      }
      
      // Reset contextual parameters after safe execution
      setBristolScale(4);
      setSelectedColor("Brown");
      setDuration("2-5 mins");
      setNotes('');
    } catch (err) {
      console.error("Failed handling creation dispatch submission:", err);
    }
  };

  return (
    <div className="card">
      <div className="label-xs">Bristol Type</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {BRISTOL_TYPES.map(type => (
          <button 
            key={type.id} 
            type="button"
            className={`bristol-btn ${bristolScale === type.id ? 'selected' : ''}`}
            onClick={() => setBristolScale(type.id)}
          >
            <span className="bristol-emoji">{type.emoji}</span>
            <div className="bristol-info">
              <div className="bristol-name">{type.name}</div>
              <div className="bristol-desc">{type.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="label-xs" style={{ marginTop: '16px' }}>Stool Color</div>
      <div className="color-swatches">
        {COLORS.map(c => (
          <button
            key={c.name}
            type="button"
            className={`swatch ${selectedColor === c.name ? 'selected' : ''}`} 
            style={{ background: c.hex }} 
            onClick={() => setSelectedColor(c.name)}
            title={c.name}
          />
        ))}
      </div>

      <div className="label-xs" style={{ marginTop: '16px' }}>Duration</div>
      <div className="dur-pills">
        {['< 2 mins', '2-5 mins', '5-10 mins', '> 10 mins'].map(dur => (
          <button 
            key={dur} 
            type="button"
            className={`dur-pill ${duration === dur ? 'selected' : ''}`}
            onClick={() => setDuration(dur)}
          >
            {dur}
          </button>
        ))}
      </div>

      <div className="label-xs" style={{ marginTop: '16px' }}>Notes</div>
      <textarea 
        placeholder="Add notes about your diet, symptoms, or concerns..." 
        value={notes} 
        onChange={e => setNotes(e.target.value)} 
      />
      
      <button 
        type="button" 
        className="btn btn-primary" 
        style={{ marginTop: '16px', width: '100%' }} 
        onClick={handleSubmit}
      >
        Save Entry
      </button>
    </div>
  );
}