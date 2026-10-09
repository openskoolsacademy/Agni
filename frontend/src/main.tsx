import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.js';
import { AuthProvider } from './context/AuthContext.js';
import { BotProvider } from './context/BotContext.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BotProvider>
        <App />
      </BotProvider>
    </AuthProvider>
  </React.StrictMode>
);
