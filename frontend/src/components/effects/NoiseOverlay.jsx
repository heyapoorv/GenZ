import { useEffect } from 'react';

export default function NoiseOverlay() {
  useEffect(() => {
    // Inject the noise styles dynamically
    const styleId = 'noise-overlay-style';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes unseen-noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(-2%, 1%); }
          30% { transform: translate(1%, -2%); }
          40% { transform: translate(-1%, 3%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(2%, 2%); }
          70% { transform: translate(3%, -2%); }
          80% { transform: translate(-2%, 3%); }
          90% { transform: translate(1%, -3%); }
        }
        .unseen-noise-layer {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E");
          animation: unseen-noise 0.2s steps(4) infinite;
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      // Keep it global or cleanup, usually okay to let it persist
    };
  }, []);

  return (
    <div className="fixed inset-[-150%] w-[300%] h-[300%] pointer-events-none z-[9990] unseen-noise-layer opacity-[0.06] mix-blend-overlay" />
  );
}
