
'use server';
/**
 * @fileOverview A flow that powers the voice-assisted digital clone.
 *
 * - voiceClone - A function that takes user input and returns a response from Gemini.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {refineBio} from './ai-powered-bio-refinement';
import { VoiceCloneInputSchema, VoiceCloneOutputSchema, RefineBioInputSchema, type VoiceCloneInput, type VoiceCloneOutput } from '@/ai/types';


const refineBioTool = ai.defineTool(
    {
      name: 'refineBio',
      description: 'Refines a biography based on a desired tone.',
      inputSchema: RefineBioInputSchema,
      outputSchema: z.string(),
    },
    async (input) => {
      const { refinedBio } = await refineBio(input);
      return refinedBio;
    }
  );

export async function voiceClone(input: VoiceCloneInput): Promise<VoiceCloneOutput> {
  return voiceCloneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceClonePrompt',
  input: { schema: VoiceCloneInputSchema },
  output: { schema: VoiceCloneOutputSchema },
  tools: [refineBioTool],
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
    
