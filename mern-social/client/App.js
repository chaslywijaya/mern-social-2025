// client/App.js
import React from 'react';
import MainRouter from './MainRouter';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles'; // From @mui/material/styles (for v5)
import theme from './theme'; // Your custom theme
import createEmotionCache from '@emotion/cache'; // Import createEmotionCache
import { CacheProvider } from '@emotion/react'; // Import CacheProvider

// Optional: If you decide to keep @mui/styles for some reason, and need specific JSS insertion order
// import { StyledEngineProvider } from '@mui/material/styles';

const clientSideEmotionCache = createEmotionCache({ key: 'css', prepend: true });

const App = () => {
  // This useEffect is for removing JSS styles, which is fine if you still have them from
  // previous setup, but becomes less relevant as you move fully to Emotion.
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <BrowserRouter>
      {/* IMPORTANT: Wrap with CacheProvider
        This provides the Emotion cache to all Material-UI components on the client-side.
        It's crucial for correct style injection and rehydration from SSR.
      */}
      <CacheProvider value={clientSideEmotionCache}>
        {/*
          StyledEngineProvider is usually needed if you mix `@mui/styles` (JSS) with Material-UI v5 (Emotion).
          If you've completely removed `@mui/styles` and migrated to `sx` prop/`styled`,
          you might not strictly need it, but it doesn't hurt.
        */}
        {/* <StyledEngineProvider injectFirst> */} 
          <ThemeProvider theme={theme}>
            <MainRouter />
          </ThemeProvider>
        {/* </StyledEngineProvider> */}
      </CacheProvider>
    </BrowserRouter>
  );
};

export default App;