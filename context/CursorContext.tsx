import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CursorContextType {
  position: { x: number; y: number };
  hoveredUrl: string | null;
  setHoveredUrl: (url: string | null) => void;
  setPosition: (pos: { x: number; y: number }) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);

  return (
    <CursorContext.Provider value={{ position, hoveredUrl, setHoveredUrl, setPosition }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};