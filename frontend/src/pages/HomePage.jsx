//src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, MarketingButton, ShieldCheck, BrainCircuit, VideoIcon, Star } from '../components/Shared';
import { MOCK_CONSULTANTS_HOME } from '../data/mockData';

const HomePage = () => (
    <div className="bg-gray-50">
        <main>
            {/* Hero Section */}
            <section className="relative bg-indigo-800 text-white py-20 md:py-32">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" alt="Medical professional at a desk" className="w-full h-full object-cover opacity-20" onError={(e) => e.target.src = 'https://placehold.co/1920x1080/1e1b4b/ffffff?text=PsyCare'} />
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Your Mental Health Matters to Us</h1>
                    <p className="mt-4 text-lg md:text-xl text-indigo-200 max-w-3xl mx-auto">Get anonymous support, AI-powered insights, and professional guidance in a safe and confidential space.</p>
                    <div className="mt-8">
                        {/* CHANGED: This link now points to the patient login page by default */}
                        <Link to="/patient-login">
                            <MarketingButton className="bg-gray-600 text-white font-bold hover:bg-gray-700 px-8 py-3 text-lg">Get Started Today</MarketingButton>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">A better way to get mental health support</h2>
                        <p className="mt-2 text-gray-600">Features designed for your comfort and privacy.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6"> <div className="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-indigo-100 mx-auto"> <ShieldCheck className="text-indigo-600 w-8 h-8" /> </div> <h3 className="text-xl font-semibold mb-2">Anonymous Support</h3> <p className="text-gray-600">Share your concerns without revealing your identity.</p> </div>
                        <div className="text-center p-6"> <div className="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-indigo-100 mx-auto"> <BrainCircuit className="text-indigo-600 w-8 h-8" /> </div> <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3> <p className="text-gray-600">Receive AI-generated suggestions and insights.</p> </div>
                        <div className="text-center p-6"> <div className="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-indigo-100 mx-auto"> <VideoIcon className="text-indigo-600 w-8 h-8" /> </div> <h3 className="text-xl font-semibold mb-2">Video Consultations</h3> <p className="text-gray-600">Connect with therapists through secure video sessions.</p> </div>
                    </div>
                </div>
            </section>

            {/* Consultants Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">Meet Our Expert Consultants</h2>
                        <p className="mt-2 text-gray-600">Connect with licensed and verified mental health professionals.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {MOCK_CONSULTANTS_HOME.map(consultant => (
                            <Card key={consultant.id} className="text-center flex flex-col items-center !p-8">
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4"> <span className="text-3xl font-bold text-gray-600">{consultant.initials}</span> </div>
                                <h3 className="text-xl font-semibold">{consultant.name}</h3>
                                <p className="text-gray-500 text-sm mt-1 h-10">{consultant.specialty}</p>
                                <div className="flex justify-center items-center mt-3 text-yellow-500"> <Star /> <span className="ml-2 text-gray-600 font-semibold">{consultant.rating} ({consultant.reviews} reviews)</span> </div>
                                {/* CHANGED: This link also points to the patient login page */}
                                <Link to="/patient-login" className="w-full">
                                    <MarketingButton className="mt-6 w-full !bg-gray-800 hover:!bg-gray-900 !text-white"> Book Consultation </MarketingButton>
                                </Link>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    </div>
);

export default HomePage;