// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './style/general.css'

// import App from './App.tsx'
// import { BrowserRouter } from 'react-router-dom'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <BrowserRouter>
//     <App />
//     </BrowserRouter>
//   </StrictMode>,
// )

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
// import "./style/general.css";
// import "./style/message.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <App />
  </BrowserRouter>
);
