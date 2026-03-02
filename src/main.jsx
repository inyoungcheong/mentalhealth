import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

// Fix mobile viewport height: 100vh includes browser chrome on iOS/Android.
// Set --app-height to the real visible height and update on resize.
function setAppHeight() {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}
setAppHeight();
window.addEventListener('resize', setAppHeight);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
