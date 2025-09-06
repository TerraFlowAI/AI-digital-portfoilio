
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
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      recognitionRef.current?.abort();
    }
  }, []);

  const setupMicrophone = async () => {
    if (audioContextRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
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
      // You might want to show a toast or message to the user here
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
      setIsListening(false);
      return;
    }

    await setupMicrophone();
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }
    
    setIsListening(true);
    setTranscript("");

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false; // Set to false to end after a pause

    let finalTranscript = '';
    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(interimTranscript || finalTranscript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAmplitude(0);
      if (finalTranscript.trim()) {
        handleSend(finalTranscript.trim());
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
       if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAmplitude(0);
    };

    recognition.start();
    recognitionRef.current = recognition;
    if (audioContextRef.current) {
      animationFrameRef.current = requestAnimationFrame(measureAmplitude);
    }
  };

  const handleSend = async (query?: string) => {
    const currentQuery = query || transcript;
    if (!currentQuery.trim() || isProcessing) return;
  
    setIsProcessing(true);
    setTranscript("");
  
    const newHistoryEntry = { role: 'user' as const, content: currentQuery };
    const currentHistory = [...history, newHistoryEntry];
    setHistory(currentHistory);
  
    try {
      const aiResponse = await voiceClone({ query: currentQuery, history: currentHistory });
      const assistantReply = aiResponse.response;
      setLastAssistantReply(assistantReply);
      
      const updatedHistoryWithResponse = [...currentHistory, { role: 'model' as const, content: assistantReply }];
      setHistory(updatedHistoryWithResponse);
  
      const audioResponse = await textToSpeech(assistantReply);
      if (audioRef.current && audioResponse.media) {
        audioRef.current.src = audioResponse.media;
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      }
    } catch (error) {
      console.error("Error with AI or TTS:", error);
      const errorMessage = "Sorry, I had trouble responding.";
      setLastAssistantReply(errorMessage);
      setHistory(prev => [...prev, {role: 'model', content: errorMessage}]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const orbSize = 64;

  const orbVariants = {
    initial: { 
      width: orbSize, 
      height: orbSize, 
      borderRadius: '50%',
      bottom: '1.5rem', 
      right: '1.5rem',
      x: 0,
    },
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
        className="fixed z-50 cursor-pointer"
        layout
        variants={orbVariants}
        initial="initial"
        animate={isExpanded ? 'expanded' : 'initial'}
        transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
        style={{
           backdropFilter: 'blur(16px)',
           WebkitBackdropFilter: 'blur(16px)',
           backgroundColor: 'rgba(23, 23, 23, 0.5)', // neutral-900 with 50% opacity
           border: '1px solid rgba(255, 255, 255, 0.1)',
           boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        <motion.div layout className="p-4 w-full h-full flex flex-col">
          {!isExpanded ? (
            <div onClick={() => setIsExpanded(true)} className="w-full h-full flex items-center justify-center">
               <AnimatePresence>
                {(isListening || isPlaying) && (
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
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center gap-2">
                    <Bot className="text-orange-400 h-5 w-5" />
                    <span className="text-white font-medium">AI Assistant</span>
                </div>
                <button onClick={() => setIsExpanded(false)} className="text-white/70 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="my-2 text-white/90 min-h-[40px] flex items-center justify-start text-sm">
                 {isProcessing ? (
                     <div className="flex items-center gap-2 text-white/70">
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span>Thinking...</span>
                     </div>
                 ) : isPlaying ? (
                     <span className="text-white/70">Speaking...</span>
                 ) : (
                    <p>{lastAssistantReply}</p>
                 )}
              </div>

              <div className="flex items-center gap-2 w-full mt-2">
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? "Listening..." : "Ask or type anything..."}
                  className="flex-1 text-sm bg-transparent text-white placeholder:text-white/50 outline-none border-b border-white/20 focus:border-orange-400 transition-colors py-1"
                  disabled={isListening}
                />
                <button 
                  onClick={handleListen} 
                  className={`p-2 rounded-full transition-colors ${isListening ? 'bg-orange-500 text-white animate-pulse' : 'bg-white/20 text-white/80 hover:bg-white/30'}`}
                >
                  <Mic size={20} />
                </button>
                <button onClick={() => handleSend()} disabled={!transcript || isProcessing} className="p-2 rounded-full bg-white/20 text-white/80 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed">
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
