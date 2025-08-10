// src/components/ClipsPreviewCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './Shared';
import { Eye } from 'lucide-react';

const ClipsPreviewCard = ({ clips }) => {
    // Show only the first 3 clips for the preview
    const clipsToShow = clips.slice(0, 3);

    return (
        <Card className="p-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">PhyCare Clips</h3>
            <div className="flex space-x-3 overflow-x-auto">
                {clipsToShow.map(clip => (
                    <Link to="/app/clips" key={clip.id} className="flex-shrink-0 w-32 h-48 rounded-lg overflow-hidden relative group bg-gray-800">
                        <video src={clip.videoUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" muted/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 right-2 text-white">
                           <p className="text-xs font-bold line-clamp-2">{clip.description}</p>
                           <div className="flex items-center text-xs mt-1 opacity-80">
                               <Eye size={12} className="mr-1"/>
                               <span>{clip.views}</span>
                           </div>
                        </div>
                    </Link>
                ))}
            </div>
        </Card>
    );
};

export default ClipsPreviewCard;