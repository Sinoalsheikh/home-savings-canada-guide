
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Add error boundary logging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('Main.tsx: Starting React app initialization');

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('Main.tsx: Root element found, creating React root');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('Main.tsx: Rendering App component');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  
  console.log('Main.tsx: App rendered successfully');
} catch (error) {
  console.error('Main.tsx: Error during app initialization:', error);
}
