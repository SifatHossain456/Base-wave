'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves } from 'lucide-react';

export function IntroAnimation() {
  const [visible, setVisible] = useState(true);
  const [doorsOpen, setDoorsOpen] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDoorsOpen(true), 800);
    const t2 = setTimeout(() => setVisible(false), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
          {/* Left door */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-end pr-6"
            style={{ background: 'linear-gradient(135deg, #030B1A 0%, #071228 60%, #0B1E3D 100%)' }}
            animate={doorsOpen ? { x: '-100%' } : { x: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          >
            <div className="flex flex-col items-end gap-3 opacity-80">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Waves className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="font-bold text-2xl">
                  <span className="text-gradient-blue">Base</span>
                </span>
              </div>
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
            </div>
            {/* Door edge glow */}
            <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/60 to-transparent" />
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-blue-600/10 to-transparent" />
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-start pl-6"
            style={{ background: 'linear-gradient(225deg, #030B1A 0%, #071228 60%, #0B1E3D 100%)' }}
            animate={doorsOpen ? { x: '100%' } : { x: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          >
            <div className="flex flex-col items-start gap-3 opacity-80">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
              <span className="font-bold text-2xl text-white"> Wave</span>
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
            </div>
            {/* Door edge glow */}
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/60 to-transparent" />
            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-cyan-600/10 to-transparent" />
          </motion.div>

          {/* Center flash on open */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,82,255,0.15) 0%, transparent 70%)' }}
            animate={doorsOpen ? { opacity: [0, 1, 0] } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
