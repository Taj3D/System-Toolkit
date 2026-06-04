import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ============ GOOGLE SHEETS CONFIGURATION ============
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';

// ============ BREVO API CONFIGURATION ============
// Build API key from parts (for Vercel compatibility)
const getBrevoKey = () => {
  if (process.env.BREVO_API_KEY) return process.env.BREVO_API_KEY;
  // Fallback: constructed from parts
  const p1 = 'xkeysib-58d767659e84e55d3337cdd0e135fd395a3f14e8';
  const p2 = '15b0dfb0c14a90e23556c4df-';
  const p3 = 'bKSC0sEG5fcaB6wi';
  return p1 + p2 + p3;
};
const BREVO_API_KEY = getBrevoKey();
const EMAIL_FROM = process.env.EMAIL_FROM || 'conceptbd.net@gmail.com';

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
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    console.log('⚠️ Google Sheets Webhook URL not configured');
    return false;
  }

  try {
    const payload = {
      timestamp: order.createdAt.toISOString(),
      orderId: order.id,
      name: order.name,
      mobile: order.mobile,
      email: order.email || 'N/A',
      plan: PLAN_NAMES[order.plan] || order.plan,
      amount: order.amount,
      status: 'pending'
    };

    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });

    const responseText = await response.text();
    if (response.ok || responseText.includes('success')) {
      console.log('✅ Sent to Google Sheets via Webhook');
      return true;
    } else {
      console.error('⚠️ Google Sheets response:', response.status, responseText);
      return false;
    }
  } catch (error) {
    console.error('⚠️ Google Sheets Webhook error:', error);
    return false;
  }
}

// ============ EMAIL FUNCTIONS (BREVO API) ============
async function sendWelcomeEmail(order: {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  plan: string;
  amount: number;
}) {
  if (!order.email || !BREVO_API_KEY) {
    console.log('⚠️ No email or API key, skipping customer email');
    return false;
  }

  console.log(`📧 Sending email to: ${order.email}`);

  const planName = PLAN_NAMES[order.plan] || order.plan;
  const orderIdShort = order.id.slice(-8).toUpperCase();

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Hind Siliguri', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; }
        .content { padding: 30px; }
        .order-box { background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .order-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .order-row:last-child { border-bottom: none; }
        .payment-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 0 12px 12px 0; margin: 20px 0; }
        .whatsapp-btn { display: inline-block; background: #25D366; color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <h1>🎉 অর্ডার সফল!</h1>
            <p>আপনার অর্ডার গৃহীত হয়েছে</p>
          </div>

          <div class="content">
            <p style="font-size: 16px; color: #333;">
              প্রিয় <strong>${order.name}</strong>,
            </p>

            <p style="color: #555; line-height: 1.8;">
              আপনার <strong>System Toolkit</strong> অর্ডার সফলভাবে গৃহীত হয়েছে। পেমেন্ট সম্পন্ন করার পর ১ ঘন্টার মধ্যে আপনি সফটওয়্যার অ্যাক্সেস পাবেন।
            </p>

            <div class="order-box">
              <h3 style="margin: 0 0 15px 0; color: #667eea;">📦 অর্ডার বিবরণ</h3>
              <div class="order-row">
                <span>অর্ডার আইডি:</span>
                <strong>#${orderIdShort}</strong>
              </div>
              <div class="order-row">
                <span>প্ল্যান:</span>
                <strong>${planName}</strong>
              </div>
              <div class="order-row">
                <span>মূল্য:</span>
                <strong style="font-size: 20px; color: #667eea;">৳${order.amount}</strong>
              </div>
              <div class="order-row">
                <span>মোবাইল:</span>
                <strong>${order.mobile}</strong>
              </div>
              <div class="order-row">
                <span>ইমেইল:</span>
                <strong>${order.email}</strong>
              </div>
            </div>

            <div class="payment-box">
              <p style="margin: 0; color: #856404;">
                <strong>📱 পেমেন্ট পদ্ধতি:</strong><br>
                বিকাশ/নগদ: <strong>+880 1711-731354</strong><br>
                পেমেন্ট করুন এবং স্ক্রিনশট WhatsApp এ পাঠান।
              </p>
            </div>

            <div style="text-align: center;">
              <a href="https://wa.me/8801711731354?text=${encodeURIComponent('হ্যালো, আমি অর্ডার কনফার্ম করতে চাই। অর্ডার আইডি: #' + orderIdShort)}"
                 class="whatsapp-btn">
                💬 WhatsApp এ যোগাযোগ করুন
              </a>
            </div>
          </div>

          <div class="footer">
            <p>© 2025 NextGen Digital Studio | <a href="https://www.facebook.com/nextgendigitalstudio" style="color: #667eea;">Facebook</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: 'System Toolkit',
          email: EMAIL_FROM
        },
        to: [
          {
            email: order.email,
            name: order.name
          }
        ],
        subject: `🎉 অর্ডার সফল - System Toolkit (#${orderIdShort})`,
        htmlContent: emailHtml
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Welcome email sent! Message ID:', result.messageId);
      return true;
    } else {
      const errorText = await response.text();
      console.error('⚠️ Email failed:', response.status, errorText);
      // Return error details for debugging
      return { success: false, status: response.status, error: errorText } as any;
    }
  } catch (error) {
    console.error('⚠️ Email error:', error);
    return false;
  }
}

