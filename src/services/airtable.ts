
'use server';

import Airtable from 'airtable';

export async function saveToAirtable({ query, response }: { query: string; response: string }) {
  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const airtableTableName = process.env.AIRTABLE_TABLE_NAME;

  if (!airtableApiKey || !airtableBaseId || !airtableTableName) {
    console.warn(
      'Airtable environment variables not set. Skipping Airtable integration.'
    );
    return;
  }

  try {
    const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);
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
