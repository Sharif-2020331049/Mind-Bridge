import React from 'react';

export const useTimeAgo = (timestamp) => {
    const [timeAgo, setTimeAgo] = React.useState('');

    React.useEffect(() => {
        const update = () => {
            const now = new Date().getTime();
            const postTime = new Date(timestamp).getTime(); // ✅ convert to number
            const seconds = Math.floor((now - postTime) / 1000);

            if (isNaN(seconds)) {
                setTimeAgo('Invalid date');
                return;
            }

            if (seconds < 5) { setTimeAgo('Just now'); return; }
            if (seconds < 60) { setTimeAgo(`${seconds}s ago`); return; }

            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) { setTimeAgo(`${minutes}m ago`); return; }

            const hours = Math.floor(minutes / 60);
            if (hours < 24) { setTimeAgo(`${hours}h ago`); return; }

            const days = Math.floor(hours / 24);
            setTimeAgo(`${days}d ago`);
        };

        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, [timestamp]);

    return timeAgo;
};
