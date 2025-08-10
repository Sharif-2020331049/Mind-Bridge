// src/components/Footer.jsx


import React from 'react';
import { PsyCareLogo } from './Shared';

const Footer = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8">
                <div className="md:col-span-1 mb-6 md:mb-0">
                    <div className="flex items-center mb-4">
                        <PsyCareLogo className="w-10 h-10"/>
                        <span className="ml-3 text-2xl font-bold">PsyCare</span>
                    </div>
                    <p className="text-gray-400 text-sm">Professional guidance and expertise for those who seek to solve complex problems.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Services</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">Text Consultation</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Video Consultation</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">AI Insights</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Company</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} PsyCare Platform. All rights reserved.
            </div>
        </div>
    </footer>
);

export default Footer;