import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function UnseenCursor() {
  const cursorRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [cursorType, setCursorType] = useState('default'); // 'default', 'hover', 'text', 'hidden'
  const [isClicked, setIsClicked] = useState(false);

  // Position of mouse
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for lagging cursor effect
  const springConfig = { stiffness: 350, damping: 28, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseLeave = () => {
      setCursorType('hidden');
    };

    const handleMouseEnter = () => {
      setCursorType('default');
    };

    // Event delegation for custom cursor text & types
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const text = target.getAttribute('data-cursor');
        if (text === 'pointer') {
          setCursorType('hover');
        } else if (text) {
          setCursorText(text);
          setCursorType('text');
        }
      } else {
        // Also check if it's a standard link or button to get the general hover effect
        const interactive = e.target.closest('a, button, [role="button"], input[type="submit"]');
        if (interactive) {
          setCursorType('hover');
        } else {
          setCursorType('default');
        }
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorText('');
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Hide original cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.body.style.cursor = 'auto';
    };
  }, [mouseX, mouseY]);

  const location = window.location.pathname;
  const isLandingPage = location === '/';

  // Determine variants for cursor sizing and styling
  const cursorVariants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: 'rgba(182, 196, 255, 1)',
      border: '1px solid rgba(182, 196, 255, 1)',
      boxShadow: '0 0 10px rgba(182, 196, 255, 0.4)',
    },
    hover: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(182, 196, 255, 0.1)',
      border: '1px solid rgba(182, 196, 255, 0.8)',
      boxShadow: '0 0 20px rgba(182, 196, 255, 0.2)',
    },
    text: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(182, 196, 255, 0.15)',
      border: '1px solid rgba(182, 196, 255, 1)',
      boxShadow: '0 0 30px rgba(182, 196, 255, 0.3)',
      mixBlendMode: 'normal',
    },
    hidden: {
      width: 0,
      height: 0,
      opacity: 0,
    }
  };

  return (
    <>
      {/* Outer Spring Follower - ONLY ON LANDING PAGE */}
      {isLandingPage && (
        <motion.div
          ref={cursorRef}
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden backdrop-blur-[2px]"
          style={{
            x: cursorX,
            y: cursorY,
          }}
          animate={cursorType}
          variants={cursorVariants}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 28,
          }}
        >
          {cursorType === 'text' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="text-[10px] tracking-[0.2em] font-label-caps text-primary uppercase font-bold text-center select-none"
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      )}

      {/* Tiny inner center dot for precision */}
      {cursorType !== 'hidden' && (
        <motion.div
          className="fixed top-0 left-0 w-[6px] h-[6px] bg-white rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
          style={{
            x: mouseX,
            y: mouseY,
          }}
          animate={{
            scale: isClicked ? 2 : 1,
            backgroundColor: cursorType === 'text' || cursorType === 'hover' ? '#b6c4ff' : '#ffffff',
          }}
        />
      )}
    </>
  );
}
