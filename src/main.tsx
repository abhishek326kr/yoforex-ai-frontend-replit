import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ActiveTradesProvider } from './context/ActiveTradesContext.tsx'

createRoot(document.getElementById("root")!).render(
  <ActiveTradesProvider>
    <App />
  </ActiveTradesProvider>
);
