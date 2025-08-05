import { token } from '@atlaskit/tokens';
import styled from '@emotion/styled';
import DependencyMap from './components/DependencyMap';

// Styled components
const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: 
    radial-gradient(circle at 1px 1px, ${token('color.border')} 1px, transparent 0);
  background-size: 24px 24px;
  background-position: 0 0;
`;



function App() {
  const resetApp = () => {
    // Reset functionality - could be expanded if needed
    console.log('App reset requested');
  };

  return (
    <AppContainer>
      <DependencyMap onResetApp={resetApp} />
    </AppContainer>
  );
}

export default App;