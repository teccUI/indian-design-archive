
import React, { useState, useEffect, useCallback } from 'react';

// Types for Pexels API Response
interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

// Hardcoded fallback to remove dependency on data/featuredImages.ts
const FALLBACK_PHOTO: PexelsPhoto = {
  id: 3581364,
  width: 1600,
  height: 1200,
  url: "https://www.pexels.com/photo/hawa-mahal-3581364/",
  photographer: "Lal Chand Ustad",
  photographer_url: "",
  photographer_id: 0,
  avg_color: "#000000",
  src: {
    original: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg",
    large2x: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1600",
    large: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1600",
    medium: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1600",
    small: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1600",
    portrait: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1600",
    landscape: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1600",
    tiny: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1600"
  },
  liked: false,
  alt: "Hawa Mahal"
};

// Search queries derived from the requested Pexels categories
const SEARCH_QUERIES = [
  "Indian Architecture",
  "Indian Artisan",
  "Indian Culture",
  "Indian Design"
];

const FeaturePanel: React.FC = () => {
  const [photo, setPhoto] = useState<PexelsPhoto | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState(false);

  const fetchPexelsImage = useCallback(async () => {
    setLoading(true);
    setError(false);

    // Randomize page to get different images
    const page = Math.floor(Math.random() * 50) + 1;

    // Randomize the search query to vary between Architecture, Artisan, and Culture
    const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)];

    // Using environment variable for API key to ensure security
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

    if (!apiKey) {
      console.warn('Pexels API key not found in environment variables. Using fallback image.');
      fallbackToLocal();
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&page=${page}`, {
        headers: {
          Authorization: apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        setPhoto(data.photos[0]);
      } else {
        // Fallback to local constant if API returns empty
        fallbackToLocal();
      }
    } catch (err) {
      console.error('Failed to fetch from Pexels:', err);
      fallbackToLocal();
    } finally {
      // Keep loading state true for image onLoad to handle
    }
  }, []);

  const fallbackToLocal = () => {
    setPhoto(FALLBACK_PHOTO);
  };

  useEffect(() => {
    fetchPexelsImage();
  }, [fetchPexelsImage]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <aside className="hidden xl:flex w-[40%] flex-col border-l border-[#1a1a1a] h-full bg-canvas overflow-hidden relative group">

      {/* Header */}
      <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-end shrink-0 bg-canvas z-20 relative">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white font-serif leading-none mb-1">
            Featured<br />India
          </h2>
          <p className="text-[10px] font-mono text-secondary uppercase tracking-widest">
            [ Design in Everyday India ]
          </p>
        </div>
        <div className="text-right">
          <span className="block text-xs font-bold text-white">{new Date().toLocaleDateString('en-GB', { weekday: 'long' })}</span>
          <span className="block text-[10px] text-secondary font-mono">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 relative w-full bg-[#0a0a0a] overflow-hidden">

        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-30 pointer-events-none">
            <div className="space-y-2 text-center">
              <div className="w-16 h-[1px] bg-[#333] mx-auto overflow-hidden">
                <div className="h-full bg-white animate-[shimmer_1s_infinite_linear] w-1/2"></div>
              </div>
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest block animate-pulse">
                Fetching Asset...
              </span>
            </div>
          </div>
        )}

        {photo && (
          <a
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full relative cursor-pointer group/image bg-[#050505] overflow-hidden"
            title="View original on Pexels"
          >
            <img
              src={photo.src.large2x}
              alt={photo.alt}
              className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] 
                ${loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100 grayscale group-hover/image:grayscale-0 group-hover/image:scale-[0.96]'}
              `}
              onLoad={handleImageLoad}
            />

            {/* Metadata Overlay - Fade in when loaded */}
            <div className={`absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent pt-32 transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
              <div className="border-l-2 border-white pl-4">
                <h3 className="text-3xl font-serif font-bold text-white uppercase leading-none mb-2 line-clamp-2">
                  {photo.alt || "Untitled Composition"}
                </h3>

                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-white/20"></span>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/80">
                    India
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-4 pt-4 border-t border-white/20">
                  <div>
                    <span className="block text-[9px] text-secondary uppercase tracking-widest mb-1">Photographer</span>
                    <span className="block text-xs text-white font-bold">{photo.photographer}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-secondary uppercase tracking-widest mb-1">Source</span>
                    <span className="block text-xs text-white font-bold flex items-center gap-1">
                      Pexels <span className="text-[8px] opacity-50">↗</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        )}
      </div>
    </aside>
  );
};

export default FeaturePanel;
