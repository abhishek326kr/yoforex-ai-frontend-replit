import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
<<<<<<< HEAD
import { ActiveTradesProvider } from './context/ActiveTradesContext.tsx'

createRoot(document.getElementById("root")!).render(
  <ActiveTradesProvider>
    <App />
  </ActiveTradesProvider>
);
=======

createRoot(document.getElementById("root")!).render(<App />);
>>>>>>> b4124768c1c2556d3f28e2a049b8eb07f3794dc2
