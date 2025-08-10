// src/pages/ClipsPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import { useClips } from '../contexts/ClipsContext';

const ClipsPage = ({ openProfileModal }) => {
    const { clips } = useClips();

    return (
        // The AppNavbar is kept, but the main content is full-screen
        <div className="flex flex-col h-screen bg-black">
            <div className="flex-shrink-0">
                <AppNavbar openProfileModal={openProfileModal} />
            </div>
            
            <div className="flex-grow relative overflow-y-scroll snap-y snap-mandatory">
                {clips.map(clip => (
                    <div key={clip.id} className="h-full w-full flex-shrink-0 snap-start flex items-center justify-center relative">
                        <video 
                            className="h-full w-full object-contain" 
                            src={clip.videoUrl} 
                            autoPlay 
                            loop 
                            muted // Muted is best for autoplay UX
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                            <div className="flex items-center space-x-3 mb-2">
                                <img src={clip.doctorAvatar} alt={clip.doctorName} className="w-10 h-10 rounded-full border-2 border-white"/>
                                <div>
                                    <p className="font-bold text-sm">{clip.doctorName}</p>
                                    <Link to={`/app/doctors`}> {/* Simplified link to doctors page */}
                                      <span className="text-xs bg-white/20 px-2 py-1 rounded-md hover:bg-white/40">View Profile</span>
                                    </Link>
                                </div>
                            </div>
                            <p className="text-sm">{clip.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClipsPage;