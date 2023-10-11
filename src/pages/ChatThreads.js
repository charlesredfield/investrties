// ChatThreads.js
import React, { useState, useEffect } from 'react';
import axios from './api/axios';

const ChatThreads = () => {
    // State to store a list of chat threads
    const [chatThreads, setChatThreads] = useState([]);

    useEffect(() => {
        // Fetch the list of chat threads when the component mounts
        const fetchChatThreads = async () => {
            try {
                // Make an API request to get the list of chat threads
                const response = await axios.get('/api/chat/threads');
                const threads = response.data;
                setChatThreads(threads);
            } catch (error) {
                console.error('Error fetching chat threads:', error);
            }
        };

        fetchChatThreads();
    }, []);

    return (
        <div>
            <h2>Chat Threads</h2>
            <ul>
                {chatThreads.map((thread) => (
                    <li key={thread.id}>
                        {/* Render each chat thread with a link to view messages */}
                        <a href={`/messages/${thread.id}`}>{thread.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatThreads;