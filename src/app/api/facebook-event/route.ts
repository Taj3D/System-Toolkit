import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ============ FACEBOOK CONVERSIONS API CONFIG ============
const FACEBOOK_PIXEL_ID = '1055888723429361';
const FACEBOOK_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || 'EAAXExUUyB1QBRh9bA0s2Wslhsjmaru1h5hdzZBVXJ0kP6XyY7Sv4cJOw9rjZBtdb9QmxT73wJcZBeGSbGkZAkEFfJv9RZBy47T8qLl45ZCqBW45hZBZCdFwbFCt9LmgZAHSMNbGsaHjL1B13Ew63Lss8h06WPqVPlEBd8JT5ZB3PVheY67PMv5ZBUJKZB3rKrzqtAvZBKDQZDZD';

// ============ HASH FUNCTION FOR USER DATA ============
function hashData(data: string): string {
  if (!data) return '';
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

// ============ SEND EVENT TO FACEBOOK ============
async function sendFacebookEvent(eventData: {
  eventName: string;
  eventId: string;
  email?: string;
  phone?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
}) {
  const {
    eventName,
    eventId,
    email,
    phone,
    value = 0,
    currency = 'BDT',
    contentName,
    clientIpAddress,
    clientUserAgent
  } = eventData;

  const userData: Record<string, string> = {};
  
  // Hash and add user data
  if (email) userData.em = hashData(email);
  if (phone) userData.ph = hashData(phone.replace(/[^0-9]/g, ''));
  if (clientIpAddress) userData.client_ip_address = clientIpAddress;
  if (clientUserAgent) userData.client_user_agent = clientUserAgent;

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_id: eventId,
    user_data: userData,
    custom_data: {
      currency,
      value,
      content_name: contentName || ''
    }
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${FACEBOOK_PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [event],
          access_token: FACEBOOK_ACCESS_TOKEN
        })
      }
    );

    const result = await response.json();
    
    if (result.error) {
      console.error('Facebook API Error:', result.error);
      return { success: false, error: result.error };
    }

    console.log('✅ Facebook Event sent:', eventName, 'Event ID:', eventId);
    return { success: true, eventId, fbTraceId: result.fbtrace_id };
  } catch (error) {
    console.error('Facebook Event Error:', error);
    return { success: false, error };
  }
}

// ============ API HANDLERS ============
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventName,
      eventId,
      email,
      phone,
      value,
      currency,
      contentName
    } = body;

    if (!eventName || !eventId) {
      return NextResponse.json(
        { success: false, error: 'Missing eventName or eventId' },
        { status: 400 }
      );
    }

    // Get client info from headers
    const clientIpAddress = request.headers.get('x-forwarded-for') || 
                           request.headers.get('x-real-ip') || 
                           '';
    const clientUserAgent = request.headers.get('user-agent') || '';

    const result = await sendFacebookEvent({
      eventName,
      eventId,
      email,
      phone,
      value,
      currency,
      contentName,
      clientIpAddress,
      clientUserAgent
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Facebook Event API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Test endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Facebook Conversions API is ready',
    pixelId: FACEBOOK_PIXEL_ID
  });
}
