// src/contexts/ClipsContext.jsx

import React, { createContext, useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { MOCK_CLIPS_INITIAL } from '../data/mockData';
import { useAuth } from './AuthContext';

const ClipsContext = createContext();

// A few placeholder videos for new uploads in our mock environment
const placeholderVideos = [
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
];

export const ClipsProvider = ({ children }) => {
    const { currentUser } = useAuth();

    // 1. Initialize state from localStorage, falling back to mock data
    const [clips, setClips] = useState(() => {
        try {
            const savedClips = localStorage.getItem('phycare_clips');
            return savedClips ? JSON.parse(savedClips) : MOCK_CLIPS_INITIAL;
        } catch (error) {
            console.error("Could not parse clips from localStorage", error);
            return MOCK_CLIPS_INITIAL;
        }
    });

    // 2. Add a useEffect to save clips to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('phycare_clips', JSON.stringify(clips));
    }, [clips]);

    const addClip = useCallback((newClipData) => {
        if (!currentUser || currentUser.role !== 'doctor') return;

        const newClip = {
            id: Date.now(),
            doctorId: currentUser.userId,
            doctorName: currentUser.name,
            doctorAvatar: currentUser.avatar,
            // 3. Use a random placeholder video for persistence
            videoUrl: placeholderVideos[Math.floor(Math.random() * placeholderVideos.length)],
            description: newClipData.description,
            views: 0,
        };
        setClips(prevClips => [newClip, ...prevClips]);
    }, [currentUser]);

    const value = useMemo(() => ({
        clips,
        addClip,
    }), [clips, addClip]);

    return (
        <ClipsContext.Provider value={value}>
            {children}
        </ClipsContext.Provider>
    );
};

export const useClips = () => {
    const context = useContext(ClipsContext);
    if (context === undefined) {
        throw new Error('useClips must be used within a ClipsProvider');
    }
    return context;
};