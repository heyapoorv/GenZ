import { motion } from 'framer-motion';

export default function TextReveal({ text, className = "", delay = 0, variant = "words" }) {
  const words = text.split(" ");

  // Container variants that stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: variant === "chars" ? 0.02 : 0.08, 
        delayChildren: delay 
      }
    }
  };

  // Child variants for individual words
  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: "100%",
      rotateX: 20
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.610, 0.355, 1.000] // Cubic Bezier easeOutCubic
      }
    }
  };

  // Child variants for individual characters
  const charVariants = {
    hidden: {
      opacity: 0,
      y: 15
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.215, 0.610, 0.355, 1.000]
      }
    }
  };

  if (variant === "chars") {
    return (
      <motion.span
        className={`inline-flex flex-wrap overflow-hidden select-none ${className}`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split("").map((char, charIdx) => (
              <motion.span
                key={charIdx}
                className="inline-block origin-bottom"
                variants={charVariants}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    );
  }

  return (
    <motion.span
      className={`inline-flex flex-wrap overflow-hidden select-none ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden py-1.5 mr-[0.25em]">
          <motion.span
            className="inline-block origin-bottom-left"
            variants={wordVariants}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
