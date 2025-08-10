import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Video, Wand2 } from 'lucide-react';
import { Card, AppButton } from '../components/Shared';
import AppNavbar from '../components/AppNavbar';
import PostCard from '../components/PostCard';
import { useClips } from '../contexts/ClipsContext';
import ClipsPreviewCard from '../components/ClipsPreviewCard';
import axios from 'axios';
import api from '../api/axios';

const DashboardPage = ({ openDeleteModal, openProfileModal }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const { clips } = useClips();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
 
  console.log(import.meta.env.VITE_GEMINI_API_KEY)
  const stats = {
    posts: posts.length,
    responses: posts.reduce((acc, p) => acc + (p.responses || 0), 0),
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
         const token = localStorage.getItem("token"); 
           const response = await api.get("/patient/all-stories", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
        setPosts(response.data.stories);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <AppNavbar openProfileModal={openProfileModal} />
      <main className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img
              src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?semt=ais_hybrid&w=740"
              alt={currentUser?.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Welcome back, {currentUser?.name}!
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {stats.posts} Posts · {stats.responses} Responses
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Link to="/app/share-story">
              <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-dashed border-indigo-200 dark:border-indigo-800 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition p-6">
                <div className="flex flex-col items-center">
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-indigo-100">Share Your Story</h3>
                    <p className="text-gray-600 dark:text-indigo-300 mt-1">
                      Your voice matters. Post anonymously and find support.
                    </p>
                  </div>
                  <AppButton className="mt-4">
                    <PlusCircle size={20} className="mr-2" />Post a Problem
                  </AppButton>
                </div>
              </Card>
            </Link>



         <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">All Posts </h1>
            <div className="space-y-6 max-h-[calc(100vh-27rem)] overflow-y-auto pr-4 custom-scrollbar">
              {loading ? (
                <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
              ) : posts.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No posts found.</p>
              ) : (
                posts.map((post) => (
                  <PostCard key={post._id} post={post} openDeleteModal={openDeleteModal} />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white cursor-pointer">
                  <Video size={20} />
                  <span>View Consultations</span>
                </li>
                <Link
                  to="/app/advice-notes"
                  className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white cursor-pointer"
                >
                  <Wand2 size={20} />
                  <span>AI Advice Notes</span>
                </Link>
              </ul>
            </Card>

            {clips.length > 0 && <ClipsPreviewCard clips={clips} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
