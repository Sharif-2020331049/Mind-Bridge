// src/pages/PatientLoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the correct, unified hook

function PatientLoginPage() {
    const navigate = useNavigate();
    // Get the correct login handler and user state from our central context
    const { handleLogin, currentUser } = useAuth(); 
    
    // State for this component's form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // This effect handles redirection after a successful login
// frontend/src/pages/PatientLoginPage.jsx

    // This robust effect redirects ANY logged-in user to their correct dashboard
    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'patient') {
                navigate('/app/dashboard');
            } else if (currentUser.role === 'doctor') {
                // If a doctor lands here by mistake, send them to their dashboard
                navigate('/doctor/dashboard');
            }
        }
    }, [currentUser, navigate]);

    // The new, corrected handleSubmit function
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        // Call the unified handleLogin from AuthContext, specifying the user type
        const result = await handleLogin(email, password, 'patient');

        // If the login function returns an error, display it
        if (!result.success) {
            setError(result.message || 'Invalid email or password. Please try again.');
        }
        
        setIsLoading(false);
        // We don't navigate here; the useEffect hook handles it automatically.
    };

    return (
        <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center min-h-screen p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="bg-transparent border-none cursor-pointer">
                        <span className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">PsyCare</span>
                    </Link>
                </div>
                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-800">Patient Login</h1>
                        <p className="mt-2 text-gray-600">Welcome back! Please sign in to continue.</p>
                    </div>
                    {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
                                <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                                <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="••••••••" />
                            </div>
                        </div>
                        <div className="mt-8">
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:bg-slate-400 disabled:from-slate-500 disabled:to-slate-400"
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>
                <p className="mt-8 text-center text-sm text-gray-600">Don't have an account? <Link to="/patient-signup" className="font-medium text-purple-600 hover:text-indigo-500">Sign up as a Patient</Link></p>
                <p className="mt-2 text-center text-sm text-gray-600">Are you a consultant? <Link to="/doctor-login" className="font-medium text-blue-600 hover:text-blue-500">Login Here</Link></p>
            </div>
        </div>
    );
}

export default PatientLoginPage;