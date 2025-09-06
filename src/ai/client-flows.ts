'use client';
/**
 * @fileOverview This file defines the client-side functions that invoke the Genkit flows.
 * This is necessary because server actions can't be passed directly to client components
 * in all scenarios, so we create these simple wrapper functions.
 */

import { runFlow } from '@genkit-ai/next/client';
import type { geminiAssistant } from './flows/gemini-assistant-flow';

export const geminiAssistant = (payload: Parameters<typeof geminiAssistant>[0]) =>
  runFlow(geminiAssistant, payload);
