
import { config } from 'dotenv';
config();

// Just import the services and flows you want to be available in the dev server.
import '@/services/airtable.ts';
import '@/ai/flows/gemini-assistant-flow.ts';
