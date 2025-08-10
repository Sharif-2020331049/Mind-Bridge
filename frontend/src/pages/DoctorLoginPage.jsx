// src/pages/DoctorLoginPage.jsx

// THE FIX IS HERE: We are now importing useState and useEffect
import React, { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function DoctorLoginPage() {
    const navigate = useNavigate();
    const { handleLogin, currentUser } = useAuth();

    // State for this component's form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // This robust effect redirects ANY logged-in user to their correct dashboard
    // This will now work because useEffect is imported.
    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'doctor') {
                navigate('/doctor/dashboard');
            } else if (currentUser.role === 'patient') {
                // If a patient lands here by mistake, send them to their dashboard
                navigate('/app/dashboard');
            }
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        // Call the unified handleLogin from AuthContext
        const result = await handleLogin(email, password, 'doctor');

        if (!result.success) {
            setError(result.message || 'Invalid email or password. Please try again.');
        }
        
        setIsLoading(false);
        // The useEffect hook will handle the redirect on success.
    };

    return (
        <div className="bg-gradient-to-br from-blue-100 via-teal-100 to-green-100 flex flex-col items-center justify-center min-h-screen p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="bg-transparent border-none cursor-pointer">
                        <span className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">PsyCare</span>
                    </Link>
                </div>
                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-800">Consultant Portal</h1>
                        <p className="mt-2 text-gray-600">Sign in to access your professional dashboard.</p>
                    </div>
                    {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
                                <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                                <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                            </div>
                        </div>
                        <div className="mt-8">
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:bg-slate-400 disabled:from-slate-500 disabled:to-slate-400"
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>
                <p className="mt-8 text-center text-sm text-gray-600">Need to create a consultant profile? <Link to="/doctor-signup" className="font-medium text-blue-600 hover:text-teal-500">Register Here</Link></p>
                <p className="mt-2 text-center text-sm text-gray-600">Not a consultant? <Link to="/patient-login" className="font-medium text-purple-600 hover:text-purple-500">Patient Login</Link></p>
            </div>
        </div>
    );
}

export default DoctorLoginPage;