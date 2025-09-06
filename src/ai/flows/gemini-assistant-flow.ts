
'use server';
/**
 * @fileOverview A server-side function to save conversation history to Airtable.
 *
 * - saveConversation - A function that saves a user query and an assistant response.
 */
import { saveToAirtable } from '@/services/airtable';

// This is a server action that can be called from the client.
// It's responsible for saving the conversation to Airtable.
export async function saveConversation({ query, response }: { query: string, response: string }) {
  // We don't want to block the UI, so we won't await this.
  // This will run in the background.
  saveToAirtable({ 
      query: query, 
      response: response 
  }).catch(e => console.error('Failed to save to Airtable:', e));
}

    