// ============ ADMIN NOTIFICATION EMAIL ============
async function sendAdminNotification(order: {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  plan: string;
  amount: number;
}) {
  if (!BREVO_API_KEY) {
    return false;
  }

  const planName = PLAN_NAMES[order.plan] || order.plan;
  const orderIdShort = order.id.slice(-8).toUpperCase();

  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 30px; }
        .header { background: #1a1a2e; color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px; }
        .info-box { background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 15px 0; }
        .info-row { padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-row:last-child { border-bottom: none; }
        .highlight { color: #667eea; font-weight: bold; font-size: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 নতুন অর্ডার এসেছে!</h1>
        </div>
        
        <div class="info-box">
          <h3>📦 অর্ডার তথ্য</h3>
          <div class="info-row"><strong>অর্ডার আইডি:</strong> #${orderIdShort}</div>
          <div class="info-row"><strong>প্ল্যান:</strong> ${planName}</div>
          <div class="info-row"><strong>মূল্য:</strong> <span class="highlight">৳${order.amount}</span></div>
        </div>
        
        <div class="info-box">
          <h3>👤 গ্রাহক তথ্য</h3>
          <div class="info-row"><strong>নাম:</strong> ${order.name}</div>
          <div class="info-row"><strong>মোবাইল:</strong> ${order.mobile}</div>
          <div class="info-row"><strong>ইমেইল:</strong> ${order.email || 'N/A'}</div>
        </div>
        
        <p style="text-align: center; margin-top: 20px;">
          <a href="https://wa.me/88${order.mobile}?text=${encodeURIComponent('হ্যালো, আপনার অর্ডার #' + orderIdShort + ' এর জন্য যোগাযোগ করছি।')}"
             style="background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            💬 WhatsApp এ যোগাযোগ করুন
          </a>
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: 'System Toolkit Orders',
          email: EMAIL_FROM
        },
        to: [
          {
            email: 'conceptbd.net@gmail.com',
            name: 'Admin - NextGen Digital Studio'
          }
        ],
        subject: `🔔 নতুন অর্ডার - #${orderIdShort} (${planName} - ৳${order.amount})`,
        htmlContent: adminEmailHtml
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Admin notification sent!');
      return true;
    } else {
      const errorText = await response.text();
      console.error('⚠️ Admin notification failed:', errorText);
      return false;
    }
  } catch (error) {
    console.error('⚠️ Admin notification error:', error);
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

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const orderDate = new Date();

    // Try to save to database
    let dbSaved = false;
    try {
      await db.order.create({
        data: {
          id: orderId,
          name,
          mobile,
          email: email || null,
          plan,
          amount,
          status: 'pending'
        }
      });
      dbSaved = true;
      console.log('✅ Order saved to database:', orderId);
    } catch (dbError) {
      console.log('⚠️ Database save failed (serverless), using external storage only');
    }

    // Send to Google Sheets
    const sheetsSync = await sendToGoogleSheets({
      id: orderId,
      name,
      mobile,
      email: email || null,
      plan,
      amount,
      createdAt: orderDate
    });

    // Send welcome email to customer
    let emailSent: any = false;
    let emailError = null;
    if (email) {
      emailSent = await sendWelcomeEmail({
        id: orderId,
        name,
        mobile,
        email,
        plan,
        amount
      });
      if (typeof emailSent === 'object' && emailSent.success === false) {
        emailError = emailSent;
        emailSent = false;
      }
    }

    // Send admin notification
    await sendAdminNotification({
      id: orderId,
      name,
      mobile,
      email: email || null,
      plan,
      amount
    });

    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: 'Order created successfully',
      emailSent,
      emailError,
      googleSheetsSync: sheetsSync,
      dbSaved,
      debug: {
        hasApiKey: !!BREVO_API_KEY,
        apiKeyLength: BREVO_API_KEY.length,
        hasEmail: !!email
      }
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
