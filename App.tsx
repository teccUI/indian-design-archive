
import React, { useState, useMemo } from 'react';
import SidebarFilter from './components/SidebarFilter';
import DirectoryEntry from './components/DirectoryEntry';
import AlphaHeader from './components/AlphaHeader';
import LinkPreview from './components/LinkPreview';
import Modal from './components/Modal';
import CustomCursor from './components/CustomCursor';
import FeaturePanel from './components/FeaturePanel';
import { CursorProvider } from './context/CursorContext';
import { designStudios } from './data/mockData';
import { DesignStudio } from './types';

const AppContent: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [activeModal, setActiveModal] = useState<'about' | 'legal' | 'submit' | 'feedback' | null>(null);

  // Filter Logic
  const filteredData = useMemo(() => {
    if (activeFilter === 'All') return designStudios;
    return designStudios.filter(studio => 
      studio.services.some(service => 
        // Direct match for most categories
        service.toLowerCase().includes(activeFilter.toLowerCase()) || 
        // Extended logic for sub-groupings
        (activeFilter === 'Architecture' && ['urban planning', 'restoration'].some(s => service.includes(s))) ||
        (activeFilter === 'Product' && ['furniture'].some(s => service.includes(s))) ||
        (activeFilter === 'Interior' && ['furniture', 'restoration'].some(s => service.includes(s)))
      )
    );
  }, [activeFilter]);

  // Grouping Logic
  const groupedData = useMemo(() => {
    const groups: { [key: string]: DesignStudio[] } = {};
    filteredData.forEach(studio => {
      // Group by the first letter of the name (A-Z) instead of the 2-letter code
      const initial = studio.name.charAt(0).toUpperCase();
      if (!groups[initial]) {
        groups[initial] = [];
      }
      groups[initial].push(studio);
    });
    // Sort keys alphabetically
    return Object.keys(groups).sort().reduce<{ [key: string]: DesignStudio[] }>(
      (obj, key) => { 
        obj[key] = groups[key]; 
        return obj;
      }, 
      {}
    );
  }, [filteredData]);

  const handleSubmitEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const subject = `Directory Entry Request: ${data.name}`;
    const body = `
REQUEST TO ADD NEW ENTRY
------------------------
Name: ${data.name}
Website: ${data.website}
Location: ${data.location}
Services: ${data.services}
Description: ${data.description}

------------------------
Submitted via Web Interface
`;
    
    window.location.href = `mailto:rajpau075@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setActiveModal(null);
  };

  const handleSubmitFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const subject = `[${data.type}] Indian Design Archive`;
    const body = `
FEEDBACK / ISSUE REPORT
------------------------
Type: ${data.type}
Description:
${data.description}

