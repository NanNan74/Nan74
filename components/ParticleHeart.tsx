import React, { useEffect, useRef } from 'react';

const ParticleHeart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Setup Canvas
    const updateSize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    updateSize();

    let width = canvas.width;
    let height = canvas.height;

    // Fallback if size is 0 (prevents crash)
    if (width === 0 || height === 0) {
      width = 300;
      height = 300;
      canvas.width = 300;
      canvas.height = 300;
    }

    const HEART_COLOR = "#ff5ca8";
    const CANVAS_CENTER_X = width / 2;
    const CANVAS_CENTER_Y = height / 2;
    const SCALE_FACTOR = Math.min(width, height) / 50; 
    const FRAME_COUNT = 20; // Number of animation frames to pre-calculate (matches Python)

    // --- Math Helpers ---
    const heartFunction = (t: number, scale: number) => {
      let x = 16 * Math.pow(Math.sin(t), 3);
      let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      x *= scale;
      y *= scale;
      x += CANVAS_CENTER_X;
      y += CANVAS_CENTER_Y;
      return { x, y };
    };

    const scatterInside = (x: number, y: number, beta: number) => {
      // Safety: Math.random() can be 0, Math.log(0) is -Infinity. Use || 1e-9 safety.
      const ratio_x = -beta * Math.log(Math.random() || 1e-9);
      const ratio_y = -beta * Math.log(Math.random() || 1e-9);
      const dx = ratio_x * (x - CANVAS_CENTER_X);
      const dy = ratio_y * (y - CANVAS_CENTER_Y);
      return { x: x - dx, y: y - dy };
    };

    const shrink = (x: number, y: number, ratio: number) => {
      const distSq = (x - CANVAS_CENTER_X) ** 2 + (y - CANVAS_CENTER_Y) ** 2;
      // Safety: max(distSq, 1) to avoid division by zero
      const force = -1 / Math.pow(Math.max(distSq, 1), 0.6);
      const dx = ratio * force * (x - CANVAS_CENTER_X);
      const dy = ratio * force * (y - CANVAS_CENTER_Y);
      return { x: x - dx, y: y - dy };
    };

    const curve = (p: number) => {
      return 2 * (2 * Math.sin(4 * p)) / (2 * Math.PI);
    };

    const calcPosition = (x: number, y: number, ratio: number) => {
      const distSq = (x - CANVAS_CENTER_X) ** 2 + (y - CANVAS_CENTER_Y) ** 2;
      const force = 1 / Math.pow(Math.max(distSq, 1), 0.52);
      const dx = ratio * force * (x - CANVAS_CENTER_X) + (Math.random() * 2 - 1);
      const dy = ratio * force * (y - CANVAS_CENTER_Y) + (Math.random() * 2 - 1);
      return { x: x - dx, y: y - dy };
    };

    // --- Pre-calculation Phase (Heavy work done ONCE here) ---
    
    // 1. Build Base Structure
    const points: {x: number, y: number}[] = [];
    const edgeDiffusionPoints: {x: number, y: number}[] = [];
    const centerDiffusionPoints: {x: number, y: number}[] = [];

    // Ring
    for (let i = 0; i < 2000; i++) {
      const t = Math.random() * 2 * Math.PI;
      points.push(heartFunction(t, SCALE_FACTOR));
    }

    // Edge
    points.forEach(p => {
      for (let i = 0; i < 3; i++) {
        edgeDiffusionPoints.push(scatterInside(p.x, p.y, 0.05));
      }
    });

    // Center
    for (let i = 0; i < 4000; i++) {
      const p = points[Math.floor(Math.random() * points.length)];
      centerDiffusionPoints.push(scatterInside(p.x, p.y, 0.17));
    }

    // 2. Build Animation Frames
    const frames: {x: number, y: number, size: number}[][] = [];

    for (let f = 0; f < FRAME_COUNT; f++) {
      const framePoints: {x: number, y: number, size: number}[] = [];
      // Calculate curve for this frame (simulating the Python 'generate_frame' logic)
      // Python logic uses range(0, 20).
      const p = (f / FRAME_COUNT) * Math.PI; 
      const curveValue = curve(p); 
      
      const ratio = 10 * curveValue;
      const haloRadius = 4 + 6 * (1 + curveValue);
      const haloNumber = Math.floor(1000 + 2000 * Math.abs(Math.pow(curveValue, 2)));

      // Generate Halo for this frame
      const heartHaloSet = new Set<string>();
      for (let i = 0; i < haloNumber; i++) {
        const rad = Math.random() * 2 * Math.PI;
        let pos = heartFunction(rad, SCALE_FACTOR * 1.05); 
        pos = shrink(pos.x, pos.y, haloRadius);
        
        const key = `${Math.floor(pos.x)},${Math.floor(pos.y)}`;
        if (!heartHaloSet.has(key)) {
          heartHaloSet.add(key);
          const x = pos.x + (Math.random() * 28 - 14);
          const y = pos.y + (Math.random() * 28 - 14);
          const size = Math.random() < 0.3 ? 2 : 1; 
          framePoints.push({ x, y, size });
        }
      }

      // Apply effects to base points
      [...points, ...edgeDiffusionPoints, ...centerDiffusionPoints].forEach(pt => {
        const newPos = calcPosition(pt.x, pt.y, ratio);
        const size = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 2 : 1.5;
        framePoints.push({ x: newPos.x, y: newPos.y, size });
      });

      frames.push(framePoints);
    }

    // --- Render Loop ---
    let animationFrameId: number;
    
    // We want the cycle to last ~2 seconds.
    // There are 20 frames. So each frame should display for 2000ms / 20 = 100ms.
    const FPS = 15; // Slow down the frame rate intentionally for the "beating" feel
    let lastDrawTime = 0;
    let currentFrameIndex = 0;

    const render = (time: number) => {
      const deltaTime = time - lastDrawTime;
      
      if (deltaTime > 1000 / FPS) {
        lastDrawTime = time;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = HEART_COLOR;
        
        const pointsToDraw = frames[currentFrameIndex];
        // Optimize drawing: Use 1x1 rects or small rects
        for (let i = 0; i < pointsToDraw.length; i++) {
          const p = pointsToDraw[i];
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        currentFrameIndex = (currentFrameIndex + 1) % FRAME_COUNT;
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Resize handler (Simplistic: Just clear and restart/reload would be better but expensive)
    const handleResize = () => {
       // In a real optimized app, we would debounce this and re-run calculations.
       // For now, let's just update width/height so it doesn't stretch weirdly, 
       // but the heart might be off-center until refresh.
       if (container) {
         canvas.width = container.clientWidth;
         canvas.height = container.clientHeight;
       }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-80 md:h-96 my-6 relative flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default ParticleHeart;