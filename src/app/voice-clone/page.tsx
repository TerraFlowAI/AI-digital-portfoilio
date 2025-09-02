
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VoiceClonePage() {
  const [isListening, setIsListening] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4">
      <div className="w-full max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Talk to My Digital Clone
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Ask me anything about my work, skills, or experience.
          </p>
        </motion.div>

        <div className="relative mt-12 w-64 h-64 mx-auto">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-orange-500/30"
            animate={{
              scale: isListening ? [1, 1.1, 1] : 1,
              opacity: isListening ? [0.5, 1, 0.5] : 0.3,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          ></motion.div>
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-orange-500/40"
            animate={{
              scale: isListening ? [1, 1.05, 1] : 1,
              opacity: isListening ? [0.6, 1, 0.6] : 0.4,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          ></motion.div>
          <Button
            onClick={toggleListening}
            className="relative w-full h-full rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-2 border-orange-500/50 shadow-[0_0_30px_rgba(255,122,0,0.3)] transition-all duration-300"
          >
            <Mic className={`h-24 w-24 transition-transform duration-300 ${isListening ? 'scale-110' : ''}`} />
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-white/60"
        >
          {isListening ? "Listening..." : "Tap the orb to start"}
        </motion.div>

        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 min-h-[100px]">
            <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 text-orange-400 mt-1" />
                <p className="text-left text-white/80">I'm listening. Ask me a question about Shamanth.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
