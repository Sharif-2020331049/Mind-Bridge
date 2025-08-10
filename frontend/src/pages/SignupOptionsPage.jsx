// src/pages/SignupOptionsPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase } from 'lucide-react';

const SignupOptionsPage = () => {
    return (
        <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center min-h-screen p-4 font-sans">
            <div className="w-full max-w-md text-center">
                <div className="text-center mb-8">
                    <Link to="/" className="bg-transparent border-none cursor-pointer">
                        <span className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">PsyCare</span>
                    </Link>
                </div>
                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">How would you like to join?</h1>
                    <p className="text-gray-600 mb-8">Choose the account type that best describes you.</p>
                    <div className="space-y-6">
                        <Link to="/patient-signup" className="w-full block">
                            <div className="w-full flex items-center text-left p-6 border-2 border-transparent rounded-xl bg-white hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                                <User className="w-10 h-10 text-purple-600 mr-5"/>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">I'm a Patient</h2>
                                    <p className="text-gray-600">Sign up to find support and connect with consultants.</p>
                                </div>
                            </div>
                        </Link>
                        <Link to="/doctor-signup" className="w-full block">
                            <div className="w-full flex items-center text-left p-6 border-2 border-transparent rounded-xl bg-white hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                                <Briefcase className="w-10 h-10 text-indigo-600 mr-5"/>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">I'm a Doctor / Consultant</h2>
                                    <p className="text-gray-600">Register to offer your professional services on our platform.</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <p className="mt-8 text-center text-sm text-gray-600"> Already have an account? <Link to="/login" className="font-medium text-purple-600 hover:text-indigo-500 hover:underline ml-1 bg-transparent border-none cursor-pointer"> Sign In </Link> </p>
            </div>
        </div>
    );
};

export default SignupOptionsPage;