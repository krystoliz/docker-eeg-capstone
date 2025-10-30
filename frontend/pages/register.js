import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(email, password);
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Already have an account?{' '}
        <a href="#" onClick={() => router.push('/login')} style={styles.link}>
          Login here
        </a>
      </p>
    </div>
  );
}
// Basic styles (same as login)
const styles = {
  container: { width: '300px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' },
  form: { display: 'flex', flexDirection: 'column' },
  input: { marginBottom: '10px', padding: '8px' },
  button: { padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' },
  link: { color: '#0070f3', cursor: 'pointer' }
};