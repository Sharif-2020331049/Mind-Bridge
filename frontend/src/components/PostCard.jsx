// src/components/PostCard.jsx


import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './Shared';
import { useTimeAgo } from '../hooks/useTimeAgo';
import { MessageSquare, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PostCard = ({ post, openDeleteModal }) => {
    // console.log(post.createdAt)
      if (!post) {
        return null; 
    }
       const { currentUser } = useAuth();
    const timeAgo = useTimeAgo(post.createdAt);
        const isOwnPost = post?.uploadedBy?._id && currentUser?._id && post.uploadedBy._id === currentUser._id;

   // const  currentUser  = localStorage.getItem('currentUser');
   // const isOwnPost = post.userId === currentUser._id;
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <Card className="relative">
            <Link to={`/app/problem/${post._id}`} className="block p-6 cursor-pointer hover:shadow-lg transition">
                <div className="flex items-center mb-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ post.category === 'Anxiety' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : post.category === 'Depression' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : post.category === 'Relationships' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>{post.category}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{timeAgo}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mt-2">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{post.story}</p>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mt-4 text-sm space-x-2">
                    <MessageSquare size={16} className="text-gray-400 dark:text-gray-500"/>
                    {/* <span>{post?.responses} Comments</span> */}
                    <span> Comments</span>
                </div>
            </Link>
            {isOwnPost && ( 
                <div className="absolute top-4 right-4">
                    <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                        <MoreHorizontal size={20} />
                    </button>
                    {isMenuOpen && ( 
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                            <a onClick={(e) => { e.stopPropagation(); openDeleteModal(post.id); setIsMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <Trash2 size={16} className="mr-2"/>Delete
                            </a>
                        </div> 
                    )}
                </div> 
            )}
        </Card>
    );
};

export default PostCard;