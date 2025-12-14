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

    // --- Configuration ---
    const TOTAL_PARTICLES = 2500; // Giảm nhẹ xuống 2500 để mobile load nhanh hơn (không ảnh hưởng độ đẹp)
    const HEART_COLOR = "#ff5ca8"; 
    const HEART_COLOR_CORE = "#ff85c2"; 
    
    let particles: { x: number; y: number; size: number; color: string; basePos: {x: number, y: number} }[] = [];
    let animationFrameId: number;

    // --- Math Functions ---
    const heartFunction = (t: number, scale: number) => {
      let x = 16 * Math.pow(Math.sin(t), 3);
      let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return { x: x * scale, y: y * scale };
    };

    const scatterInside = (x: number, y: number, beta: number) => {
      // Fix lỗi Math.log(0) = -Infinity gây lỗi hiển thị
      let randomX = Math.random();
      let randomY = Math.random();
      // Đảm bảo không bao giờ log số 0
      if (randomX === 0) randomX = 0.001;
      if (randomY === 0) randomY = 0.001;

      const ratio_x = -beta * Math.log(randomX);
      const ratio_y = -beta * Math.log(randomY);
      
      return { x: x - (ratio_x * x), y: y - (ratio_y * y) };
    };

    const initParticles = (width: number, height: number) => {
      particles = [];
      if (width === 0 || height === 0) return; // Tránh lỗi chia cho 0
      const scale = Math.min(width, height) / 45; 

      for (let i = 0; i < TOTAL_PARTICLES; i++) {
        const t = Math.random() * Math.PI * 2;
        const pos = heartFunction(t, scale);
        
        let finalX = pos.x;
        let finalY = pos.y;
        let size = Math.random() * 1.5 + 0.5;
        let color = HEART_COLOR;

        const randomVal = Math.random();

        if (randomVal >= 0.15 && randomVal < 0.7) {
            const scattered = scatterInside(pos.x, pos.y, 0.15); 
            finalX = scattered.x;
            finalY = scattered.y;
            size = Math.random() * 1.2;
        } else if (randomVal >= 0.7) {
            const scattered = scatterInside(pos.x, pos.y, 0.25);
            finalX = scattered.x;
            finalY = scattered.y;
            color = HEART_COLOR_CORE;
            size = Math.random() * 0.8 + 0.2;
        }

        particles.push({
          x: finalX,
          y: finalY,
          basePos: { x: finalX, y: finalY },
          size: size,
          color: color,
        });
      }
    };

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const t = Date.now() / 1000;
      const beat = 1 + 0.08 * (Math.sin(t * 3) * 0.5 + Math.sin(t * 6) * 0.1);

      particles.forEach(p => {
        const currentX = centerX + p.basePos.x * beat;
        const currentY = centerY + p.basePos.y * beat;
        ctx.fillStyle = p.color;
        ctx.fillRect(currentX, currentY, p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        initParticles(canvas.width, canvas.height);
      }
    };

    // Khởi tạo
    handleResize();
    render();

    // Observer resize
    const resizeObserver = new ResizeObserver(() => {
        handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-80 md:h-96 my-6 relative flex items-center justify-center">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default ParticleHeart;
