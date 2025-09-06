
'use server';
/**
 * @fileOverview A server-side flow to handle audio transcription using Google's Speech-to-Text API.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import fetch from 'node-fetch';

const TranscribeInputSchema = z.object({
  audioBase64: z.string(),
  mimeType: z.string(),
});

const TranscribeOutputSchema = z.string();


// This is the main function that will be called from the client
export async function transcribe(input: z.infer<typeof TranscribeInputSchema>): Promise<z.infer<typeof TranscribeOutputSchema>> {
  return transcribeFlow(input);
}

const transcribeFlow = ai.defineFlow(
  {
    name: 'transcribeFlow',
    inputSchema: TranscribeInputSchema,
    outputSchema: TranscribeOutputSchema,
  },
  async ({ audioBase64, mimeType }) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }
    
    // Note: The 'gemini-1.5-flash' model can directly handle certain audio formats.
    // This simplifies the process as we don't need a separate speech-to-text endpoint.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
        contents: [{
            parts: [
                { "text": "transcribe this audio" },
                {
                    "inline_data": {
                        "mime_type": mimeType,
                        "data": audioBase64
                    }
                }
            ]
        }],
    };

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorBody = await res.text();
        console.error("Gemini Transcription API error:", errorBody);
        throw new Error(`Failed to transcribe audio. Status: ${res.status}`);
    }

    const data: any = await res.json();
    const transcript = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    return transcript;
  }
);
