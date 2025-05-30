
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupCSPReporting, secureDataCleanup } from "./utils/security";

// Initialize security features
setupCSPReporting();

// Clean up expired data on app start
try {
  secureDataCleanup();
} catch (error) {
  console.warn('Failed to clean up expired data:', error);
}

// Production error handling
window.addEventListener('error', (event) => {
  // In production, send to monitoring service instead of console
  if (process.env.NODE_ENV === 'development') {
    console.error('Global error caught:', event.error);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  // In production, send to monitoring service instead of console
  if (process.env.NODE_ENV === 'development') {
    console.error('Unhandled promise rejection:', event.reason);
  }
});

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  console.error('App initialization failed:', error);
}
