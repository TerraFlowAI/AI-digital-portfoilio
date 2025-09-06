'use client';

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Loader2, Mic, StopCircle, X } from 'lucide-react';
import { useWindowSize } from 'react-use';
import { geminiAssistant } from "@/ai/client-flows";

const Waveform = ({ amplitude }: { amplitude: number }) => {
    const height = 64;
    const width = 64;
    const bars = 7;
  
    return (
      <div className="flex items-center justify-center w-full h-full gap-1">
        {Array.from({ length: bars }).map((_, i) => {
          const barHeight = Math.max(2, (amplitude / 255) * height * (Math.sin(i/2 + Date.now()/150) * 0.5 + 0.5) * 2);
          return (
            <motion.div
              key={i}
              className="w-1 bg-orange-400 rounded-full"
              style={{ height: `${barHeight}px` }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          );
        })}
      </div>
    );
};

export function VoiceAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [assistantReply, setAssistantReply] = useState("");
  const [amplitude, setAmplitude] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { width } = useWindowSize();

   useEffect(() => {
      return () => {
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
          mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
      }
  }, []);

  const setupMicrophone = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
          console.error("Media devices not supported");
          setAssistantReply("Sorry, your browser doesn't support microphone access.");
          return null;
      }
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
           if (!audioContextRef.current) {
              const context = new (window.AudioContext || (window as any).webkitAudioContext)();
              audioContextRef.current = context;
              const source = context.createMediaStreamSource(stream);
              const analyser = context.createAnalyser();
              analyser.fftSize = 32;
              dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
              source.connect(analyser);
              analyserRef.current = analyser;
           }
           return stream;
      } catch (error) {
          console.error("Microphone access denied:", error);
          setAssistantReply("Microphone access is required. Please enable it in your browser settings.");
          return null;
      }
  };

  const measureAmplitude = () => {
      if (analyserRef.current && dataArrayRef.current && isRecording) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const avg = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
        setAmplitude(avg * 2);
        animationFrameRef.current = requestAnimationFrame(measureAmplitude);
      }
  };
  
  const startRecording = async () => {
      const stream = await setupMicrophone();
      if (!stream) return;

      if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
      }

      const options = { mimeType: 'audio/webm;codecs=opus' };
      let recorder: MediaRecorder;
      try {
          recorder = new MediaRecorder(stream, options);
      } catch (err) {
          console.error("Error creating MediaRecorder:", err);
          setAssistantReply("Sorry, an error occurred with the microphone.");
          return;
      }

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
      };
      
      recorder.onstop = async () => {
          setIsProcessing(true);
          setAssistantReply("Thinking...");

          const audioBlob = new Blob(audioChunksRef.current, { type: options.mimeType });
          
          try {
              const base64 = await blobToBase64(audioBlob);
              const { reply, audioBase64 } = await geminiAssistant({audioBase64: base64, mimeType: options.mimeType});
              
              setAssistantReply(reply);

              if (audioBase64) {
                  setIsPlaying(true);
                  const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
                  audio.play();
                  audio.onended = () => setIsPlaying(false);
              }

          } catch (error) {
              console.error("Error during assistant interaction:", error);
              setAssistantReply("Sorry, there was an error processing your request.");
          } finally {
              setIsProcessing(false);
          }
      };

      recorder.start();
      setIsRecording(true);
      setAssistantReply("Listening...")
      animationFrameRef.current = requestAnimationFrame(measureAmplitude);
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
          // Stop the tracks on the stream to turn off the mic indicator
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
       if(animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          setAmplitude(0);
      }
  };

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to read audio blob as base64"));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
    });
  }
  
  const orbSize = 64;

  const orbVariants = {
      initial: { width: orbSize, height: orbSize, borderRadius: '50%', bottom: '1.5rem', right: '1.5rem', x: 0 },
      expanded: { width: width > 420 ? '400px' : '90vw', height: 'auto', borderRadius: '24px', bottom: '1.5rem', right: '50%', x: '50%' },
  };

  const currentStatus = isRecording ? "Listening..." : isProcessing ? "Thinking..." : isPlaying ? "Speaking..." : assistantReply;


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
                              {(isRecording || isPlaying || isProcessing) && (
                                  <motion.div
                                      className="absolute inset-0 rounded-full bg-orange-500/30"
                                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
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
                               {isProcessing && (
                                  <div className="flex items-center gap-2 text-white/70">
                                      <Loader2 className="animate-spin h-4 w-4" />
                                  </div>
                              )}
                              <p className="ml-2">{currentStatus}</p>
                          </div>

                          <div className="flex items-center gap-2 w-full mt-2">
                              <button
                                  onClick={isRecording ? stopRecording : startRecording}
                                  className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 text-white/80 hover:bg-white/30'}`}
                                  disabled={isProcessing || isPlaying}
                              >
                                  {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                              </button>
                          </div>
                      </>
                  )}
              </motion.div>
          </motion.div>
      </AnimatePresence>
  );
}
