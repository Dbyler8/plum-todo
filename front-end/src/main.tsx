import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'
import { log } from './utils/logger.ts'

log({ event: 'APP_STARTED' });

const useGoogleAuth = import.meta.env.VITE_USE_GOOGLE_AUTH?.toLowerCase() === 'true';
const authClientId = import.meta.env.VITE_AUTH_CLIENT_ID?.trim() ?? '';
const shouldEnableGoogleAuth = useGoogleAuth && authClientId.length > 0;

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

createRoot(document.getElementById('root')!).render(
  shouldEnableGoogleAuth ? (
    <GoogleOAuthProvider clientId={authClientId}>{app}</GoogleOAuthProvider>
  ) : (
    app
  ),
)
