import React from 'react';
import { Link } from 'react-router-dom';
import { MarketingButton, PsyCareLogo } from './Shared';

const Navbar = () => (
    <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="relative container mx-auto px-6 py-4 flex items-center justify-between">

            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                    <PsyCareLogo className="w-8 h-8" />
                    <span>PsyCare</span>
                </Link>
            </div>

            {/* Center: Nav Links */}
            <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-6">
                <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
                <a href="#" className="text-gray-600 hover:text-indigo-600">About</a>
                <a href="#" className="text-gray-600 hover:text-indigo-600">Contact</a>
            </nav>

            {/* Right: Login Button */}
            <div className="hidden md:flex">
                <Link to="/patient-login">
                    <MarketingButton>Log in</MarketingButton>
                </Link>
            </div>
        </div>
    </header>
);

export default Navbar;
