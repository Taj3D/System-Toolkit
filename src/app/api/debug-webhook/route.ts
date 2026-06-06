import { NextResponse } from 'next/server';

export async function GET() {
  const envUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  // This is the hardcoded URL used in order route (Version 4 - June 2026)
  const hardcodedUrl = 'https://script.google.com/macros/s/AKfycbyEYLsx__ZxIjRJmjKlOPfD87jkHk6EoJiu4bmIXaNL722UAWils-iFitRHOXa-fJC2/exec';

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    note: "Order route now uses hardcoded URL to ensure correct webhook",
    environment: {
      hasEnvVar: !!envUrl,
      envUrlPrefix: envUrl ? envUrl.substring(0, 50) + '...' : null,
    },
    // The actual URL that order route uses (hardcoded)
    activeUrl: hardcodedUrl,
    activeUrlPrefix: hardcodedUrl.substring(0, 50) + '...',
    status: '✅ Using correct hardcoded URL (Version 4)'
  });
}
