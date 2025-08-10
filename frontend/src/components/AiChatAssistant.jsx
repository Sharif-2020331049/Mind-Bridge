// src/components/AiChatAssistant.jsx

import React from 'react';
import { Card } from './Shared';
import { Sparkles, X, SendHorizontal } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const AiChatAssistant = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [messages, setMessages] = React.useState([
        { role: 'model', text: 'Hello! I\'m your AI Assistant. How can I help you with general questions about our services?' }
    ]);
    const [inputValue, setInputValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const chatContainerRef = React.useRef(null);

    React.useEffect(() => {
        if (isOpen && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isOpen]);
    
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage) return;

        const newMessages = [...messages, { role: 'user', text: userMessage }];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const chatHistory = newMessages.map(msg => ({
                role: msg.role === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));
            
            const systemInstruction = {
                role: "user",
                parts: [{ text: `You are a friendly and supportive AI assistant for a healthcare platform called PsyCare. You are NOT a medical doctor. Your primary role is to help users navigate the platform and answer general questions. If the user asks for any form of medical advice, diagnosis, or treatment suggestions, you must politely and compassionately decline and strongly recommend they consult a qualified healthcare professional or book an appointment through the platform. Do not attempt to interpret symptoms or medical data. User's latest message is: "${userMessage}"`}]
            };

            chatHistory.pop();
            const finalHistory = [...chatHistory, systemInstruction];

            const payload = { contents: finalHistory };
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'Failed to fetch response from AI.');
            }

            const result = await response.json();
            const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (aiText) {
                setMessages(prev => [...prev, { role: 'model', text: aiText }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I couldn't generate a response. Please try again." }]);
            }
        } catch (error) {
            console.error("AI Assistant Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: `Sorry, I'm having trouble connecting. ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-40 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-110" aria-label="Open AI Assistant">
                <Sparkles size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-40 w-full max-w-sm font-sans">
            <Card className="flex flex-col h-full p-0 shadow-2xl bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-white flex items-center"><Sparkles size={18} className="mr-2 text-indigo-500"/>AI Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><X size={20} /></button>
                </div>
                <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto h-80 bg-gray-50 dark:bg-gray-900">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role !== 'user' && <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>}
                            <div className={`rounded-lg px-4 py-2 max-w-xs break-words ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'}`}>{msg.text}</div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>
                            <div className="rounded-lg px-4 py-2 bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"><span className="animate-pulse">...</span></div>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700 flex items-center bg-white dark:bg-gray-800">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask a question..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" disabled={isLoading}/>
                    <button type="submit" className="ml-2 p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all" disabled={isLoading || !inputValue}><SendHorizontal size={20}/></button>
                </form>
            </Card>
        </div>
    );
};
export default AiChatAssistant;