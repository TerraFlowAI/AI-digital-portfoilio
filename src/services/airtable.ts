
'use server';

import Airtable from 'airtable';

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const airtableTableName = process.env.AIRTABLE_TABLE_NAME;

if (!airtableApiKey || !airtableBaseId || !airtableTableName) {
  console.warn(
    'Airtable environment variables not set. Skipping Airtable integration.'
  );
}

const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId || '');

export async function saveToAirtable({ query, response }: { query: string; response: string }) {
  if (!airtableApiKey || !airtableBaseId || !airtableTableName) {
    return;
  }

  try {
    await base(airtableTableName).create([
      {
        fields: {
          Query: query,
          Response: response,
          Timestamp: new Date().toISOString(),
        },
      },
    ]);
  } catch (error) {
    console.error('Error saving to Airtable:', error);
  }
}
