import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));  // ✅ Correct way
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
