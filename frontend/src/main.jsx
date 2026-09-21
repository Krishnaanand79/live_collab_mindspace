import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.jsx';

const clientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '1028191196816-9ikg95s5hdshpkp4dt3c3i6qi8b4ph2l.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
