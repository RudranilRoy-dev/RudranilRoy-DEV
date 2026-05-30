import { useEffect, useRef } from "react";

export function AnimatedGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.08), transparent)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 120%, rgba(139, 92, 246, 0.05), transparent)",
        }}
      />
    </div>
  );
}

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Reduced particle count for performance
    const MAX_PARTICLES = 30;
    const particles: Array<{
      x: number; y: number;
      vx: number; vy: number;
      size: number; opacity: number;
    }> = [];

    const resize = () => {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    };

    const init = () => {
      resize();
      const count = Math.min(Math.floor(width / 40), MAX_PARTICLES);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.25 + 0.08,
        });
      }
    };

    const animate = () => {
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
        ctx!.fill();
      }

      // Only draw connections for nearby particles — limited to avoid O(n²) explosion
      const connectionLimit = 90;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          // Skip sqrt — compare squared distance for speed
          const distSq = dx * dx + dy * dy;
          if (distSq < connectionLimit * connectionLimit) {
            const dist = Math.sqrt(distSq);
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(99, 102, 241, ${0.04 * (1 - dist / connectionLimit)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
      aria-hidden="true"
    />
  );
}
