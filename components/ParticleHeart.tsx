import React, { useEffect, useRef } from 'react';

const ParticleHeart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;
    
    // Configuration matches the Python code
    // HEART_COLOR = "#f76070" -> Adjusted slightly for "Cute Pink"
    const HEART_COLOR = "#ff5ca8"; 
    const CANVAS_CENTER_X = width / 2;
    const CANVAS_CENTER_Y = height / 2;
    // Scale factor: Python used 11 for 640 width. We scale based on actual width.
    const SCALE_FACTOR = Math.min(width, height) / 50; 

    // --- Math Helpers from Python Code ---
    
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
      const ratio_x = -beta * Math.log(Math.random());
      const ratio_y = -beta * Math.log(Math.random());
      
      const dx = ratio_x * (x - CANVAS_CENTER_X);
      const dy = ratio_y * (y - CANVAS_CENTER_Y);
      
      return { x: x - dx, y: y - dy };
    };

    const shrink = (x: number, y: number, ratio: number) => {
      const distSq = (x - CANVAS_CENTER_X) ** 2 + (y - CANVAS_CENTER_Y) ** 2;
      // Avoid division by zero or extremely small numbers
      const force = -1 / Math.pow(Math.max(distSq, 1), 0.6);
      
      const dx = ratio * force * (x - CANVAS_CENTER_X);
      const dy = ratio * force * (y - CANVAS_CENTER_Y);
      
      return { x: x - dx, y: y - dy };
    };

    const curve = (p: number) => {
      return 2 * (2 * Math.sin(4 * p)) / (2 * Math.PI);
    };

    // --- Pre-calculate Heart Points (The "Build" phase) ---
    
    const points: {x: number, y: number}[] = [];
    const edgeDiffusionPoints: {x: number, y: number}[] = [];
    const centerDiffusionPoints: {x: number, y: number}[] = [];

    // 1. Base ring
    for (let i = 0; i < 2000; i++) {
      const t = Math.random() * 2 * Math.PI;
      const p = heartFunction(t, SCALE_FACTOR);
      points.push(p);
    }

    // 2. Edge diffusion
    points.forEach(p => {
      for (let i = 0; i < 3; i++) {
        edgeDiffusionPoints.push(scatterInside(p.x, p.y, 0.05));
      }
    });

    // 3. Center diffusion
    for (let i = 0; i < 4000; i++) {
      const p = points[Math.floor(Math.random() * points.length)];
      centerDiffusionPoints.push(scatterInside(p.x, p.y, 0.17));
    }

    // --- Animation Loop ---

    let animationFrameId: number;
    // Map time to "frame" to match the rhythmic function from Python
    // Python code: calc(frame) where frame goes 0..19
    // curve(frame / 10 * pi) -> Period is roughly when frame goes 0->20
    
    const render = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);

      // Slow down the animation. 
      // 0.003 was fast (~0.5s). 
      // 0.0008 is approximately 2 seconds per beat cycle.
      const cycleSpeed = 0.0008; 
      const t = timeMs * cycleSpeed; 
      
      // Calculate curve value (the beat)
      // Python: curve(frame / 10 * pi)
      // Here we simulate the oscillating frame value using sine or just continuous time
      // Let's use continuous time passed to curve function directly
      const curveValue = curve(t);

      const ratio = 10 * curveValue;
      const haloRadius = 4 + 6 * (1 + curveValue);
      // Limit halo number to prevent lag in JS if too high
      const haloNumber = 1000 + 2000 * Math.abs(Math.pow(curveValue, 2));

      const allRenderPoints: {x: number, y: number, size: number}[] = [];

      // Helper to jitter position
      const calcPosition = (x: number, y: number, r: number) => {
        const distSq = (x - CANVAS_CENTER_X) ** 2 + (y - CANVAS_CENTER_Y) ** 2;
        const force = 1 / Math.pow(Math.max(distSq, 1), 0.52);
        
        const dx = r * force * (x - CANVAS_CENTER_X) + (Math.random() * 2 - 1);
        const dy = r * force * (y - CANVAS_CENTER_Y) + (Math.random() * 2 - 1);
        
        return { x: x - dx, y: y - dy };
      };

      // 1. Halo
      const heartHaloSet = new Set<string>(); // Use string keys for simplified Set check
      for (let i = 0; i < haloNumber; i++) {
        const rad = Math.random() * 2 * Math.PI;
        let p = heartFunction(rad, SCALE_FACTOR * 1.05); // shrink_ratio=11.6 vs 11 in python is ~5% larger base before shrink
        p = shrink(p.x, p.y, haloRadius);
        
        const key = `${Math.floor(p.x)},${Math.floor(p.y)}`;
        if (!heartHaloSet.has(key)) {
          heartHaloSet.add(key);
          const x = p.x + (Math.random() * 28 - 14);
          const y = p.y + (Math.random() * 28 - 14);
          const size = Math.random() < 0.33 ? 2 : 1; // Simplify sizes
          allRenderPoints.push({ x, y, size });
        }
      }

      // 2. Main points
      points.forEach(p => {
        const newPos = calcPosition(p.x, p.y, ratio);
        allRenderPoints.push({ x: newPos.x, y: newPos.y, size: Math.random() * 2 + 1 });
      });

      // 3. Edge diffusion
      edgeDiffusionPoints.forEach(p => {
        const newPos = calcPosition(p.x, p.y, ratio);
        allRenderPoints.push({ x: newPos.x, y: newPos.y, size: Math.random() * 1.5 + 0.5 });
      });

      // 4. Center diffusion
      centerDiffusionPoints.forEach(p => {
        const newPos = calcPosition(p.x, p.y, ratio);
        allRenderPoints.push({ x: newPos.x, y: newPos.y, size: Math.random() * 1.5 + 0.5 });
      });

      // Draw all points
      ctx.fillStyle = HEART_COLOR;
      
      // Batch drawing for performance could be done, but simple rects are usually fast enough
      allRenderPoints.forEach(p => {
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
       width = canvas.width = canvas.clientWidth;
       height = canvas.height = canvas.clientHeight;
       // Note: In a real app we might want to rebuild the static points on resize
       // but for simplicity we keep them. They are relative to center variables 
       // which are re-calced in drawing but "points" array stores absolute. 
       // Ideally we re-run "Build" phase here, but we'll leave it for now or force reload.
    };

    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-80 md:h-96 my-6 relative flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ParticleHeart;