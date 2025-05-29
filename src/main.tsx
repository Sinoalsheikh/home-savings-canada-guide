
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupCSPReporting } from "./utils/security";

// Initialize security features
setupCSPReporting();

// Clean up expired data on app start
try {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('smart-home-') || key.startsWith('energy-assessment-')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.expiresAt && Date.now() > data.expiresAt) {
          localStorage.removeItem(key);
        }
      } catch {
        // Remove malformed data
        localStorage.removeItem(key);
      }
    }
  });
} catch (error) {
  console.warn('Failed to clean up expired data:', error);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
