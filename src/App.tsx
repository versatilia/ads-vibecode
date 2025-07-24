import { token, setGlobalTheme } from '@atlaskit/tokens';
import styled from '@emotion/styled';
import Heading from '@atlaskit/heading';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Text } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';
import { createPortal } from 'react-dom';
import DependencyMap from './components/DependencyMap';

// Styled components
const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const ToggleFooter = styled.div`
  position: fixed;
  left: 50%;
  bottom: ${token('space.300')};
  transform: translateX(-50%);
  z-index: 10001;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToggleLabel = styled.div`
  margin-top: 4px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

interface AppProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
}

function App({ mode, onToggleTheme }: AppProps) {
  useEffect(() => {
    setGlobalTheme({
      colorMode: mode
    });
  }, [mode]);

  const resetApp = () => {
    // Reset the application by toggling theme and back
    onToggleTheme();
    setTimeout(() => {
      onToggleTheme();
    }, 100);
  };

  return (
    <AppContainer>
      <DependencyMap onResetApp={resetApp} />
      
      {/* Theme toggle at the bottom of the screen */}
      {createPortal(
        <ToggleFooter>
          <Toggle
            isChecked={mode === 'dark'}
            onChange={onToggleTheme}
            size="large"
            label="Dark mode"
          />
          <ToggleLabel>
            <Heading size="xsmall" color={token('color.text.subtlest') as any} as="span">
              Dark mode
            </Heading>
          </ToggleLabel>
        </ToggleFooter>,
        document.body
      )}
    </AppContainer>
  );
}

export default App;