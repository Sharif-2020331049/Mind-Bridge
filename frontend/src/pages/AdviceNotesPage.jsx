// src/pages/AdviceNotesPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Wand2 } from 'lucide-react';
import { AppButton, Card } from '../components/Shared';
import AppNavbar from '../components/AppNavbar';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';

const AdviceNotesPage = ({ openProfileModal }) => {
    const { currentUser } = useAuth();
    const { posts } = usePosts();

    const [isLoading, setIsLoading] = React.useState(false);
    const [adviceNote, setAdviceNote] = React.useState('');
    const [error, setError] = React.useState('');
    const myPosts = posts.filter(p => p.userId === currentUser.userId);

    const handleGenerateNote = async () => {
        setIsLoading(true);
        setError('');
        setAdviceNote('');
        const problemsText = myPosts.map(p => `Title: ${p.title}\nContent: ${p.content}`).join('\n\n---\n\n');
        const prompt = `As a compassionate AI, summarize key themes from these journal entries. Tone: supportive. Identify challenges, offer 1-2 simple suggestions. No medical advice. Start warm. Posts: --- ${problemsText} ---`;
        try {
            let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setAdviceNote(result.candidates[0].content.parts[0].text);
            } else {
                throw new Error("Invalid AI response.");
            }
        } catch (e) {
            setError("Couldn't generate the note. Try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <AppNavbar openProfileModal={openProfileModal} />
            <main className="container mx-auto p-6">
                <div className="mb-6">
                    <Link to="/app/dashboard">
                        <AppButton variant="secondary"><ArrowLeft size={20} className="mr-2" />Back to Dashboard</AppButton>
                    </Link>
                </div>
                <div className="text-center">
                    <Wand2 size={40} className="mx-auto text-indigo-600 mb-2"/>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your AI-Powered Advice Note</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">Get a personalized summary and gentle advice based on your recent posts.</p>
                </div>
                <div className="text-center my-8">
                    <AppButton onClick={handleGenerateNote} disabled={isLoading || myPosts.length === 0}>
                        {isLoading ? 'Generating...' : <><Sparkles size={20} className="mr-2" />Generate My Advice Note</>}
                    </AppButton>
                </div>
                {error && (<Card className="border-red-500 bg-red-50 dark:bg-red-900/20 border-2 text-center p-6"><p className="text-red-700 dark:text-red-300">{error}</p></Card>)}
                {adviceNote && (<Card className="prose prose-indigo dark:prose-invert max-w-none p-6">{adviceNote.split('\n').map((p, i) => <p key={i}>{p}</p>)}</Card>)}
            </main>
        </div>
    );
};

export default AdviceNotesPage;