import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppProvider } from './contexts/AppContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ClipsProvider } from './contexts/ClipsContext.jsx';
import { AppointmentProvider } from './contexts/AppointmentContext.jsx';
import { PostProvider } from './contexts/PostContext.jsx'; // 1. Import
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PostProvider> {/* 2. Add the provider here */}
          <ClipsProvider>
            <AppointmentProvider>
              <AppProvider>
                <App />
              </AppProvider>
            </AppointmentProvider>
          </ClipsProvider>
        </PostProvider>
      </AuthProvider>
    </BrowserRouter>
  // </React.StrictMode>,
);