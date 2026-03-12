import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Wajib ada [cite: 521]
import App from './App';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Membungkus App agar Router aktif [cite: 527] */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);