import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css' // We'll create this file next

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;