
'use client';
/**
 * @fileOverview This file defines the client-side functions that invoke the Genkit flows.
 * This is necessary because server actions can't be passed directly to client components
 * in all scenarios, so we create these simple wrapper functions.
 */

import { runAction } from 'genkit/next/client';
import type { chat } from './flows/chat-flow';
import type { transcribe } from './flows/transcribe-flow';

export const transcribe = (payload: Parameters<typeof transcribe>[0]) => 
  runAction(transcribe, payload);

export const chat = (payload: Parameters<typeof chat>[0]) =>
  runAction(chat, payload);
