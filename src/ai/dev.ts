
import { config } from 'dotenv';
config();

// Just import the services and flows you want to be available in the dev server.
import '@/services/airtable.ts';
import '@/ai/flows/gemini-assistant-flow.ts';
import '@/ai/flows/transcribe-flow.ts';
import '@/ai/flows/chat-flow.ts';
