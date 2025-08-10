// src/pages/PatientSignupPage.jsx

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { toast } from 'react-toastify';

const PatientSignupPage = () => {
    const navigate = useNavigate();
    const [message, setMessage] = React.useState('');
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const fullName = event.target.fullName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

            try {
            const res = await api.post('/patient/register', {
                name: fullName,
                email,
                password,
            });

            console.log(res.data);

            if (res.data.success) {
                // setToken(res.data.token);
                localStorage.setItem("token", res.data.token);
                toast.success("Patient registered Successfully!");
                // navigate('/app/dashboard');

                navigate('/patient-login')
            } else {
                toast.error(res.data.message);
            }

        } catch (err) {
            console.error(err);
            // toast.error(err.res?.data?.message || "Patient Signup failed");
        }
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
                        <h1 className="text-3xl font-bold text-gray-800">Create Your Patient Account</h1>
                        <p className="mt-2 text-gray-600">Join our community with a few simple steps</p>
                    </div>
                    {message && <p className="text-green-600 text-center text-sm mb-4">{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div> <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label> <input id="fullName" name="fullName" type="text" autoComplete="name" required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="John Doe" /> </div>
                            <div> <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label> <input id="email" name="email" type="email" autoComplete="email" required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="you@example.com" /> </div>
                            <div> <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label> <input id="password" name="password" type="password" autoComplete="new-password" required className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" placeholder="••••••••" /> </div>
                        </div>
                        <div className="mt-8"> <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-indigo-500/40"> Create Account </button> </div>
                    </form>
                </div>
                <p className="mt-8 text-center text-sm text-gray-600"> Already have an account? <Link to="/login" className="font-medium text-purple-600 hover:text-indigo-500 hover:underline ml-1 bg-transparent border-none cursor-pointer"> Sign In </Link> </p>
            </div>
        </div>
    );
}

export default PatientSignupPage;