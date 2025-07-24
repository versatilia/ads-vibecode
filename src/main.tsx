import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '@atlaskit/css-reset'
import './index.css'
import App from './App.tsx'
import AppProvider from '@atlaskit/app-provider'
import { setGlobalTheme } from '@atlaskit/tokens'

function Main() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    setGlobalTheme({ colorMode: mode });
  }, [mode]);

  return (
    <AppProvider>
      <App mode={mode} onToggleTheme={() => setMode(m => m === 'light' ? 'dark' : 'light')} />
    </AppProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
