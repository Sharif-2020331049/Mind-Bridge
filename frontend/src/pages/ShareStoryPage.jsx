// src/pages/ShareStoryPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppButton, Card } from '../components/Shared';
import AppNavbar from '../components/AppNavbar';
import { Sparkles, ChevronDown } from 'lucide-react';
import { usePosts } from '../contexts/PostContext';
import { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const ShareStoryPage = ({ openProfileModal }) => {
    const navigate = useNavigate();
    // const { addPost } = usePosts();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Anxiety');
    const [description, setDescription] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const getAISuggestions = React.useCallback(async () => {
        if (!description) { setError("Please describe your problem to get AI suggestions."); return; }
        setIsLoading(true);
        setError(null);
        setSuggestions([]);
        const prompt = `Based on the following mental health concern, provide 2-3 brief, supportive, and actionable suggestions. The user is experiencing issues related to "${category}" and has described it as: "${description}". For each suggestion, provide a short title and a one-sentence explanation. Structure the response as a JSON array of objects, where each object has "title" and "explanation" keys.`;
        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory, generationConfig: { responseMimeType: "application/json", responseSchema: { type: "ARRAY", items: { type: "OBJECT", properties: { "title": { "type": "STRING" }, "explanation": { "type": "STRING" } }, required: ["title", "explanation"] } } } };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]) {
                const jsonText = result.candidates[0].content.parts[0].text;
                setSuggestions(JSON.parse(jsonText));
            } else {
                throw new Error("No valid suggestions received from the AI.");
            }
        } catch (err) {
            setError("Sorry, we couldn't fetch AI suggestions at the moment.");
        } finally {
            setIsLoading(false);
        }
    }, [description, category]);

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in to share a story.");
                return;
            }

            const response = await api.post('/patient/upload-story',
                {
                    title,
                    category,
                    story: description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success("Your story has been uploaded successfully!");
                setTitle('');
                setCategory('Anxiety');
                setDescription('');
                setSuggestions([]);
            } else {
                throw new Error(response.data.message || "Failed to upload story");
            }

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <AppNavbar openProfileModal={openProfileModal} />
            <main className="container mx-auto p-4 sm:p-6 lg:p-12">

                <Card className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Share Your Story</h1>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Post Anonymously</span>
                    </div>
                    {successMessage && (<div className="p-4 mb-6 rounded-lg text-center bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">{successMessage}</div>)}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
                            <div> <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Title</label> <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your post a clear title" className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-gray-900 dark:text-white" required /> </div>
                            <div> <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label> <div className="relative"> <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full appearance-none px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-gray-900 dark:text-white" required > <option>Anxiety</option> <option>Depression</option> <option>Stress</option> <option>Relationships</option> <option>Others</option> </select> <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /> </div> </div>
                            <div> <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Story</label> <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Share your thoughts, feelings, or experiences..." rows="10" className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-gray-900 dark:text-white" required ></textarea> </div>
                            <div className="flex items-center justify-end space-x-4 pt-4"> <AppButton type="button" variant="secondary" onClick={() => navigate('/app/dashboard')}>Cancel</AppButton> <AppButton type="submit" variant="primary" className="w-full sm:w-auto">Share Story</AppButton> </div>
                        </form>
                        <div className="space-y-6">



                            <div className="bg-gray-100/80 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">AI Suggestions</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Need ideas? Let our AI suggest helpful perspectives.</p>
                                <button onClick={getAISuggestions} disabled={isLoading || !description} className="w-full text-sm bg-blue-50 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 border border-blue-200 focus:outline-none transition disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-900 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"> {isLoading ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path> </svg> : <><Sparkles className="w-4 h-4 mr-2" /><span>Get Suggestions</span></>} </button>
                                <div className="mt-4 space-y-3 flex-grow overflow-y-auto max-h-64 pr-2">
                                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                                    {suggestions.map((s, i) => <div key={i} className="p-3 bg-white/50 dark:bg-gray-700/30 rounded-md"><p className="font-semibold text-sm text-gray-700 dark:text-gray-200">{s.title}</p><p className="text-xs text-gray-600 dark:text-gray-400">{s.explanation}</p></div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default ShareStoryPage;