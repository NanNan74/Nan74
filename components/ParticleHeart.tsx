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
    const TOTAL_PARTICLES = 3000; // Đã nâng lên 3000 hạt
    const HEART_COLOR = "#ff5ca8"; // Màu hồng chủ đạo
    const HEART_COLOR_CORE = "#ff85c2"; // Màu lõi sáng hơn chút
    
    // Arrays to store particle data
    let particles: { x: number; y: number; size: number; color: string; velocity: {x: number, y: number}, basePos: {x: number, y: number} }[] = [];
    let animationFrameId: number;
    let time = 0;

    // --- Math Functions ---

    // Hàm tạo dáng trái tim chuẩn
    const heartFunction = (t: number, scale: number) => {
      let x = 16 * Math.pow(Math.sin(t), 3);
      let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return { x: x * scale, y: y * scale };
    };

    // Hàm phân tán hạt vào trong (tạo độ dày) - dùng Logarit
    const scatterInside = (x: number, y: number, beta: number) => {
      const ratio_x = -beta * Math.log(Math.random());
      const ratio_y = -beta * Math.log(Math.random());
      
      const dx = ratio_x * x;
      const dy = ratio_y * y;
      
      return { x: x - dx, y: y - dy };
    };

    const initParticles = (width: number, height: number) => {
      particles = [];
      // Tinh chỉnh scale dựa trên màn hình
      const scale = Math.min(width, height) / 45; 

      // Tạo hạt
      for (let i = 0; i < TOTAL_PARTICLES; i++) {
        const t = Math.random() * Math.PI * 2;
        const pos = heartFunction(t, scale);
        
        // Phân loại hạt để tạo hiệu ứng 3D
        let finalX = pos.x;
        let finalY = pos.y;
        let size = Math.random() * 1.5 + 0.5; // Kích thước hạt từ 0.5 đến 2px
        let color = HEART_COLOR;

        const randomVal = Math.random();

        if (randomVal < 0.15) {
            // 15% hạt: Viền sắc nét
        } else if (randomVal < 0.7) {
            // 55% hạt: Phân tán vào trong (tạo body)
            const scattered = scatterInside(pos.x, pos.y, 0.15); 
            finalX = scattered.x;
            finalY = scattered.y;
            size = Math.random() * 1.2; // Hạt bên trong nhỏ hơn chút cho mịn
        } else {
            // 30% hạt: Halo mờ ảo
            const scattered = scatterInside(pos.x, pos.y, 0.25);
            finalX = scattered.x;
            finalY = scattered.y;
            color = HEART_COLOR_CORE;
            size = Math.random() * 0.8 + 0.2; // Hạt halo nhỏ li ti
        }

        particles.push({
          x: finalX,
          y: finalY,
          basePos: { x: finalX, y: finalY }, // Lưu vị trí gốc (tương đối so với tâm)
          size: size,
          color: color,
          velocity: { x: 0, y: 0 }
        });
      }
    };

    const render = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Nhịp tim
      // Sử dụng công thức mô phỏng nhịp tim thực tế
      const t = Date.now() / 1000;
      const beat = 1 + 0.08 * (
          Math.sin(t * 3) * 0.5 + 
          Math.sin(t * 6) * 0.1
      );

      particles.forEach(p => {
        // Vị trí hiện tại = Vị trí gốc * độ phóng đại của nhịp tim
        const currentX = centerX + p.basePos.x * beat;
        const currentY = centerY + p.basePos.y * beat;

        ctx.fillStyle = p.color;
        
        // Vẽ hình vuông tối ưu hiệu năng
        ctx.fillRect(currentX, currentY, p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initParticles(canvas.width, canvas.height);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    render();

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