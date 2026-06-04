import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ============ GOOGLE SHEETS CONFIGURATION ============
// Option 1: Google Apps Script Webhook (Simple & Free)
// Create a Google Sheet, then Apps Script with doPost() function
// Deploy as Web App and paste the URL below
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';

// Option 2: Google Sheets API (For Production)
// Requires Google Cloud Service Account
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID || '';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || '';

// ============ EMAIL CONFIGURATION ============
// Using Resend API (Free tier: 3000 emails/month)
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
// Use onboarding@resend.dev for testing, or your verified domain for production
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
// For testing: Resend free tier only allows sending to your registered email
// Set this to your Resend account email for testing, or leave empty for production
const VERIFIED_EMAIL = process.env.VERIFIED_EMAIL || 'conceptbd.net@gmail.com';

// ============ PLAN NAMES ============
const PLAN_NAMES: Record<string, string> = {
  basic: 'বেসিক',
  professional: 'প্রফেশনাল',
  enterprise: 'এন্টারপ্রাইজ'
};

// ============ GOOGLE SHEETS FUNCTIONS ============
async function sendToGoogleSheets(order: {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  plan: string;
  amount: number;
  createdAt: Date;
}) {
  // Method 1: Using Apps Script Webhook (Simple)
  if (GOOGLE_SHEETS_WEBHOOK_URL) {
    try {
      const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: order.createdAt.toISOString(),
          orderId: order.id,
          name: order.name,
          mobile: order.mobile,
          email: order.email || 'N/A',
          plan: PLAN_NAMES[order.plan] || order.plan,
          amount: order.amount,
          status: 'pending'
        })
      });
      if (response.ok) {
        console.log('✅ Sent to Google Sheets via Webhook');
      } else {
        console.error('⚠️ Google Sheets response:', response.status);
      }
    } catch (error) {
      console.error('⚠️ Google Sheets Webhook error:', error);
    }
  } else {
    console.log('⚠️ Google Sheets Webhook URL not configured');
  }

  // Method 2: Using Google Sheets API (Production)
  // This requires setting up Google Cloud Service Account
  // Implementation would use googleapis package
  
  return true;
}

// ============ EMAIL FUNCTIONS ============
async function sendWelcomeEmail(order: {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  plan: string;
  amount: number;
}) {
  if (!order.email || !RESEND_API_KEY) {
    console.log('⚠️ No email or API key, skipping email');
    return false;
  }

  // For testing: Resend free tier only allows sending to verified email
  // In production with verified domain, this will send to the actual customer
  const recipientEmail = VERIFIED_EMAIL || order.email;
  
  console.log(`📧 Sending email to: ${recipientEmail} (customer: ${order.email})`);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: recipientEmail,
        subject: '🎉 অর্ডার সফল - System Toolkit',
        html: `
          <div style="font-family: 'Hind Siliguri', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 20px;">
            <div style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                  <span style="font-size: 40px;">✅</span>
                </div>
                <h1 style="color: #1a1a2e; margin: 0; font-size: 28px;">অর্ডার সফল!</h1>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                প্রিয় <strong>${order.name}</strong>,
              </p>
              
              <p style="color: #555; font-size: 15px; line-height: 1.8;">
                আপনার <strong>System Toolkit</strong> অর্ডার সফলভাবে গৃহীত হয়েছে। পেমেন্ট সম্পন্ন করার পর ১ ঘন্টার মধ্যে আপনি সফটওয়্যার অ্যাক্সেস পাবেন।
              </p>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; margin: 25px 0; color: white;">
                <h3 style="margin: 0 0 15px 0; font-size: 18px;">📦 অর্ডার বিবরণ</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; opacity: 0.9;">অর্ডার আইডি:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">#${order.id.slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; opacity: 0.9;">প্ল্যান:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${PLAN_NAMES[order.plan] || order.plan}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; opacity: 0.9;">মূল্য:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 20px;">৳${order.amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; opacity: 0.9;">মোবাইল:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${order.mobile}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; opacity: 0.9;">ইমেইল:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${order.email}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 0 12px 12px 0; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>📱 পেমেন্ট পদ্ধতি:</strong><br>
                  বিকাশ/নগদ: <strong>+880 1711-731354</strong><br>
                  পেমেন্ট করুন এবং স্ক্রিনশট WhatsApp এ পাঠান।
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://wa.me/8801711731354?text=${encodeURIComponent('হ্যালো, আমি অর্ডার কনফার্ম করতে চাই। অর্ডার আইডি: #' + order.id.slice(-8).toUpperCase())}" 
                   style="display: inline-block; background: #25D366; color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px;">
                  💬 WhatsApp এ যোগাযোগ করুন
                </a>
              </div>
              
              <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
                <p style="color: #888; font-size: 13px; margin: 0;">
                  © 2025 NextGen Digital Studio | <a href="https://www.facebook.com/nextgendigitalstudio" style="color: #667eea;">Facebook</a>
                </p>
              </div>
            </div>
          </div>
        `
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Welcome email sent! ID:', result.id);
      return true;
    } else {
      const errorText = await response.text();
      console.error('⚠️ Email failed:', errorText);
      return false;
    }
  } catch (error) {
    console.error('⚠️ Email error:', error);
    return false;
  }
}

// ============ MAIN ORDER API ============
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mobile, email, plan, amount } = body;

    // Validate required fields
    if (!name || !mobile || !plan || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await db.order.create({
      data: {
        name,
        mobile,
        email: email || null,
        plan,
        amount,
        status: 'pending'
      }
    });

    console.log('✅ Order created:', order.id);

    // Send to Google Sheets (non-blocking)
    sendToGoogleSheets({
      id: order.id,
      name: order.name,
      mobile: order.mobile,
      email: order.email,
      plan: order.plan,
      amount: order.amount,
      createdAt: order.createdAt
    }).catch(err => console.error('Google Sheets error:', err));

    // Send welcome email (non-blocking)
    if (email) {
      sendWelcomeEmail({
        id: order.id,
        name: order.name,
        mobile: order.mobile,
        email: order.email,
        plan: order.plan,
        amount: order.amount
      }).catch(err => console.error('Email error:', err));
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order created successfully',
      emailSent: !!email,
      googleSheetsSync: !!GOOGLE_SHEETS_WEBHOOK_URL
    });

  } catch (error) {
    console.error('❌ Order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('❌ Fetch orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
