import { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('loading...');

  useEffect(() => {
    fetch('http://localhost:5000/api/ping')
      .then(res => {
        console.log("Raw Response Object:", res); // 👈 Add this to inspect the response
        return res.json();
      })
      .then(data => {
        console.log("Data received from backend:", data); // 👈 Add this to see the JSON
        setStatus(data.status);
      })
      .catch((err) => {
        console.error("The actual crash error was:", err); // 👈 This reveals the secret error!
        setStatus('error connecting to backend');
      });
  }, []);

  return (
    <div>
      <h1>Backend status: {status}</h1>
    </div>
  );
}

export default App;