------------------------
Submitted via Web Interface
`;
    
    window.location.href = `mailto:rajpaul075@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setActiveModal(null);
  };

  return (
    <div className="h-screen w-screen bg-canvas text-white font-sans selection:bg-white selection:text-canvas flex flex-col md:flex-row cursor-none overflow-hidden">
      
      <CustomCursor />
      <LinkPreview />

      <Modal 
        isOpen={activeModal === 'about'} 
        onClose={() => setActiveModal(null)} 
        title="About"
      >
        <p>
          <strong className="text-white">The Indian Design Archive</strong> is a living repository dedicated to documenting and showcasing the seminal works of Indian design professionals.
        </p>
        <p>
          From the pioneers of post-independence architecture to the avant-garde of contemporary fashion and digital design, this archive serves as a minimalist, distraction-free resource for researchers, students, and industry enthusiasts.
        </p>
        <p>
          The objective is to strip away marketing noise and present the design community as a structured, interconnected index—honoring the "Swiss Style" philosophy of objectivity and clarity.
        </p>
      </Modal>

      <Modal 
        isOpen={activeModal === 'legal'} 
        onClose={() => setActiveModal(null)} 
        title="Legal"
      >
        <p>
          <strong className="text-white">Disclaimer:</strong> The Indian Design Archive is an independent, non-commercial educational project. It is not affiliated with any of the design studios, brands, or individuals listed herein.
        </p>
        <p>
          All trademarks, logos, and brand names are the property of their respective owners. All company, product, and service names used in this website are for identification purposes only. Use of these names, trademarks, and brands does not imply endorsement.
        </p>
        <p>
          If you are a copyright owner and wish to have your entry removed or updated, please contact the administration.
        </p>
      </Modal>

      <Modal 
        isOpen={activeModal === 'submit'} 
        onClose={() => setActiveModal(null)} 
        title="Submit Entry"
      >
        <p className="mb-6 text-secondary">
          To maintain the integrity of the archive, all submissions are manually reviewed. 
          Please fill out the details below to generate a request email.
        </p>
        
        <form onSubmit={handleSubmitEntry} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-secondary">Name *</label>
            <input 
              name="name" 
              required 
              type="text" 
              className="w-full bg-[#161616] border border-[#333] text-white p-3 text-sm font-mono focus:outline-none focus:border-white transition-colors placeholder-[#444]"
              placeholder="e.g. Charles Correa"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-secondary">Website *</label>
            <input 
              name="website" 
              required 
              type="url" 
              className="w-full bg-[#161616] border border-[#333] text-white p-3 text-sm font-mono focus:outline-none focus:border-white transition-colors placeholder-[#444]"
              placeholder="https://"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-secondary">Location *</label>
              <input 
                name="location" 
                required 
                type="text" 
                className="w-full bg-[#161616] border border-[#333] text-white p-3 text-sm font-mono focus:outline-none focus:border-white transition-colors placeholder-[#444]"
                placeholder="Mumbai, India"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-secondary">Services</label>
              <input 
                name="services" 
                required 
                type="text" 
                className="w-full bg-[#161616] border border-[#333] text-white p-3 text-sm font-mono focus:outline-none focus:border-white transition-colors placeholder-[#444]"
                placeholder="Architecture, Interior..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-secondary">Description</label>
            <textarea 
              name="description" 
              required 
              maxLength={200}
              rows={3}
              className="w-full bg-[#161616] border border-[#333] text-white p-3 text-sm font-sans focus:outline-none focus:border-white transition-colors placeholder-[#444]"
              placeholder="Brief description of the studio's philosophy or key works..."
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black font-bold uppercase tracking-wide py-3 text-xs hover:bg-[#ccc] transition-colors mt-2"
          >
            [ Generate Request Email ]
          </button>
        </form>
      </Modal>

      <Modal 
        isOpen={activeModal === 'feedback'} 
        onClose={() => setActiveModal(null)} 
        title="Feedback / Issue"
      >
        <p className="mb-6 text-secondary">
            Help us improve the archive. Report bugs or suggest new features directly to the maintainers.
        </p>
        
        <form onSubmit={handleSubmitFeedback} className="space-y-6">
          
          <div className="space-y-2">
             <label className="text-[10px] font-mono uppercase tracking-widest text-secondary block">Type *</label>
             <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="type" value="Feature Request" defaultChecked className="appearance-none w-3 h-3 border border-secondary checked:bg-white rounded-full" />
                    <span className="text-xs text-secondary group-hover:text-white font-mono uppercase">Feature Request</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="type" value="Issue / Bug" className="appearance-none w-3 h-3 border border-secondary checked:bg-white rounded-full" />
                    <span className="text-xs text-secondary group-hover:text-white font-mono uppercase">Issue</span>
                </label>
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-secondary">Description *</label>
            <textarea 
              name="description" 
              required 
              rows={5}
              className="w-full bg-[#161616] border border-[#333] text-white p-3 text-sm font-sans focus:outline-none focus:border-white transition-colors placeholder-[#444]"
              placeholder="Describe the feature you'd like to see or the bug you encountered..."
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black font-bold uppercase tracking-wide py-3 text-xs hover:bg-[#ccc] transition-colors"
          >
            [ Send Feedback ]
          </button>
        </form>
      </Modal>

      {/* Sidebar - Fixed on Desktop */}
      <SidebarFilter 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter}
        totalCount={filteredData.length}
        onOpenAbout={() => setActiveModal('about')}
        onOpenLegal={() => setActiveModal('legal')}
        onOpenSubmit={() => setActiveModal('submit')}
        onOpenFeedback={() => setActiveModal('feedback')}
      />

      {/* Main Wrapper for Grid and Feature Panel */}
      <main className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden relative">
        
        {/* Center Column: Header + Scrollable Directory + Fixed Footer */}
        <div className="flex-1 flex flex-col bg-[#1a1a1a] h-full overflow-hidden relative">
            
            {/* Fixed Header */}
            <div className="bg-canvas p-6 md:p-8 flex flex-col justify-end min-h-[15vh] border-b border-[#1a1a1a] shrink-0 z-10">
                <div className="max-w-4xl">
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-6 font-serif">
                    All Designers<br/>
                    <span className="text-secondary">In India</span>
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-white border border-white px-2 py-1 uppercase">
                    Sorted By: Name (A-Z)
                    </span>
                    {activeFilter !== 'All' && (
                    <span className="text-xs font-mono bg-white text-black border border-white px-2 py-1 uppercase">
                        Filter: {activeFilter}
                    </span>
                    )}
                </div>
                </div>
            </div>

            {/* Scrollable Area - Contains only the grid */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-[#1a1a1a]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-px bg-[#1a1a1a] border-b border-[#1a1a1a] content-start min-h-full">
                
                {/* Directory Content */}
                {Object.keys(groupedData).length > 0 ? (
                    Object.entries(groupedData).map(([initial, studios]: [string, unknown]) => (
                    <React.Fragment key={initial}>
                        <AlphaHeader letter={initial} />
                        {(studios as DesignStudio[]).map((studio) => (
                        <DirectoryEntry key={studio.id} data={studio} />
                        ))}
                    </React.Fragment>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-canvas">
                    <p className="text-secondary font-mono uppercase text-sm">[ No Entries Found ]</p>
                    </div>
                )}
                
                </div>
            </div>

            {/* Fixed Footer */}
            <div className="bg-canvas p-6 md:p-8 border-t border-[#1a1a1a] shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-[10px] text-secondary uppercase tracking-widest font-mono z-10">
                <div>
                    <p>© 2024 Indian Design Archive</p>
                    <p>Curated for educational purposes</p>
                </div>
            </div>
        </div>

        {/* Feature Panel - Fixed and Non-Scrollable */}
        <FeaturePanel />

      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CursorProvider>
      <AppContent />
    </CursorProvider>
  );
};

export default App;
