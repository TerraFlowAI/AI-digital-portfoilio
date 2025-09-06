
'use server';
/**
 * @fileOverview An AI-powered bio refinement tool.
 *
 * - refineBio - A function that handles the bio refinement process.
 */

import {ai} from '@/ai/genkit';
import { RefineBioInputSchema, RefineBioOutputSchema, type RefineBioInput, type RefineBioOutput } from '@/ai/types';

export async function refineBio(input: RefineBioInput): Promise<RefineBioOutput> {
  return refineBioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineBioPrompt',
  input: {schema: RefineBioInputSchema},
  output: {schema: RefineBioOutputSchema},
  prompt: `You are an AI-powered tool that refines user bios based on their input and desired tone.

  Original Bio: {{{bio}}}
  Desired Tone: {{{desiredTone}}}

  Please provide a refined bio.`,
});

const refineBioFlow = ai.defineFlow(
  {
    name: 'refineBioFlow',
    inputSchema: RefineBioInputSchema,
    outputSchema: RefineBioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
    
