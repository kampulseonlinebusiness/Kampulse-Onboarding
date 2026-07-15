import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// Point the API client at the backend.
// VITE_API_URL is set at build time:
//   - Production (Render): https://kampulse-api.onrender.com
//   - Development (Replit): empty string → same-origin relative paths work via the proxy
setBaseUrl(import.meta.env.VITE_API_URL ?? '');

createRoot(document.getElementById('root')!).render(<App />);
