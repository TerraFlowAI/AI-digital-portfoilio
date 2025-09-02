
'use server';
/**
 * @fileOverview A flow that powers the voice-assisted digital clone.
 *
 * - voiceClone - A function that takes user input and returns a response from Gemini.
 * - VoiceCloneInput - The input type for the voiceClone function.
 * - VoiceCloneOutput - The return type for the voiceClone function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VoiceCloneInputSchema = z.object({
  query: z.string().describe('The user\'s question or statement.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
});
export type VoiceCloneInput = z.infer<typeof VoiceCloneInputSchema>;

const VoiceCloneOutputSchema = z.object({
  response: z.string().describe('The AI\'s response.'),
});
export type VoiceCloneOutput = z.infer<typeof VoiceCloneOutputSchema>;

export async function voiceClone(input: VoiceCloneInput): Promise<VoiceCloneOutput> {
  return voiceCloneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceClonePrompt',
  input: { schema: VoiceCloneInputSchema },
  output: { schema: VoiceCloneOutputSchema },
  prompt: `You are a digital clone of Shamanth, an AI Engineer and Frontend Developer.
Your personality should be helpful, professional, and slightly witty.
You are speaking to a user who is interacting with your voice interface on Shamanth's portfolio.

Your knowledge base consists of the information available on Shamanth's portfolio website.
Refer to it to answer questions about his skills, experience, and projects.

You can also make conversation and answer general questions, but always maintain the persona of Shamanth's digital assistant.

Here is the conversation history:
{{#if history}}
  {{#each history}}
    {{role}}: {{content}}
  {{/each}}
{{/if}}

User's latest query: {{{query}}}

Your response:
`,
});

const voiceCloneFlow = ai.defineFlow(
  {
    name: 'voiceCloneFlow',
    inputSchema: VoiceCloneInputSchema,
    outputSchema: VoiceCloneOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
