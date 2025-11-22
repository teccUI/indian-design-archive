
import React from 'react';

interface AlphaHeaderProps {
  letter: string;
}

const AlphaHeader: React.FC<AlphaHeaderProps> = ({ letter }) => {
  return (
    <div className="col-span-full bg-canvas p-6 md:p-12 flex items-baseline">
      <h2 className="text-lg md:text-xl font-black tracking-tighter text-white font-serif">
        {letter}
      </h2>
      <span className="ml-6 text-secondary text-xs font-mono tracking-widest uppercase opacity-50">
        [ Section {letter} ]
      </span>
    </div>
  );
};

export default AlphaHeader;
