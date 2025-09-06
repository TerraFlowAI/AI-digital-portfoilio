
'use server';
/**
 * @fileOverview A comprehensive flow that uses Gemini for STT, Chat, and TTS.
 *
 * - geminiAssistant - A function that handles the entire voice assistant interaction.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { saveToAirtable } from '@/services/airtable';
import { GeminiAssistantInputSchema, GeminiAssistantOutputSchema, type GeminiAssistantInput, type GeminiAssistantOutput } from '@/ai/types';

// Helper to convert PCM audio buffer to WAV format as a Base64 string
async function toWav(pcmData: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels: 1,
      sampleRate: 24000,
      bitDepth: 16,
    });
    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
    writer.write(pcmData);
    writer.end();
  });
}

// Exported function that the client will call
export async function geminiAssistant(input: GeminiAssistantInput): Promise<GeminiAssistantOutput> {
  return geminiAssistantFlow(input);
}

// Define the main Genkit flow
const geminiAssistantFlow = ai.defineFlow(
  {
    name: 'geminiAssistantFlow',
    inputSchema: GeminiAssistantInputSchema,
    outputSchema: GeminiAssistantOutputSchema,
  },
  async (input) => {
    let userQuery = input.query || '';
    let transcript: string | undefined = undefined;

    // 1. Speech-to-Text (if audio is provided)
    if (input.audio) {
      try {
        const { text } = await ai.generate({
          model: 'googleai/gemini-2.5-flash-speech',
          prompt: [
            { media: { url: `data:audio/webm;base64,${input.audio}` } },
          ],
        });
        userQuery = text;
        transcript = text;
      } catch (e) {
        console.error('Error during transcription:', e);
        // If transcription fails, we can't proceed with this interaction.
        return { reply: "Sorry, I couldn't understand what you said." };
      }
    }

    if (!userQuery) {
        return { reply: "I didn't catch that. Could you please repeat?" };
    }

    // Prepare prompt for the chat model, including history
    const chatHistory = (input.history || []).map(h => ({
        role: h.role,
        content: [{text: h.content}]
    }));

    const systemPrompt = `You are a helpful AI assistant. Your personality should be professional, and slightly witty. Keep your responses concise.`

    // 2. Chat Completion
    let assistantReply = "Sorry, I encountered an issue and can't respond right now.";
    try {
        const chatResponse = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            history: chatHistory,
            prompt: userQuery,
            system: systemPrompt,
        });
        assistantReply = chatResponse.text;
    } catch(e) {
        console.error('Error during chat completion:', e);
    }
    

    // 3. Text-to-Speech
    let audioReply: string | undefined = undefined;
    try {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-preview-tts',
             config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: "Arneb", // A high-quality Indian Male voice
                        }
                    },
                },
            },
            prompt: assistantReply,
        });
        if (media) {
            const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
            const wavBase64 = await toWav(audioBuffer);
            audioReply = `data:audio/wav;base64,${wavBase64}`;
        }
    } catch(e) {
        console.error('Error during text-to-speech:', e);
    }
   

    // 4. Save to Airtable (fire-and-forget)
    saveToAirtable({ 
        query: userQuery, 
        response: assistantReply 
    }).catch(e => console.error('Failed to save to Airtable:', e));


    return {
      transcript,
      reply: assistantReply,
      audioReply,
    };
  }
);
