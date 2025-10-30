import { useState, useEffect, useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

// --- NEW: Emotion Color Helper ---
const getEmotionColor = (emotion) => {
  switch (emotion) {
    case 'Positive':
      return 'green';
    case 'Negative':
      return 'red';
    case 'Neutral':
      return 'gray';
    default:
      return 'black';
  }
};

export default function Home() {
  const [emotionData, setEmotionData] = useState(null);
  const { user, logout, loading, token } = useAuth();
  const router = useRouter();

  // ... (websocketUrl, useWebSocket, useEffects are all unchanged) ...
  const websocketUrl = useMemo(() => {
    if (token) {
      return `ws://localhost:8000/ws?token=${token}`;
    }
    return null;
  }, [token]);

  const { lastMessage, readyState } = useWebSocket(websocketUrl, {
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      setEmotionData(data);
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (loading) return; 
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]); 

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <button onClick={logout} style={{ float: 'right' }}>Logout</button>
      <h1>EEG Real-Time Monitor</h1>
      <nav>
        <Link href="/" style={{ marginRight: '10px', fontWeight: 'bold' }}>Dashboard</Link>
        <Link href="/history">View History</Link>
      </nav>
      <hr style={{ margin: '20px 0' }} />
      
      {!token && <p>Authenticating...</p>}
      {token && <p>WebSocket Status: <strong>{connectionStatus}</strong></p>}
      
      {readyState === ReadyState.OPEN ? (
        <div>
          <h2>Current Emotion:</h2>
          {/* --- UPDATED COLOR LOGIC --- */}
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: emotionData ? getEmotionColor(emotionData.classified_emotion) : 'black'
          }}>
            {emotionData ? emotionData.classified_emotion : 'Waiting for data...'}
          </div>
          
          {emotionData && (
            <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
              {JSON.stringify(emotionData, null, 2)}
            </pre>
          )}
        </div>
      ) : (
        <p>Connecting to real-time service...</p>
      )}
    </div>
  );
}