/**
 * @fileOverview This file contains the Zod schemas and TypeScript types for the AI flows.
 * By centralizing them here, we can avoid "use server" conflicts.
 */

import { z } from 'zod';

// Schema for the AI-powered bio refinement tool
export const RefineBioInputSchema = z.object({
  bio: z.string().describe('The user provided bio to be refined.'),
  desiredTone: z.string().describe('The desired tone of the bio.'),
});
export type RefineBioInput = z.infer<typeof RefineBioInputSchema>;

export const RefineBioOutputSchema = z.object({
  refinedBio: z.string().describe('The refined bio based on the input and desired tone.'),
});
export type RefineBioOutput = z.infer<typeof RefineBioOutputSchema>;


// Schema for the voice clone flow
const voiceCloneHistorySchema = z.array(
  z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })
);

export const VoiceCloneInputSchema = z.object({
  query: z.string().describe("The user's question or statement."),
  history: voiceCloneHistorySchema.optional().describe('The conversation history.'),
});
export type VoiceCloneInput = z.infer<typeof VoiceCloneInputSchema>;

export const VoiceCloneOutputSchema = z.object({
  response: z.string().describe("The AI's response."),
});
export type VoiceCloneOutput = z.infer<typeof VoiceCloneOutputSchema>;
