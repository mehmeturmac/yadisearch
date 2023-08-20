import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ContextAPI
import { MainProvider } from './context/mainContext';

// ChakraUi
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <MainProvider>
    <ChakraProvider toastOptions={{ defaultOptions: { position: 'top-right', duration: 3000 } }}>
      <App />
    </ChakraProvider>
  </MainProvider>
);
