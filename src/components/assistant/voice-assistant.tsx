
'use client';

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Bot, X, Loader2, StopCircle } from 'lucide-react';
import { useWindowSize } from 'react-use';
import { saveConversation } from '@/ai/flows/gemini-assistant-flow';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Helper to convert Blob to base64
function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(",")[1]);
            } else {
                reject(new Error("Failed to read audio blob as base64"));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
    });
}

// Gemini Speech-to-Text
async function transcribeAudio(blob: Blob): Promise<string> {
    if (!GEMINI_API_KEY) {
        console.error("Gemini API key not found.");
        return "";
    }
    const base64 = await blobToBase64(blob);
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { "text": "transcribe this audio" },
                    {
                        "inline_data": {
                            "mime_type": "audio/webm",
                            "data": base64
                        }
                    }
                ]
            }],
        }),
    });
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Stream Gemini Chat Reply
async function* streamGeminiReply(prompt: string, history: { role: 'user' | 'model'; content: string }[]) {
    if (!GEMINI_API_KEY) {
        console.error("Gemini API key not found.");
        return;
    }
    const formattedHistory = history.map(turn => ({
        role: turn.role,
        parts: [{ text: turn.content }]
    }));

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [...formattedHistory, { role: 'user', parts: [{ text: prompt }] }],
            }),
        }
    );

    if (!res.body) throw new Error("No response body");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let partialText = "";

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Clean up the streaming response format
        const jsonChunks = chunk.replace(/^data: /gm, '').split('\n').filter(s => s.trim() !== '' && s.startsWith('{'));
        
        for (const jsonChunk of jsonChunks) {
            try {
                 const parsed = JSON.parse(jsonChunk);
                 const newText = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
                 if (newText) {
                     partialText += newText;
                     yield partialText;
                 }
            } catch (error) {
                console.error("Error parsing streaming JSON:", error, "Chunk:", jsonChunk);
            }
        }
    }
}

// Stream TTS
async function playStreamingTTS(textStream: AsyncGenerator<string | undefined, void, unknown>, onPlaybackStart: () => void, onPlaybackEnd: () => void) {
    if (!GEMINI_API_KEY) {
        console.error("Gemini API key not found.");
        onPlaybackEnd();
        return;
    }
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let isPlaying = false;
    let audioQueue: AudioBuffer[] = [];
    let spokenText = "";
    let streamFinished = false;

    onPlaybackStart();

    const processQueue = () => {
        if (audioQueue.length === 0) {
            if (streamFinished) {
                 onPlaybackEnd();
            }
            return;
        }
        if (isPlaying) return;

        isPlaying = true;
        const buffer = audioQueue.shift();
        if (!buffer) return;

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.onended = () => {
            isPlaying = false;
            processQueue();
        };
        source.start();
    };

    (async () => {
        for await (const partial of textStream) {
            if (typeof partial !== 'string') continue;
            const newText = partial.replace(spokenText, "").trim();
            if (!newText) continue;
            spokenText = partial;
            
            try {
                const ttsRes = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GEMINI_API_KEY}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        input: { text: newText },
                        voice: { languageCode: "en-IN", name: "en-IN-Wavenet-D" }, // Indian Male Voice
                        audioConfig: { audioEncoding: "MP3", speakingRate: 1.1 },
                    }),
                });

                const ttsData = await ttsRes.json();
                if (ttsData.audioContent) {
                    const audioData = Uint8Array.from(atob(ttsData.audioContent), (c) => c.charCodeAt(0));
                    const decodedBuffer = await audioContext.decodeAudioData(audioData.buffer);
                    audioQueue.push(decodedBuffer);
                    if (!isPlaying) {
                        processQueue();
                    }
                }
            } catch(e) {
                console.error("Error fetching or decoding TTS audio:", e);
            }
        }
        streamFinished = true;
        if (!isPlaying) processQueue();
    })();
}

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
    const [isProcessing, setIsProcessing] = useState(false); // For STT and thinking
    const [isPlaying, setIsPlaying] = useState(false); // For TTS playback
    const [userInput, setUserInput] = useState("");
    const [assistantReply, setAssistantReply] = useState("");
    const [history, setHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
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

        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];
        
        recorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
        
        recorder.onstop = async () => {
            setIsProcessing(true);
            setAssistantReply("");
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            try {
                const transcript = await transcribeAudio(audioBlob);
                if (transcript) {
                    await handleUserInput(transcript, "voice");
                } else {
                    setAssistantReply("Sorry, I couldn't understand what you said.");
                }
            } catch (error) {
                console.error("Error during transcription:", error);
                setAssistantReply("Sorry, there was an error during transcription.");
            } finally {
                 setIsProcessing(false);
            }
        };

        recorder.start();
        setIsRecording(true);
        animationFrameRef.current = requestAnimationFrame(measureAmplitude);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
         if(animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            setAmplitude(0);
        }
    };

    const handleUserInput = async (input: string, mode: "voice" | "text") => {
        if (!input.trim()) return;

        const newUserHistory = [...history, { role: 'user' as const, content: input }];
        setHistory(newUserHistory);
        setUserInput("");
        setIsProcessing(true);
        setAssistantReply("");
        
        try {
            const textStream = streamGeminiReply(input, history);
            
            playStreamingTTS(textStream, 
                () => setIsPlaying(true), 
                () => setIsPlaying(false)
            );

            let finalReply = "";
            // Re-create the async generator to consume it for text display
            const displayTextStream = streamGeminiReply(input, history);
            for await (const partial of displayTextStream) {
                if (partial) {
                    setAssistantReply(partial);
                    finalReply = partial;
                }
            }

            setHistory(prev => [...prev, { role: 'model' as const, content: finalReply }]);
            await saveConversation({ query: input, response: finalReply });

        } catch (error) {
            console.error("Error streaming reply:", error);
            setAssistantReply("Sorry, I encountered an error.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    const orbSize = 64;

    const orbVariants = {
        initial: { width: orbSize, height: orbSize, borderRadius: '50%', bottom: '1.5rem', right: '1.5rem', x: 0 },
        expanded: { width: width > 420 ? '400px' : '90vw', height: 'auto', borderRadius: '24px', bottom: '1.5rem', right: '50%', x: '50%' },
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
                                {isProcessing && !assistantReply && (
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Loader2 className="animate-spin h-4 w-4" />
                                        <span>Thinking...</span>
                                    </div>
                                )}
                                <p>{assistantReply}</p>
                            </div>

                            <div className="flex items-center gap-2 w-full mt-2">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUserInput(userInput, 'text')}
                                    placeholder={isRecording ? "Listening..." : "Ask or type anything..."}
                                    className="flex-1 text-sm bg-transparent text-white placeholder:text-white/50 outline-none border-b border-white/20 focus:border-orange-400 transition-colors py-1"
                                    disabled={isRecording || isProcessing || isPlaying}
                                />
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 text-white/80 hover:bg-white/30'}`}
                                    disabled={isProcessing || isPlaying}
                                >
                                    {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                                </button>
                                <button onClick={() => handleUserInput(userInput, 'text')} disabled={!userInput || isRecording || isProcessing || isPlaying} className="p-2 rounded-full bg-white/20 text-white/80 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed">
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

    