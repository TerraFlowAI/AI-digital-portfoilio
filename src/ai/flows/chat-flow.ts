
'use server';
/**
 * @fileOverview A server-side flow to handle chat interactions with Gemini,
 * including generating a text reply and a corresponding audio speech file.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import fetch from 'node-fetch';

const ChatInputSchema = z.object({
  prompt: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional(),
});

const ChatOutputSchema = z.object({
  reply: z.string(),
  audioBase64: z.string().optional(),
});

// This is the main function that will be called from the client
export async function chat(input: z.infer<typeof ChatInputSchema>): Promise<z.infer<typeof ChatOutputSchema>> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ prompt, history }) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    
    // 1. Get chat reply from Gemini
    const formattedHistory = history?.map(turn => ({
        role: turn.role,
        parts: [{ text: turn.content }]
    })) || [];

    const chatUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const chatRes = await fetch(chatUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [...formattedHistory, { role: 'user', parts: [{ text: prompt }] }] }),
    });

    if (!chatRes.ok) {
        console.error("Gemini Chat API error:", await chatRes.text());
        throw new Error("Failed to get chat reply from Gemini.");
    }

    const chatJson: any = await chatRes.json();
    const replyText = chatJson?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a reply.";

    // 2. Get TTS audio from Google
    const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GEMINI_API_KEY}`;
    const ttsRes = await fetch(ttsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            input: { text: replyText },
            voice: { languageCode: "en-IN", name: "en-IN-Wavenet-D" },
            audioConfig: { audioEncoding: "MP3" },
        }),
    });

    if (!ttsRes.ok) {
        console.error("Google TTS API error:", await ttsRes.text());
        // Don't throw, just return text reply
        return { reply: replyText };
    }
    
    const ttsJson: any = await ttsRes.json();
    const audioBase64 = ttsJson?.audioContent;

    return {
      reply: replyText,
      audioBase64,
    };
  }
);
