import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@atlaskit/css-reset'
import './index.css'
import App from './App.tsx'
import AppProvider from '@atlaskit/app-provider'

function Main() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
