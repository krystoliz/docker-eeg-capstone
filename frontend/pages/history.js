import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

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

export default function History() {
  const { user, logout, loading, token } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  // ... (auth and data fetching logic is unchanged) ...
  useEffect(() => {
    if (loading) return; 
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]); 

  useEffect(() => {
    if (token) {
      const fetchHistory = async () => {
        try {
          const res = await axios.get('http://localhost:8001/auth/history');
          setHistory(res.data);
        } catch (err) {
          setError('Failed to fetch history. Please try again.');
          console.error(err);
        }
      };
      fetchHistory();
    }
  }, [token]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <button onClick={logout} style={{ float: 'right' }}>Logout</button>
      <h1>Emotion History</h1>
      <nav>
        <Link href="/" style={{ marginRight: '10px' }}>Dashboard</Link>
        <Link href="/history" style={{ fontWeight: 'bold' }}>View History</Link>
      </nav>
      <hr style={{ margin: '20px 0' }} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {/* ... (table head is unchanged) ... */}
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={styles.th}>Emotion</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Time</th>
            <th style={styles.th}>Alpha Power</th>
            <th style={styles.th}>Beta Power</th>
            <th style={styles.th}>Alpha Asymmetry</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No data logged yet. Keep the dashboard open to log data.
              </td>
            </tr>
          ) : (
            history.map((item) => {
              const d = new Date(item.savedAt);
              return (
                <tr key={item._id} style={styles.tr}>
                  {/* --- UPDATED COLOR LOGIC --- */}
                  <td style={styles.td}>
                    <strong style={{ color: getEmotionColor(item.classified_emotion) }}>
                      {item.classified_emotion}
                    </strong>
                  </td>
                  <td style={styles.td}>{d.toLocaleDateString()}</td>
                  <td style={styles.td}>{d.toLocaleTimeString()}</td>
                  <td style={styles.td}>{item.key_features?.alpha?.toFixed(3) ?? 'N/A'}</td>
                  <td style={styles.td}>{item.key_features?.beta?.toFixed(3) ?? 'N/A'}</td>
                  <td style={styles.td}>{item.key_features?.asymmetry?.toFixed(3) ?? 'N/A'}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// ... (styles are unchanged) ...
const styles = {
  th: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left'
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
  },
  tr: {
    borderBottom: '1px solid #ddd'
  }
};