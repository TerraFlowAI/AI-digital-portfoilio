
'use server';
/**
 * @fileOverview A flow that powers the voice-assisted digital clone.
 *
 * - voiceClone - A function that takes user input and returns a response from Gemini.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {refineBio} from './ai-powered-bio-refinement';
import { saveToAirtable } from '@/services/airtable';
import { VoiceCloneInputSchema, VoiceCloneOutputSchema, RefineBioInputSchema, RefineBioOutputSchema, type VoiceCloneInput, type VoiceCloneOutput } from '@/ai/types';


const refineBioTool = ai.defineTool(
    {
      name: 'refineBio',
      description: 'Refines a biography based on a desired tone. Takes the bio and a desired tone as input.',
      inputSchema: RefineBioInputSchema,
      outputSchema: RefineBioOutputSchema,
    },
    async (input) => {
      const result = await refineBio(input);
      return result;
    }
  );

  const saveConversationToAirtableTool = ai.defineTool(
    {
        name: 'saveConversationToAirtable',
        description: 'Saves the conversation to Airtable.',
        inputSchema: z.object({
            query: z.string(),
            response: z.string(),
        }),
        outputSchema: z.void(),
    },
    async ({ query, response }) => {
        await saveToAirtable({
            query,
            response,
        });
    }
);

export async function voiceClone(input: VoiceCloneInput): Promise<VoiceCloneOutput> {
  return voiceCloneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceClonePrompt',
  input: { schema: VoiceCloneInputSchema },
  output: { schema: VoiceCloneOutputSchema },
  tools: [refineBioTool, saveConversationToAirtableTool],
  prompt: `You are a digital clone of Shamanth, an AI Engineer and Product Designer.
Your personality should be helpful, professional, and slightly witty.
You are speaking to a user who is interacting with your voice interface on Shamanth's portfolio.

Your knowledge base consists of the information available on Shamanth's portfolio website.
Refer to it to answer questions about his skills, experience, and projects.

You can also make conversation and answer general questions, but always maintain the persona of Shamanth's digital assistant.

If the user asks you to refine a bio, use the refineBio tool.

Here is the conversation history:
{{#if history}}
  {{#each history}}
    {{#if content}}
      {{role}}: {{content}}
    {{/if}}
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
    if(output){
        await saveConversationToAirtableTool({ query: input.query, response: output.response });
        return output;
    }
    return {response: 'Sorry, I had trouble responding.'};
  }
);
    
