/**
 * @fileOverview This file contains the Zod schemas and TypeScript types for the AI flows.
 * By centralizing them here, we can avoid "use server" conflicts.
 */

import { z } from 'zod';

const messageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

// Schema for the Gemini Assistant flow
export const GeminiAssistantInputSchema = z.object({
  query: z.string().optional().describe("The user's text question or statement."),
  audio: z.string().optional().describe("The user's voice input as a base64 encoded string."),
  history: z.array(messageSchema).optional().describe('The conversation history.'),
});
export type GeminiAssistantInput = z.infer<typeof GeminiAssistantInputSchema>;

export const GeminiAssistantOutputSchema = z.object({
  transcript: z.string().optional().describe("The transcript of the user's audio input."),
  reply: z.string().describe("The AI's response."),
  audioReply: z.string().optional().describe("The AI's response as base64 encoded audio data."),
});
export type GeminiAssistantOutput = z.infer<typeof GeminiAssistantOutputSchema>;