import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function AmbientSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const filterRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Initialize Audio Context and Synthesizer nodes
  const startSynth = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Ethereal cinematic drone (A minor / cyberpunk anime style)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110.00, ctx.currentTime); // A2 note
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3 note (perfect fifth)
      
      // Add slight detune for widening
      osc2.detune.setValueAtTime(5, ctx.currentTime);

      // Lowpass filter for a smooth, warm pad sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.Q.setValueAtTime(2, ctx.currentTime);

      // Low-Frequency Oscillator (LFO) to modulate filter frequency (breathing effect)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.05, ctx.currentTime); // Very slow: 20 seconds cycle
      lfoGain.gain.setValueAtTime(150, ctx.currentTime); // Modulate by 150Hz up/down
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Master gain
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 4.0); // Smooth fade-in over 4 seconds, audible volume

      // Connections
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Start sound nodes
      osc1.start();
      osc2.start();
      lfo.start();

      // Store references
      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      filterRef.current = filter;
      gainNodeRef.current = gainNode;

      setIsPlaying(true);
      
      // Store in window for global access to trigger hover sound effects
      window.__audioCtx = ctx;
    } catch (e) {
      console.warn('Web Audio API not supported in this browser', e);
    }
  };

  const stopSynth = () => {
    const gainNode = gainNodeRef.current;
    const ctx = audioCtxRef.current;

    if (gainNode && ctx) {
      // Smooth fade-out over 1s to prevent audio pop
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);

      setTimeout(() => {
        try {
          if (osc1Ref.current) osc1Ref.current.stop();
          if (osc2Ref.current) osc2Ref.current.stop();
          if (ctx.state !== 'closed') ctx.close();
        } catch (e) {
          // already closed
        }
        osc1Ref.current = null;
        osc2Ref.current = null;
        gainNodeRef.current = null;
        audioCtxRef.current = null;
        window.__audioCtx = null;
        setIsPlaying(false);
      }, 1100);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSynth();
    } else {
      startSynth();
    }
  };

  // Setup click and hover sound listeners dynamically for elements
  useEffect(() => {
    const playTickSound = (type = 'hover') => {
      const ctx = window.__audioCtx;
      if (!ctx || ctx.state === 'suspended') return;

      try {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        if (type === 'hover') {
          // Clean futuristic UI blip
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2400, ctx.currentTime); // High pitch crisp
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.06);
        } else if (type === 'click') {
          // Sharp UI confirmation tone
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1200, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.11);
        }
      } catch (e) {
        // audio fail-safe
      }
    };

    const handleHover = (e) => {
      if (e.target && typeof e.target.closest === 'function') {
        const isInteractive = e.target.closest('a, button, [role="button"], [data-cursor]');
        if (isInteractive) {
          playTickSound('hover');
        }
      }
    };

    const handleClick = (e) => {
      if (e.target && typeof e.target.closest === 'function') {
        const isInteractive = e.target.closest('a, button, [role="button"], [data-cursor]');
        if (isInteractive) {
          playTickSound('click');
        }
      }
    };

    document.addEventListener('mouseenter', handleHover, true);
    document.addEventListener('mousedown', handleClick, true);

    return () => {
      document.removeEventListener('mouseenter', handleHover, true);
      document.removeEventListener('mousedown', handleClick, true);
      // clean up synthesizer on unmount
      if (osc1Ref.current) {
        try {
          osc1Ref.current.stop();
          osc2Ref.current.stop();
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div 
      className="fixed bottom-[32px] left-[32px] z-[9995] flex items-center gap-3 bg-surface-container-low/40 border border-outline-variant/10 px-4 py-2.5 rounded-full backdrop-blur-md cursor-pointer pointer-events-auto hover:border-primary/40 hover:bg-surface-container-low/80 transition-all select-none"
      onClick={toggleSound}
      data-cursor="sound"
    >
      <div className="flex items-end gap-[3px] h-[12px] w-[18px]">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-[2px] bg-primary rounded-full"
            style={{ originY: 1 }}
            animate={{
              height: isPlaying ? [4, 12, 6, 12, 4][i % 5] : 4
            }}
            transition={{
              repeat: Infinity,
              duration: 0.8 + i * 0.15,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
      <span className="font-label-caps text-[9px] tracking-[0.2em] text-on-surface-variant/75 uppercase select-none">
        {isPlaying ? 'AUDIO ON' : 'AUDIO OFF'}
      </span>
    </div>
  );
}
