'use server';
/**
 * @fileOverview A server-side flow to handle a complete voice assistant interaction,
 * from transcription to chat reply and text-to-speech, and saving the conversation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { saveToAirtable } from '@/services/airtable';
import fetch from 'node-fetch';

const AssistantInputSchema = z.object({
  audioBase64: z.string().describe("The user's voice input as a base64 encoded string."),
  mimeType: z.string().describe("The MIME type of the audio file."),
});

const AssistantOutputSchema = z.object({
  transcript: z.string().optional().describe("The transcript of the user's audio input."),
  reply: z.string().describe("The AI's text response."),
  audioBase64: z.string().optional().describe("The AI's audio response as a base64 encoded string."),
});

export async function geminiAssistant(input: z.infer<typeof AssistantInputSchema>): Promise<z.infer<typeof AssistantOutputSchema>> {
  return geminiAssistantFlow(input);
}

const geminiAssistantFlow = ai.defineFlow(
  {
    name: 'geminiAssistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async ({ audioBase64, mimeType }) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured.');
    }

    // 1. Transcribe Audio
    const transcribeUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const transcribePayload = {
      contents: [{
        parts: [
          { "text": "transcribe this audio" },
          { "inline_data": { "mime_type": mimeType, "data": audioBase64 } }
        ]
      }],
    };
    const transcribeRes = await fetch(transcribeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transcribePayload),
    });

    if (!transcribeRes.ok) {
      console.error("Gemini Transcription API error:", await transcribeRes.text());
      return { reply: "Sorry, I couldn't understand what you said." };
    }
    
    const transcribeJson: any = await transcribeRes.json();
    const transcript = transcribeJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!transcript) {
      return { reply: "Sorry, I couldn't understand what you said." };
    }

    // 2. Get chat reply from Gemini
    const chatUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const chatPayload = {
      contents: [{ role: 'user', parts: [{ text: transcript }] }],
    };
    const chatRes = await fetch(chatUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chatPayload),
    });

    if (!chatRes.ok) {
        console.error("Gemini Chat API error:", await chatRes.text());
        return { transcript, reply: "Sorry, I encountered an error while generating a reply." };
    }
    const chatJson: any = await chatRes.json();
    const replyText = chatJson?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a reply.";

    // 3. Get TTS audio from Google
    const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GEMINI_API_KEY}`;
    const ttsPayload = {
      input: { text: replyText },
      voice: { languageCode: "en-IN", name: "en-IN-Wavenet-D" }, // Indian Male Voice
      audioConfig: { audioEncoding: "MP3" },
    };
    const ttsRes = await fetch(ttsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ttsPayload),
    });

    let audioReplyBase64;
    if (ttsRes.ok) {
        const ttsJson: any = await ttsRes.json();
        audioReplyBase64 = ttsJson?.audioContent;
    } else {
        console.error("Google TTS API error:", await ttsRes.text());
        // Don't throw, just return the text reply
    }

    // 4. Save to Airtable (fire-and-forget)
    saveToAirtable({ query: transcript, response: replyText }).catch(e => console.error("Airtable save failed:", e));

    return {
      transcript,
      reply: replyText,
      audioBase64: audioReplyBase64,
    };
  }
);
