"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const [shapes, setShapes] = useState<Array<{
    width: number;
    height: number;
    left: string;
    top: string;
  }>>([]);

  useEffect(() => {
    const newShapes = Array(10).fill(null).map(() => ({
      width: Math.random() * 200 + 50,
      height: Math.random() * 200 + 50,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setShapes(newShapes);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute bg-emerald-500/5 backdrop-blur-3xl"
          style={{
            width: shape.width,
            height: shape.height,
            borderRadius: '25%',
            left: shape.left,
            top: shape.top,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25],
            y: [0, Math.random() * 50 - 25],
            rotate: [0, Math.random() * 180],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;

