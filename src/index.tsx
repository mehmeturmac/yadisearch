import ReactDOM from 'react-dom/client';
import App from './App';

// ContextAPI
import { MainProvider } from './context/mainContext';

// ChakraUi
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const theme = extendTheme({ initialColorMode: 'light', useSystemColorMode: true });

root.render(
  <MainProvider>
    <ChakraProvider toastOptions={{ defaultOptions: { position: 'top-right', duration: 3000 } }}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </MainProvider>
);
