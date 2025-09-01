'use server';
/**
 * @fileOverview An AI-powered bio refinement tool.
 *
 * - refineBio - A function that handles the bio refinement process.
 * - RefineBioInput - The input type for the refineBio function.
 * - RefineBioOutput - The return type for the refineBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineBioInputSchema = z.object({
  bio: z
    .string()
    .describe('The user provided bio to be refined.'),
  desiredTone: z.string().describe('The desired tone of the bio.'),
});
export type RefineBioInput = z.infer<typeof RefineBioInputSchema>;

const RefineBioOutputSchema = z.object({
  refinedBio: z.string().describe('The refined bio based on the input and desired tone.'),
});
export type RefineBioOutput = z.infer<typeof RefineBioOutputSchema>;

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

  Refined Bio:`,
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
