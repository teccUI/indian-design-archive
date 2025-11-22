
import React, { useState, useMemo } from 'react';
import { FilterCategory } from '../types';

interface SidebarFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  totalCount: number;
  onOpenAbout: () => void;
  onOpenLegal: () => void;
  onOpenSubmit: () => void;
  onOpenFeedback: () => void;
}

const categories: FilterCategory[] = [
  'All',
  'Architecture',
  'Fashion',
  'Graphic Design',
  'Industrial',
  'Interior',
  'Product',
  'Typography'
];

const SidebarFilter: React.FC<SidebarFilterProps> = ({ 
  activeFilter, 
  onFilterChange, 
  totalCount,
  onOpenAbout,
  onOpenLegal,
  onOpenSubmit,
  onOpenFeedback
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLinkClick = (action: () => void) => {
    action();
    setIsMobileOpen(false);
  };

  // Calculate the last updated date dynamically based on the document's modification time
  const lastUpdated = useMemo(() => {
    if (typeof document !== 'undefined') {
      const date = new Date(document.lastModified);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
      }
    }
    // Fallback if document.lastModified is unavailable
    return new Date().toISOString().split('T')[0].replace(/-/g, '.');
  }, []);

  return (
    <aside className="w-full md:w-[220px] lg:w-[280px] shrink-0 border-b md:border-b-0 md:border-r border-[#1a1a1a] flex flex-col bg-canvas z-40 h-auto md:h-full">
      {/* Mobile Header / Toggle */}
      <div className="p-4 md:p-6 flex justify-between items-center md:block sticky top-0 bg-canvas md:relative z-50 border-b border-[#1a1a1a] md:border-none shrink-0">
        <h1 className="text-sm font-bold tracking-tight uppercase leading-none">
          Indian<br />Design<br />Archive
        </h1>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-xs text-secondary hover:text-white uppercase tracking-wider border border-[#333] px-2 py-1"
        >
          {isMobileOpen ? '[ Close ]' : '[ Filters ]'}
        </button>
      </div>

      {/* Filter List */}
      <div className={`${isMobileOpen ? 'block' : 'hidden'} md:block flex-1 overflow-y-auto no-scrollbar`}>
        <div className="p-4 md:p-6 md:pt-0 space-y-8 pb-4">
          
          {/* Stats / Metadata */}
          <div className="text-[10px] text-secondary font-mono space-y-1 pb-6 border-b border-[#1a1a1a]">
            <div className="flex justify-between">
              <span>REGION:</span>
              <span className="text-white">INDIA</span>
            </div>
            <div className="flex justify-between">
              <span>ENTRIES:</span>
              <span className="text-white">{totalCount}</span>
            </div>
            <div className="flex justify-between">
              <span>UPDATED:</span>
              <span className="text-white">{lastUpdated}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest text-secondary mb-3">Index By Category</h4>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onFilterChange(cat);
                      setIsMobileOpen(false);
                    }}
                    className={`text-xs w-full text-left uppercase tracking-wide py-1 transition-colors duration-75 flex justify-between items-center group ${
                      activeFilter === cat 
                        ? 'text-white font-bold' 
                        : 'text-secondary hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    {activeFilter === cat && <span className="text-[10px]">●</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Links */}
          <div className="space-y-2 pt-8">
            
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => handleLinkClick(onOpenAbout)}
                  className="text-xs text-secondary hover:text-white uppercase block py-1 hover:underline decoration-1 underline-offset-4 w-full text-left"
                >
                  [ About ]
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(onOpenLegal)}
                  className="text-xs text-secondary hover:text-white uppercase block py-1 hover:underline decoration-1 underline-offset-4 w-full text-left mb-2"
                >
                  [ Legal ]
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(onOpenSubmit)}
                  className="text-xs text-white font-bold uppercase block py-1 hover:underline decoration-1 underline-offset-4 w-full text-left mb-1"
                >
                  [ + Submit Entry ]
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick(onOpenFeedback)}
                  className="text-xs text-white font-bold uppercase block py-1 hover:underline decoration-1 underline-offset-4 w-full text-left"
                >
                  [ + Feedback / Issue ]
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Credits - Pinned to bottom */}
      <div className={`${isMobileOpen ? 'block' : 'hidden'} md:block p-4 md:p-6 md:pb-10 shrink-0`}>
        <div className="text-[10px] text-secondary font-mono leading-relaxed">
           Created with love and passion by <a href="https://www.linkedin.com/in/pauldesigns/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline decoration-1 underline-offset-2">Raj Paul</a>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilter;
