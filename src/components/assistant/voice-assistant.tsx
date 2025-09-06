
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Bot, X, Loader2, StopCircle } from 'lucide-react';
import { geminiAssistant } from '@/ai/flows/gemini-assistant-flow';
import { useWindowSize } from 'react-use';

// Simple Waveform Component
const Waveform = ({ amplitude }: { amplitude: number }) => {
  const height = 64;
  const width = 64;
  const bars = 5;

  return (
    <div className="flex items-center justify-center w-full h-full gap-1">
      {Array.from({ length: bars }).map((_, i) => {
        const barHeight = Math.max(2, (amplitude / 255) * height * (Math.sin(i / 1.5 + Date.now()/200) * 0.5 + 0.5) * 2);
        return (
          <motion.div
            key={i}
            className="w-1.5 bg-orange-400 rounded-full"
            style={{ height: `${barHeight}px` }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        );
      })}
    </div>
  );
};


export function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [history, setHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [lastAssistantReply, setLastAssistantReply] = useState("Hello! How can I help you today?");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { width } = useWindowSize();

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
      mediaRecorderRef.current?.stop();
    }
  }, []);

  const setupMicrophone = async () => {
     if (!navigator.mediaDevices?.getUserMedia) {
        console.error("Media devices not supported");
        // You should show a user-facing error message here
        return;
    }
    if (audioContextRef.current?.state === 'running') return;
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
    }
  };

  const measureAmplitude = () => {
    if (analyserRef.current && dataArrayRef.current && isRecording) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const avg = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
      setAmplitude(avg);
      animationFrameRef.current = requestAnimationFrame(measureAmplitude);
    }
  };

  const startRecording = async () => {
    await setupMicrophone();
    if (!audioContextRef.current || audioContextRef.current.state === 'suspended') {
      await audioContextRef.current?.resume();
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      handleSend(audioBlob);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    animationFrameRef.current = requestAnimationFrame(measureAmplitude);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if(animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        setAmplitude(0);
    }
  };

  const handleSend = async (audioBlob?: Blob, textQuery?: string) => {
    if ((!audioBlob && !textQuery) || isProcessing) return;

    setIsProcessing(true);
    let userQuery = textQuery || '';
    
    // Add user text input to history immediately
    if(textQuery) {
        setHistory(prev => [...prev, {role: 'user', content: textQuery}]);
        setTranscript('');
    }

    try {
      let audioBase64: string | undefined = undefined;
      if (audioBlob) {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        audioBase64 = await new Promise(resolve => {
            reader.onloadend = () => {
                resolve((reader.result as string).split(',')[1]);
            };
        });
      }

      const response = await geminiAssistant({
        audio: audioBase64,
        query: userQuery,
        history,
      });

      if (response.transcript && !textQuery) {
        userQuery = response.transcript;
        setHistory(prev => [...prev, {role: 'user', content: response.transcript}]);
      }
      
      setLastAssistantReply(response.reply);
      setHistory(prev => [...prev, {role: 'model', content: response.reply}]);

      if (audioRef.current && response.audioReply) {
        audioRef.current.src = response.audioReply;
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      }

    } catch (error) {
      console.error("Error with AI Assistant:", error);
      const errorMessage = "Sorry, I had trouble responding.";
      setLastAssistantReply(errorMessage);
      setHistory(prev => [...prev, {role: 'model', content: errorMessage}]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSend = () => {
      if(transcript.trim()) {
          handleSend(undefined, transcript.trim());
      }
  }
  
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
      width: width > 420 ? '400px' : '90vw', 
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
           backgroundColor: 'rgba(23, 23, 23, 0.5)',
           border: '1px solid rgba(255, 255, 255, 0.1)',
           boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        <motion.div layout className="p-4 w-full h-full flex flex-col">
          {!isExpanded ? (
            <div onClick={() => setIsExpanded(true)} className="w-full h-full flex items-center justify-center">
               <AnimatePresence>
                {(isRecording || isPlaying) && (
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
                  onKeyDown={(e) => e.key === 'Enter' && handleTextSend()}
                  placeholder={isRecording ? "Listening..." : "Ask or type anything..."}
                  className="flex-1 text-sm bg-transparent text-white placeholder:text-white/50 outline-none border-b border-white/20 focus:border-orange-400 transition-colors py-1"
                  disabled={isRecording}
                />
                <button 
                  onClick={isRecording ? stopRecording : startRecording} 
                  className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 text-white/80 hover:bg-white/30'}`}
                >
                  {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                </button>
                <button onClick={handleTextSend} disabled={!transcript || isProcessing} className="p-2 rounded-full bg-white/20 text-white/80 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed">
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
