import React, { useRef } from 'react';
import { DesignStudio } from '../types';
import { useCursor } from '../context/CursorContext';

interface DirectoryEntryProps {
  data: DesignStudio;
}

const DirectoryEntry: React.FC<DirectoryEntryProps> = ({ data }) => {
  const { setHoveredUrl, setPosition } = useCursor();
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout to be safe
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    // Set a delay before triggering the fetch. 
    // This prevents firing requests when the user just moves their mouse across the list.
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredUrl(data.website);
    }, 200); 
  };

  const handleMouseLeave = () => {
    // If the user leaves before the timeout, cancel the request
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredUrl(null);
  };

  return (
    <a 
      href={data.website}
      target="_blank" 
      rel="noopener noreferrer"
      className="group block h-full w-full cursor-pointer bg-canvas p-6 hover:bg-[#161616] transition-colors duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-bold text-white tracking-tight group-hover:underline decoration-1 underline-offset-4 decoration-white transition-all duration-75">
          {data.name}
        </h3>
        <span className="text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-100 ease-linear text-xs">
          ↗
        </span>
      </div>
      
      <p className="text-secondary text-xs leading-relaxed mb-4 max-w-[95%]">
        {data.description}
      </p>
      
      <div className="flex flex-wrap gap-1 mt-auto pt-2">
        {data.services.map((service, index) => (
          <span 
            key={index} 
            className="text-[10px] text-secondary font-mono uppercase tracking-wide"
          >
            [{service}]
          </span>
        ))}
      </div>
    </a>
  );
};

export default DirectoryEntry;