import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function TechnicalGridFrame() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [time, setTime] = useState('');

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? Math.round((window.scrollY / totalScroll) * 100) : 0;
      setScrollProgress(progress);
    };

    const updateTime = () => {
      const d = new Date();
      setTime(d.toTimeString().split(' ')[0]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Initial call
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9980] hidden md:block select-none">
      {/* Outer Border with slight inset */}
      <div className="absolute inset-6 border border-outline-variant/10" />

      {/* Grid Lines intersecting at corners */}
      <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-outline-variant/10 to-transparent" />
      <div className="absolute right-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-outline-variant/10 to-transparent" />
      <div className="absolute top-6 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-outline-variant/10 to-transparent" />
      <div className="absolute bottom-6 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-outline-variant/10 to-transparent" />

      {/* Corner crosshairs */}
      {/* Top Left */}
      <div className="absolute top-[20px] left-[20px] text-[12px] font-light text-primary/40 select-none">+</div>
      {/* Top Right */}
      <div className="absolute top-[20px] right-[24px] text-[12px] font-light text-primary/40 select-none">+</div>
      {/* Bottom Left */}
      <div className="absolute bottom-[28px] left-[20px] text-[12px] font-light text-primary/40 select-none">+</div>
      {/* Bottom Right */}
      <div className="absolute bottom-[28px] right-[24px] text-[12px] font-light text-primary/40 select-none">+</div>

      {/* Top Left Info Panel */}
      <div className="absolute top-8 left-10 flex items-center gap-3 font-label-caps text-[9px] text-on-surface-variant/40 tracking-[0.2em] uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
        <span>ZENITH ARCADE // SYSTEM: ACTIVE</span>
        <span className="text-outline-variant/50">|</span>
        <span>TIME: {time}</span>
      </div>

      {/* Top Right Info Panel */}
      <div className="absolute top-8 right-10 flex items-center gap-3 font-label-caps text-[9px] text-on-surface-variant/40 tracking-[0.2em] uppercase">
        <span>LATENCY: 12ms</span>
        <span className="text-outline-variant/50">|</span>
        <span>BUILD V1.0.9</span>
      </div>

      {/* Bottom Left Dynamic Cursor Coordinates */}
      <div className="absolute bottom-8 left-10 flex items-center gap-4 font-label-caps text-[9px] text-on-surface-variant/40 tracking-[0.2em]">
        <span>CUR: X {coords.x}px Y {coords.y}px</span>
      </div>

      {/* Bottom Right Dynamic Scroll Coordinates */}
      <div className="absolute bottom-8 right-10 flex items-center gap-4 font-label-caps text-[9px] text-on-surface-variant/40 tracking-[0.2em] uppercase">
        <span>SCROLL: {scrollProgress}%</span>
      </div>

      {/* Subtle decorative target squares in the background edges */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2 w-4 h-1 border-x border-b border-outline-variant/20" />
      <div className="absolute left-1/2 bottom-6 -translate-x-1/2 w-4 h-1 border-x border-t border-outline-variant/20" />
      <div className="absolute top-1/2 left-6 -translate-y-1/2 h-4 w-1 border-y border-r border-outline-variant/20" />
      <div className="absolute top-1/2 right-6 -translate-y-1/2 h-4 w-1 border-y border-l border-outline-variant/20" />
    </div>
  );
}
