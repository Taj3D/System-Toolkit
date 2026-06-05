import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';

// ============ GOOGLE SHEETS CONFIGURATION ============
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';

// ============ RESEND CONFIGURATION ============
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_Gq333Hz1_68k6qaUExt32U5vPri1E43zv';
// Use onboarding@resend.dev for free tier (only sends to verified email)
const EMAIL_FROM = 'onboarding@resend.dev';

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

// ============ PLAN NAMES ============
const PLAN_NAMES: Record<string, string> = {
  basic: 'বেসিক',
  professional: 'প্রফেশনাল',
  enterprise: 'এন্টারপ্রাইজ',
  special: 'স্পেশাল অফার'
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

// ============ EMAIL HTML TEMPLATES ============
function getCustomerEmailHtml(order: { name: string; mobile: string; email: string; plan: string; amount: number; orderIdShort: string }) {
  const planName = PLAN_NAMES[order.plan] || order.plan;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; }
        .content { padding: 30px; }
        .order-box { background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .order-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .order-row:last-child { border-bottom: none; }
        .payment-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 12px 12px 0; margin: 20px 0; }
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
              <h3 style="margin: 0 0 15px 0; color: #10b981;">📦 অর্ডার বিবরণ</h3>
              <div class="order-row">
                <span>অর্ডার আইডি:</span>
                <strong>#${order.orderIdShort}</strong>
              </div>
              <div class="order-row">
                <span>প্ল্যান:</span>
                <strong>${planName}</strong>
              </div>
              <div class="order-row">
                <span>মূল্য:</span>
                <strong style="font-size: 20px; color: #10b981;">৳${order.amount}</strong>
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
              <p style="margin: 0; color: #92400e;">
                <strong>📱 পেমেন্ট পদ্ধতি:</strong><br>
                বিকাশ/নগদ: <strong>+880 1711-731354</strong><br>
                পেমেন্ট করুন এবং স্ক্রিনশট WhatsApp এ পাঠান।
              </p>
            </div>

            <div style="text-align: center;">
              <a href="https://wa.me/8801711731354?text=${encodeURIComponent('হ্যালো, আমি অর্ডার কনফার্ম করতে চাই। অর্ডার আইডি: #' + order.orderIdShort)}"
                 class="whatsapp-btn">
                💬 WhatsApp এ যোগাযোগ করুন
              </a>
            </div>
          </div>

          <div class="footer">
            <p>© 2025 NextGen Digital Studio | <a href="https://www.facebook.com/nextgendigitalstudio" style="color: #10b981;">Facebook</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getAdminEmailHtml(order: { name: string; mobile: string; email: string | null; plan: string; amount: number; orderIdShort: string }) {
  const planName = PLAN_NAMES[order.plan] || order.plan;
  
  return `
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
        .highlight { color: #10b981; font-weight: bold; font-size: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 নতুন অর্ডার এসেছে!</h1>
        </div>
        
        <div class="info-box">
          <h3>📦 অর্ডার তথ্য</h3>
          <div class="info-row"><strong>অর্ডার আইডি:</strong> #${order.orderIdShort}</div>
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
          <a href="https://wa.me/88${order.mobile}?text=${encodeURIComponent('হ্যালো, আপনার অর্ডার #' + order.orderIdShort + ' এর জন্য যোগাযোগ করছি।')}"
             style="background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            💬 WhatsApp এ যোগাযোগ করুন
          </a>
        </p>
      </div>
    </body>
    </html>
  `;
}

// ============ EMAIL FUNCTIONS (RESEND) ============
let lastEmailError: any = null;

async function sendWelcomeEmail(order: {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  plan: string;
  amount: number;
}) {
  console.log(`📧 Sending order notification to admin...`);
  const orderIdShort = order.id.slice(-8).toUpperCase();
  const planName = PLAN_NAMES[order.plan] || order.plan;

  try {
    // For free tier: send to admin email (verified), include customer details in content
    const { data, error } = await resend.emails.send({
      from: `System Toolkit <${EMAIL_FROM}>`,
      to: ['conceptbd.net@gmail.com'],
      subject: `🔔 নতুন অর্ডার - #${orderIdShort} (${planName} - ৳${order.amount})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 30px;">
            <h1 style="color: #10b981;">🎉 নতুন অর্ডার এসেছে!</h1>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h3>📦 অর্ডার তথ্য</h3>
              <p><strong>অর্ডার আইডি:</strong> #${orderIdShort}</p>
              <p><strong>প্ল্যান:</strong> ${planName}</p>
              <p><strong>মূল্য:</strong> <span style="color: #10b981; font-size: 24px;">৳${order.amount}</span></p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h3>👤 গ্রাহক তথ্য</h3>
              <p><strong>নাম:</strong> ${order.name}</p>
              <p><strong>মোবাইল:</strong> ${order.mobile}</p>
              <p><strong>ইমেইল:</strong> ${order.email || 'N/A'}</p>
            </div>
            
            <p style="text-align: center;">
              <a href="https://wa.me/88${order.mobile}?text=${encodeURIComponent('হ্যালো, আপনার অর্ডার #' + orderIdShort + ' এর জন্য যোগাযোগ করছি।')}"
                 style="background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
                💬 WhatsApp এ যোগাযোগ করুন
              </a>
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('⚠️ Resend error:', error);
      lastEmailError = error;
      return false;
    }

    console.log('✅ Order notification sent! ID:', data?.id);
    return true;
  } catch (error) {
    console.error('⚠️ Email error:', error);
    lastEmailError = error;
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
  const orderIdShort = order.id.slice(-8).toUpperCase();
  const planName = PLAN_NAMES[order.plan] || order.plan;

  console.log('📧 Sending admin notification...');

  try {
    const { data, error } = await resend.emails.send({
      from: `System Toolkit Orders <${EMAIL_FROM}>`,
      to: ['conceptbd.net@gmail.com'],
      subject: `🔔 নতুন অর্ডার - #${orderIdShort} (${planName} - ৳${order.amount})`,
      html: getAdminEmailHtml({
        name: order.name,
        mobile: order.mobile,
        email: order.email,
        plan: order.plan,
        amount: order.amount,
        orderIdShort
      })
    });

    if (error) {
      console.error('⚠️ Admin notification error:', error);
      return false;
    }

    console.log('✅ Admin notification sent! ID:', data?.id);
    return true;
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

    // Send order notification to admin
    const emailSent = await sendWelcomeEmail({
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
      googleSheetsSync: sheetsSync,
      dbSaved
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
