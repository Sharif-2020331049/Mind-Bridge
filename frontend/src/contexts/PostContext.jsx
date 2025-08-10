import React, { createContext, useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { MOCK_POSTS_INITIAL } from '../data/mockData';
import { useAuth } from './AuthContext';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const { currentUser } = useAuth();
    
    const [posts, setPosts] = useState(() => {
        const savedPosts = localStorage.getItem('psycare_posts');
        return savedPosts ? JSON.parse(savedPosts) : MOCK_POSTS_INITIAL;
    });

    useEffect(() => {
        localStorage.setItem('psycare_posts', JSON.stringify(posts));
    }, [posts]);

    const addPost = (newPostData) => {
        if (!currentUser) return;
        const newPost = {
            id: Date.now(),
            userId: currentUser.userId,
            tag: newPostData.category,
            createdAt: Date.now(),
            title: newPostData.title,
            content: newPostData.description,
            responses: 0,
            likes: 0,
            advice: [], // Start with an empty advice array
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    const deletePost = (postId) => {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    };

    // --- NEW FUNCTION TO ADD DOCTOR'S ADVICE ---
    const addAdvice = useCallback((postId, adviceText, doctorName) => {
        setPosts(prevPosts => 
            prevPosts.map(post => {
                if (post.id === postId) {
                    const newAdvice = { doctor: doctorName, advice: adviceText };
                    return {
                        ...post,
                        responses: (post.responses || 0) + 1,
                        advice: post.advice ? [...post.advice, newAdvice] : [newAdvice],
                    };
                }
                return post;
            })
        );
    }, []);

    const value = useMemo(() => ({
        posts,
        addPost,
        deletePost,
        addAdvice, // Expose the new function
    }), [posts, addAdvice]);

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = () => {
    const context = useContext(PostContext);
    if (context === undefined) {
        throw new Error('usePosts must be used within a PostProvider');
    }
    return context;
};