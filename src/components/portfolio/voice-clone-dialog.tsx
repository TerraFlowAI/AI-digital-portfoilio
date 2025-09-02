
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Bot, Loader2, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { DialogContent } from '@/components/ui/dialog';
import { voiceClone } from '@/ai/flows/voice-clone-flow';
import { textToSpeech } from '@/ai/flows/tts-flow';

type Message = {
    role: 'user' | 'model';
    content: string;
};

export function VoiceCloneDialog() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    { role: 'model', content: "I'm listening. Ask me a question about Shamanth." },
  ]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, []);

  const handleStartListening = async () => {
    if (isListening || isProcessing || isPlaying) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      audioChunks.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        
        // Placeholder for Speech-to-Text.
        // In a real implementation, you would send audioBlob to a speech-to-text API.
        const userQuery = "Tell me about Shamanth's experience."; // Placeholder text.
        setConversation(prev => [...prev, { role: 'user', content: userQuery }]);

        try {
          const history = conversation.map(msg => ({ role: msg.role, content: msg.content }));
          const aiResponse = await voiceClone({ query: userQuery, history });
          setConversation(prev => [...prev, { role: 'model', content: aiResponse.response }]);
          
          const audioResponse = await textToSpeech(aiResponse.response);

          if (audioRef.current) {
            audioRef.current.src = audioResponse.media;
            audioRef.current.play();
            setIsPlaying(true);
          }
        } catch (error) {
            console.error("Error with AI or TTS:", error);
            setConversation(prev => [...prev, { role: 'model', content: "Sorry, I ran into an error." }]);
        } finally {
            setIsProcessing(false);
        }
      };

      recorder.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const handleStopListening = () => {
    if (mediaRecorder && isListening) {
      mediaRecorder.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };
  
  const lastMessage = conversation[conversation.length - 1];

  return (
    <DialogContent className="bg-neutral-950 text-white border-neutral-800 p-0">
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Talk to My Digital Clone
            </h1>
            <p className="mt-2 text-md text-white/70">
              Ask me anything about my work, skills, or experience.
            </p>
          </motion.div>

          <div className="relative mt-8 w-48 h-48 mx-auto">
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
              disabled={isProcessing || isPlaying}
              className="relative w-full h-full rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-2 border-orange-500/50 shadow-[0_0_30px_rgba(255,122,0,0.3)] transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 className="h-20 w-20 animate-spin" />
              ) : isPlaying ? (
                 <Play className="h-20 w-20" />
              ) : (
                <Mic className={`h-20 w-20 transition-transform duration-300 ${isListening ? 'scale-110' : ''}`} />
              )}
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-white/60 min-h-[24px]"
          >
            {isListening && "Listening..."}
            {isProcessing && "Thinking..."}
            {isPlaying && "Speaking..."}
            {!isListening && !isProcessing && !isPlaying && "Tap the orb to start"}
          </motion.div>

          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 min-h-[80px]">
              <div className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                  <p className="text-left text-white/80">
                    {lastMessage.content}
                  </p>
              </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
