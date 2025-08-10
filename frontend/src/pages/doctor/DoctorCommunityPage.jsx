// frontend/src/pages/doctor/DoctorCommunityPage.jsx

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import DoctorModal from '../../components/doctor/DoctorModal';
import { useAuth } from '../../contexts/AuthContext';
import { useTimeAgo } from '../../hooks/useTimeAgo';
import api from '../../api/axios';

const DoctorCommunityPage = () => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [adviceText, setAdviceText] = useState('');
    const [filterTopic, setFilterTopic] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
        const fetchStories = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/doctor/stories');
                if (response.data.success) { setPosts(response.data.stories); }
            } catch (err) {
                console.error("Failed to fetch stories:", err);
                setError("Could not load the community feed.");
            } finally { setIsLoading(false); }
        };
        fetchStories();
    }, []);

   // frontend/src/pages/doctor/DoctorCommunityPage.jsx

// ... (keep all your imports and state definitions)

    // Replace the old handlePostAdvice with this async version
    const handlePostAdvice = async () => {
        console.log("Post Advice button was clicked. Attempting to post...");
        if (!adviceText.trim() || !selectedQuestion) return;
        try {
            const response = await api.post(`/doctor/stories/${selectedQuestion._id}/comment`, { text: adviceText });
            if (response.data.success) {
                const updatedStory = response.data.story;
                setPosts(posts.map(p => p._id === updatedStory._id ? updatedStory : p));
                setSelectedQuestion(updatedStory);
                setAdviceText('');
            }
        } catch (err) { console.error("Failed to post advice:", err); alert("Error posting advice."); }
    };   
     const handleUpdateAdvice = async () => {
        if (!editText.trim() || !editingComment) return;
        try {
            const response = await api.put(`/doctor/stories/${selectedQuestion._id}/comment/${editingComment._id}`, { text: editText });
            if (response.data.success) {
                const updatedStory = response.data.story;
                setPosts(posts.map(p => p._id === updatedStory._id ? updatedStory : p));
                setSelectedQuestion(updatedStory);
                setEditingComment(null);
                setEditText('');
            }
        } catch (err) { console.error("Failed to update comment:", err); alert("Error updating advice."); }
    };

// ... (The rest of your component's code remains the same)
    // --- FIX #1: The Filtering Logic ---
    // Change 'q.content' to 'q.story' and add a fallback to prevent crashes.
    const filteredQuestions = posts
        .filter(q => filterTopic === 'All' || q.category === filterTopic) // Use 'category' from your model
        .filter(q => 
            (q.story || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

    const QuestionCard = ({ question }) => {
        const timeAgo = useTimeAgo(question.createdAt);
        const isAnswered = question.comments?.length > 0;

        return (
            <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all ${!isAnswered ? 'border-l-4 border-yellow-500' : 'border-l-4 border-green-500'}`}>
                <div className="flex justify-between items-start">
                    <div>
                        {/* Use 'category' from your model */}
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>{question.category}</span>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Posted {timeAgo}</p>
                    </div>
                    {isAnswered ? <span className="text-sm text-green-600 dark:text-green-400 font-bold">✓ Answered</span> : <span className="text-sm text-yellow-600 dark:text-yellow-400 font-bold">Needs Response</span>}
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200 mt-2">{question.title}</p>
                {/* --- FIX #2: The Display Logic --- */}
                {/* Change 'question.content' to 'question.story' */}
                <p className="text-gray-700 dark:text-gray-300 my-4 line-clamp-2">{question.story}</p>
                <button onClick={() => { setSelectedQuestion(question); setAdviceText(''); }} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">View Details & Respond</button>
            </div>
        );
    }

    // ... (rest of the component, including renderContent and the main return, remains the same)
    // The modal will also need a similar fix if it displays the 'content'.

    return (
        <div>
            {/* ... Header and Search/Filter UI ... */}

            {/* renderContent function to display loading/error/posts */}
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="space-y-4">
                    {filteredQuestions.map(q => (
                        <QuestionCard key={q._id} question={q} />
                    ))}
                </div>
            )}


           <DoctorModal isOpen={!!selectedQuestion} onClose={() => setSelectedQuestion(null)}>
    {selectedQuestion && (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">Respond to Question</h2>

            {/* Original Question Display */}
            <div className="mb-6 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-gray-200 mb-2">{selectedQuestion.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedQuestion.story}</p>
            </div>

            {/* =============================================================== */}
            {/* === START: NEW CODE TO DISPLAY COMMENTS ======================= */}
            {/* =============================================================== */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-300">Previous Responses</h4>
                {selectedQuestion.comments && selectedQuestion.comments.length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {selectedQuestion.comments.map((comment) => (
                            <div key={comment._id} className="flex items-start space-x-3 bg-white dark:bg-gray-900/50 p-3 rounded-lg">
                                <img 
                                    src={comment.doctor?.profilePic || 'default_avatar_url'} 
                                    alt={comment.doctor?.fullName} 
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{comment.doctor?.fullName || 'A doctor'}</p>
                                    <p className="text-gray-700 dark:text-gray-400">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No responses have been posted yet.</p>
                )}
            </div>
            {/* =============================================================== */}
            {/* === END: NEW CODE TO DISPLAY COMMENTS ========================= */}
            {/* =============================================================== */}


            {/* Advice Submission Form (This part remains the same) */}
            <form onSubmit={(e) => { e.preventDefault(); handlePostAdvice(); }}>
                <label htmlFor="adviceText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Professional Advice
                </label>
                <textarea
                    id="adviceText"
                    rows="5"
                    className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide your detailed response here..."
                    value={adviceText}
                    onChange={(e) => setAdviceText(e.target.value)}
                ></textarea>
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setSelectedQuestion(null)}
                        className="mr-3 py-2 px-4 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!adviceText.trim()}
                        className="py-2 px-6 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800"
                    >
                        Post Advice
                    </button>
                </div>
            </form>
        </div>
    )}
</DoctorModal>
        </div>
    );
};

export default DoctorCommunityPage;