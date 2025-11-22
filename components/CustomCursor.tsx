import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Center the cursor on the mouse position
        // Use translate3d for performance
        const x = e.clientX;
        const y = e.clientY;
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${isPressed ? 0.8 : 1})`;
      }
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isPressed]);

  // Only show on devices that likely have a mouse
  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block will-change-transform mix-blend-difference"
      style={{ pointerEvents: 'none' }} 
    >
      {/* Simple Geometric Square */}
      <div className="w-3 h-3 bg-white shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
    </div>
  );
};

export default CustomCursor;