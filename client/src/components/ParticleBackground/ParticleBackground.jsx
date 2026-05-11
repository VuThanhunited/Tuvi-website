import { useEffect, useRef } from 'react';
import './ParticleBackground.css';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Cấu hình cho các hạt (particles)
    const PARTICLE_COLOR = 'rgba(181, 137, 0, 0.4)'; // Màu vàng gold nhẹ
    const LINE_COLOR_R = 181;
    const LINE_COLOR_G = 137;
    const LINE_COLOR_B = 0;
    const CONNECTION_DISTANCE = 100;
    const SPEED = 0.2; // Tốc độ trôi dạt chậm rãi
    const DENSITY = 8000; // Mật độ (số pixel trên mỗi hạt)
    
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / DENSITY);
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * SPEED,
          vy: (Math.random() - 0.5) * SPEED,
          radius: Math.random() * 1.5 + 0.5 // Kích thước hạt nhỏ
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Cập nhật vị trí hạt
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Nảy ngược lại khi chạm viền (hoặc xuất hiện ở phía đối diện)
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      // Vẽ các đường liên kết (tạo hình tam giác/đa giác)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < CONNECTION_DISTANCE) { 
            ctx.beginPath();
            // Độ mờ của đường kẻ phụ thuộc vào khoảng cách giữa 2 điểm
            const opacity = 1 - (dist / CONNECTION_DISTANCE);
            ctx.strokeStyle = `rgba(${LINE_COLOR_R}, ${LINE_COLOR_G}, ${LINE_COLOR_B}, ${opacity * 0.5})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Vẽ các hạt (dấu chấm)
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    // Theo dõi kích thước của thẻ cha để tự động thay đổi kích thước canvas
    const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
    });
    
    if (canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
    }
    
    resizeCanvas();
    drawParticles();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-network-canvas" />;
}
