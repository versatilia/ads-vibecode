import { token, setGlobalTheme } from '@atlaskit/tokens';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import Button from '@atlaskit/button';
import DependencyMap from './components/DependencyMap';

// Styled components
const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: ${token('elevation.surface')};
  background-image: 
    radial-gradient(circle at 1px 1px, ${token('color.border')} 1px, transparent 0);
  background-size: 24px 24px;
  background-position: 0 0;
`;

const ThemeToggle = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 2000;
`;



function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setGlobalTheme({
      colorMode: isDarkMode ? 'dark' : 'light'
    });
  }, [isDarkMode]);

  const resetApp = () => {
    // Reset functionality - could be expanded if needed
    console.log('App reset requested');
  };

  return (
    <AppContainer>
      <ThemeToggle>
        <Button
          appearance={isDarkMode ? "primary" : "default"}
          onClick={() => setIsDarkMode(!isDarkMode)}
          size="small"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </ThemeToggle>
      <DependencyMap onResetApp={resetApp} isDarkMode={isDarkMode} />
    </AppContainer>
  );
}

export default App;