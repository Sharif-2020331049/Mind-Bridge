import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppButton, Card } from '../components/Shared';
import AppNavbar from '../components/AppNavbar';
import { useTimeAgo } from '../hooks/useTimeAgo';
import { ArrowLeft, MessageSquare, Stethoscope } from 'lucide-react';
import api from '../api/axios'; // Make sure you have the api instance

const ProblemDetailPage = ({ openProfileModal }) => {
    const { storyId } = useParams(); 
    const { postId } = useParams(); // Use the correct parameter name// Get the ID from the URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

   useEffect(() => {
    const fetchStory = async () => {
        if (!postId) return; // Check for postId
        setLoading(true);
        try {
            // Use postId in the API call
            const response = await api.get(`/patient/story/${postId}`);
            if (response.data.success) {
                setPost(response.data.story);
            } else {
                setError('Failed to load the post.');
            }
        } catch (err) {
            console.error("Fetch story error:", err);
            setError('Post not found or an error occurred.');
        } finally {
            setLoading(false);
        }
    };

    fetchStory();
}, [postId]); // The dependency array now uses postId

    const timeAgo = useTimeAgo(post?.createdAt);

    if (loading) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                <AppNavbar openProfileModal={openProfileModal} />
                <main className="container mx-auto p-6 text-center">
                    <p className="dark:text-white">Loading post...</p>
                </main>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                <AppNavbar openProfileModal={openProfileModal} />
                <main className="container mx-auto p-6 text-center">
                    <h1 className="text-2xl font-bold dark:text-white">{error || 'Post not found'}</h1>
                    <Link to="/app/dashboard"><AppButton className="mt-4">Back to Dashboard</AppButton></Link>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <AppNavbar openProfileModal={openProfileModal} />
            <main className="container mx-auto p-6">
                <Link to="/app/dashboard">
                    <AppButton variant="secondary" className="mb-6"><ArrowLeft size={20} className="mr-2" />Back to All Posts</AppButton>
                </Link>

                {/* --- ORIGINAL POST --- */}
                <Card className="p-6">
                    <div className="flex items-center mb-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>{post.category}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{timeAgo}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{post.title}</h1>
                    <p className="text-gray-700 dark:text-gray-300 mt-4 text-base leading-relaxed whitespace-pre-wrap">{post.story}</p>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mt-6 text-sm space-x-2 border-t dark:border-gray-700 pt-4">
                        <MessageSquare size={16} className="text-gray-400 dark:text-gray-500" />
                        <span>{post.comments?.length || 0} Responses</span>
                    </div>
                </Card>

                {/* --- DOCTOR RESPONSES SECTION --- */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Professional Advice ({post.comments?.length || 0})</h2>
                    <div className="space-y-6">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <Card key={comment._id} className="p-6 bg-green-50 dark:bg-gray-800 border-l-4 border-green-500">
                                    <div className="flex items-center mb-3">
                                        <img 
                                            src={comment.doctor?.profilePic || 'default-avatar.png'} 
                                            alt={comment.doctor?.fullName}
                                            className="w-12 h-12 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{comment.doctor?.fullName || 'A Doctor'}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Verified Consultant</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 pl-16 whitespace-pre-wrap">{comment.text}</p>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-6 text-center">
                                <p className="text-gray-500 dark:text-gray-400">No advice has been received for this post yet.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProblemDetailPage;