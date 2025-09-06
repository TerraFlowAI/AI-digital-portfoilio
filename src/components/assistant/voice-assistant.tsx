
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Bot, X, Loader2 } from 'lucide-react';
import { voiceClone } from '@/ai/flows/voice-clone-flow';
import { textToSpeech } from '@/ai/flows/tts-flow';
import type { VoiceCloneInput } from '@/ai/types';

// Simple Waveform Component
const Waveform = ({ amplitude }: { amplitude: number }) => {
  const height = 64;
  const width = 64;
  const bars = 5;

  return (
    <div className="flex items-center justify-center w-full h-full gap-1">
      {Array.from({ length: bars }).map((_, i) => {
        const barHeight = Math.max(2, (amplitude / 255) * height * (Math.sin(i / 1.5) * 0.5 + 0.5) * 2);
        return (
          <motion.div
            key={i}
            className="w-1.5 bg-orange-400 rounded-full"
            animate={{ height: `${barHeight}px` }}
            transition={{ duration: 0.1 }}
          />
        );
      })}
    </div>
  );
};


export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [history, setHistory] = useState<VoiceCloneInput['history']>([]);
  const [lastAssistantReply, setLastAssistantReply] = useState("Hello! How can I help you today?");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, []);

  const setupMicrophone = async () => {
    if (!audioContextRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const context = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = context;
        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 32;
        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        source.connect(analyser);
        analyserRef.current = analyser;
      } catch (error) {
        console.error("Microphone access denied:", error);
      }
    }
  };

  const measureAmplitude = () => {
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const avg = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
      setAmplitude(avg);
      animationFrameRef.current = requestAnimationFrame(measureAmplitude);
    }
  };

  const handleListen = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    await setupMicrophone();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }
    
    setIsListening(true);
    setTranscript("");

    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        setAmplitude(0);
      }
       if (recognitionRef.current?.finalTranscript) {
        handleSend(recognitionRef.current.finalTranscript);
      }
      recognitionRef.current = null;
    };
    
     recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        setAmplitude(0);
      }
    };

    recognition.start();
    (recognition as any).finalTranscript = '';
    recognition.addEventListener('result', (e) => {
      (recognition as any).finalTranscript = Array.from(e.results).map(r => r[0].transcript).join('');
    });
    
    recognitionRef.current = recognition as any;
    animationFrameRef.current = requestAnimationFrame(measureAmplitude);
  };

  const handleSend = async (query?: string) => {
    const currentQuery = query || transcript;
    if (!currentQuery) return;

    setIsProcessing(true);
    setTranscript("");
    
    const newHistory: VoiceCloneInput['history'] = [...(history ?? []), { role: 'user', content: currentQuery }];
    setHistory(newHistory);

    try {
      const aiResponse = await voiceClone({ query: currentQuery, history: newHistory });
      setLastAssistantReply(aiResponse.response);
      setHistory([...newHistory, { role: 'model', content: aiResponse.response }]);

      const audioResponse = await textToSpeech(aiResponse.response);
      if (audioRef.current && audioResponse.media) {
        audioRef.current.src = audioResponse.media;
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error with AI or TTS:", error);
      setLastAssistantReply("Sorry, I had trouble responding.");
    } finally {
      setIsProcessing(false);
    }
  };

  const orbSize = 64;

  const orbVariants = {
    initial: { width: orbSize, height: orbSize, borderRadius: '50%' },
    expanded: { 
      width: 'min(400px, 90vw)', 
      height: 'auto', 
      borderRadius: '24px', 
      bottom: '1.5rem', 
      right: '50%',
      x: '50%',
    },
  };
  
  return (
    <AnimatePresence>
      <motion.div
        drag={!isExpanded}
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        dragMomentum={false}
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        layout
        variants={orbVariants}
        initial="initial"
        animate={isExpanded ? 'expanded' : 'initial'}
        transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
        style={{
           backdropFilter: 'blur(16px)',
           WebkitBackdropFilter: 'blur(16px)',
           backgroundColor: 'rgba(255, 255, 255, 0.1)',
           border: '1px solid rgba(255, 255, 255, 0.2)',
           boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        <motion.div layout className="p-4 w-full h-full flex flex-col">
          {!isExpanded ? (
            <div onClick={() => setIsExpanded(true)} className="w-full h-full flex items-center justify-center">
               <AnimatePresence>
                {isListening && (
                    <motion.div 
                        className="absolute inset-0 rounded-full bg-orange-500/30"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5]}}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                )}
               </AnimatePresence>
              <Waveform amplitude={amplitude} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <Bot className="text-orange-400 h-5 w-5" />
                    <span className="text-white font-medium">AI Assistant</span>
                </div>
                <button onClick={() => setIsExpanded(false)} className="text-white/70 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="my-4 text-white/90 min-h-[40px] flex items-center">
                 {isProcessing ? (
                     <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4 text-white/70" />
                        <span className="text-sm text-white/70">Thinking...</span>
                     </div>
                 ) : isPlaying ? (
                     <span className="text-sm text-white/70">Speaking...</span>
                 ) : (
                    <p>{lastAssistantReply}</p>
                 )}
              </div>

              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask or type anything..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none border-b border-white/20 focus:border-orange-400 transition-colors"
                />
                <button 
                  onClick={handleListen} 
                  className={`p-2 rounded-full transition-colors ${isListening ? 'bg-orange-500 text-white' : 'bg-white/20 text-white/80 hover:bg-white/30'}`}
                >
                  <Mic size={20} />
                </button>
                <button onClick={() => handleSend()} disabled={!transcript || isProcessing} className="p-2 rounded-full bg-white/20 text-white/80 hover:bg-white/30 disabled:opacity-50">
                  <Send size={20} />
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
    
