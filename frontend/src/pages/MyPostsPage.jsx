// src/pages/MyPostsPage.jsx

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from '../components/Shared';
import AppNavbar from '../components/AppNavbar';
import PostCard from '../components/PostCard';
import { MOCK_ANALYTICS_DATA } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import api from '../api/axios';
// const authorName = post.uploadedBy?.name || 'Anonymous';
// const authorPfp = post.uploadedBy?.profilePic || 'default-pfp-url.jpg';

const MyPostsPage = ({ openDeleteModal, openProfileModal }) => {
    const { currentUser } = useAuth();
    // const { posts } = usePosts();
    // const myPosts = posts.filter(p => p.userId === currentUser.userId);
    const [stories, setStories] = useState([]);
     const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchMyStories = async () => {
      try {
        const token = localStorage.getItem("token"); // Adjust if stored elsewhere

        const res = await api.get("/patient/my-stories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStories(res.data);
      } catch (err) {
        console.error("Failed to fetch stories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStories();
  }, []);



    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <AppNavbar openProfileModal={openProfileModal}/>
            <main className="container mx-auto p-6">

                {/* <Card className="p-6 mb-8">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">My Activity Analytics</h3>
                    <div className="space-y-1 mb-4 text-sm">
                        <p className="text-gray-500 dark:text-gray-400">Posts this week: <span className="font-bold text-gray-700 dark:text-gray-200">3</span></p>
                        <p className="text-gray-500 dark:text-gray-400">Responses received: <span className="font-bold text-gray-700 dark:text-gray-200">55</span></p>
                        <p className="text-gray-500 dark:text-gray-400">Helpful votes: <span className="font-bold text-gray-700 dark:text-gray-200">183</span></p>
                    </div>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <LineChart data={MOCK_ANALYTICS_DATA} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.3)" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563', borderRadius: '0.5rem', color: '#e5e7eb' }}/>
                                <Line type="monotone" dataKey="helpful_votes" name="Helpful Votes" stroke="#818cf8" strokeWidth={2} dot={{ r: 4, fill: '#818cf8' }} activeDot={{ r: 6 }}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card> */}


                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Posts ({stories.length})</h1>
                <div className="space-y-6">
                    {stories.length > 0 ? stories.map(post => ( 
                        <PostCard key={post._id} post={post} openDeleteModal={openDeleteModal} /> 
                    )) : ( 
                        <Card className="text-center p-6"><p className="text-gray-500 dark:text-gray-400">You haven't posted anything yet.</p></Card> 
                    )}


                    {/*  */}
                     {/* {loading ? (
                <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
                ) : stories.length === 0 ? (
                
                        <Card className="text-center p-6"><p className="text-gray-500 dark:text-gray-400">You haven't posted anything yet.</p></Card> 
                  
              ) : (
                 <Card className="text-center p-6"><p className="text-gray-500 dark:text-gray-400">You haven't posted anything yet.</p></Card> 
              )} */}
                </div>
            </main>
        </div>
    );
};

export default MyPostsPage;