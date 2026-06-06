import { NextResponse } from 'next/server';

export async function GET() {
  const envUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const fallbackUrl = 'https://script.google.com/macros/s/AKfycbyEYLsx__ZxIjRJmjKlOPfD87jkHk6EoJiu4bmIXaNL722UAWils-iFitRHOXa-fJC2/exec';

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: {
      hasEnvVar: !!envUrl,
      envUrlLength: envUrl?.length || 0,
      envUrlPrefix: envUrl ? envUrl.substring(0, 50) + '...' : null,
      usingFallback: !envUrl,
      fallbackUrlPrefix: fallbackUrl.substring(0, 50) + '...'
    },
    // Check if URLs match
    urlsMatch: envUrl === fallbackUrl,
    // The actual URL that will be used
    activeUrl: envUrl || fallbackUrl
  });
}
