import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Handle Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Lock scroll
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset'; // Unlock scroll
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#111] border border-[#333] max-w-lg w-full p-6 md:p-10 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-8 pb-4 border-b border-[#222]">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white font-serif">
              {title}
            </h2>
            <button 
              onClick={onClose} 
              className="text-xs font-mono text-secondary hover:text-white uppercase border border-transparent hover:border-[#333] px-2 py-1 transition-colors"
            >
              [ Close ]
            </button>
        </div>
        
        <div className="text-sm text-secondary leading-relaxed font-sans space-y-6">
            {children}
        </div>

        {/* Footer decoration */}
        <div className="mt-8 pt-4 border-t border-[#222] flex justify-between text-[10px] text-[#444] font-mono uppercase">
          <span>System Message</span>
          <span>End of Content</span>
        </div>
      </div>
    </div>
  );
};

export default Modal;