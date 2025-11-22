import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  createdAt: number;
  color: string;
}

const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const requestRef = useRef<number>(0);

  // Configuration
  const FADE_DURATION = 5000; // 5 seconds
  const LINE_WIDTH = 2; // Thinner for pencil look
  const STROKE_COLOR = '#dedede'; // Off-white / Light Grey (Chalk/Graphite on dark mode)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    // Animation Loop
    const animate = (time: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const now = Date.now();
      
      // Filter out old strokes that have completely faded
      strokesRef.current = strokesRef.current.filter(stroke => {
        const age = now - stroke.createdAt;
        return age < FADE_DURATION;
      });

      // Draw existing strokes
      strokesRef.current.forEach(stroke => {
        const age = now - stroke.createdAt;
        const opacity = Math.max(0, 1 - (age / FADE_DURATION));
        
        drawStroke(ctx, stroke, opacity);
      });

      // Draw current active stroke (no fade)
      if (currentStrokeRef.current) {
        drawStroke(ctx, currentStrokeRef.current, 1);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // Event Listeners attached to WINDOW to capture movement everywhere
    // even though the canvas is pointer-events-none
    const handleMouseDown = (e: MouseEvent) => {
      // Check if the target is an input or textarea to allow typing/focus
      const target = e.target as HTMLElement;
      const isFormElement = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      
      if (isFormElement) {
        return;
      }

      // Prevent default to stop text selection while drawing
      e.preventDefault();

      isDrawingRef.current = true;
      const newStroke: Stroke = {
        points: [{ x: e.clientX, y: e.clientY }],
        createdAt: Date.now(), // Placeholder, will be updated on mouse up
        color: STROKE_COLOR
      };
      currentStrokeRef.current = newStroke;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawingRef.current || !currentStrokeRef.current) return;
      currentStrokeRef.current.points.push({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      if (isDrawingRef.current && currentStrokeRef.current) {
        // Finalize the stroke with the actual end time so fading starts now
        currentStrokeRef.current.createdAt = Date.now();
        strokesRef.current.push(currentStrokeRef.current);
      }
      isDrawingRef.current = false;
      currentStrokeRef.current = null;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke, opacity: number) => {
    if (stroke.points.length < 2) return;

    ctx.beginPath();
    // Changed to square to match new cursor
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter'; 
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = stroke.color;
    ctx.globalAlpha = opacity;

    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    // Simple smoothing
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }

    ctx.stroke();
    ctx.globalAlpha = 1; // Reset alpha
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9000] pointer-events-none hidden md:block"
    />
  );
};

export default DrawingCanvas;