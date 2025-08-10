// frontend/src/App.jsx

import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Pages and Components ---
import HomePage from './pages/HomePage.jsx';
import SignupOptionsPage from './pages/SignupOptionsPage.jsx';
import PatientSignupPage from './pages/PatientSignupPage.jsx';
import DoctorSignupForm from './pages/DoctorSignupForm.jsx';
import PatientLoginPage from './pages/PatientLoginPage.jsx';
import DoctorLoginPage from './pages/DoctorLoginPage.jsx';
import PatientApp from './pages/PatientApp.jsx';
import DoctorApp from './pages/DoctorApp.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// --- Layouts ---

// Layout for public pages with Navbar and Footer
const PublicLayout = () => (
  <>
    <Navbar />
    <main className="flex-grow"> {/* Added for flexbox layout */}
      <Outlet />
    </main>
    <Footer />
  </>
);

// Layout for login/signup pages (no persistent UI elements)
const AuthLayout = () => (
    <Outlet />
);

// --- Main App Component ---

export default function App() {
  return (
    // Recommended: Wrap your app in a flex container to push the footer down
    <div className="flex flex-col min-h-screen"> 
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <Routes>
        {/* ✅ Public Pages with Navbar and Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup-options" element={<SignupOptionsPage />} />
        </Route>

        {/* ❌ Auth Pages — no persistent UI */}
        <Route element={<AuthLayout />}>
          <Route path="/patient-login" element={<PatientLoginPage />} />
          <Route path="/doctor-login" element={<DoctorLoginPage />} />
          <Route path="/patient-signup" element={<PatientSignupPage />} />
          <Route path="/doctor-signup" element={<DoctorSignupForm />} />
        </Route>

        {/* 🔐 Protected Pages - The <ProtectedRoute> now handles all logic */}
        {/* The PatientApp and DoctorApp components will have their own internal layout, including sidebars and footers if needed */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app/*" element={<PatientApp />} />
          <Route path="/doctor/*" element={<DoctorApp />} />
        </Route>

      </Routes>
    </div>
  );
}