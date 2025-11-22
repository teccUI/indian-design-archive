import React, { useState, useEffect } from 'react';
import { useCursor } from '../context/CursorContext';

const LinkPreview: React.FC = () => {
  const { position, hoveredUrl } = useCursor();
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when URL changes
  useEffect(() => {
    if (hoveredUrl) {
      setIsLoading(true);
    }
  }, [hoveredUrl]);

  // Don't render if no URL is hovered
  if (!hoveredUrl) return null;

  // Optimization: Reduced width to 600px for faster generation. 
  // mShots is used because it is free and unlimited, though initial cold boot is slow.
  // The delay in DirectoryEntry.tsx handles the user experience friction.
  const previewUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(hoveredUrl)}?w=600&q=90`;

  return (
    <div 
      className="fixed z-50 pointer-events-none hidden md:block transition-opacity duration-200"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(20px, 20px)' // Offset to not block cursor
      }}
    >
      <div className="bg-[#111] border border-[#333] w-[320px] h-[200px] overflow-hidden relative shadow-2xl flex flex-col">
        
        {/* Loading Skeleton / Placeholder */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-10 border-b border-[#222]">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-white animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-white animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-[#444] text-[10px] font-mono uppercase tracking-widest mt-2">
              Fetching Preview
            </span>
          </div>
        )}

        {/* Screenshot Image */}
        <div className="flex-1 relative bg-black">
           <img 
            src={previewUrl} 
            alt="Site Preview"
            className={`w-full h-full object-cover object-top transition-all duration-500 ${isLoading ? 'opacity-0 blur-sm scale-105' : 'opacity-100 blur-0 scale-100'}`}
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* URL Label Footer */}
        <div className="bg-black/90 backdrop-blur border-t border-[#222] px-3 py-2 shrink-0">
          <p className="text-[10px] text-[#888] font-mono truncate flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
            {hoveredUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkPreview;