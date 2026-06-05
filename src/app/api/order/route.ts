import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';

// ============ GOOGLE SHEETS CONFIGURATION ============
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';

// ============ RESEND CONFIGURATION ============
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_Gq333Hz1_68k6qaUExt32U5vPri1E43zv';
// Verified domain: nextgendigitalstudio.com
const EMAIL_FROM = 'noreply@nextgendigitalstudio.com';

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

// ============ CUSTOMER EMAIL HTML ============
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

// ============ EMAIL FUNCTION - SEND TO CUSTOMER ============
let lastEmailError: any = null;

async function sendCustomerEmail(order: {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  plan: string;
  amount: number;
}) {
  if (!order.email) {
    console.log('⚠️ No customer email provided');
    return false;
  }

  console.log(`📧 Sending email to customer: ${order.email}`);
  const orderIdShort = order.id.slice(-8).toUpperCase();
  const planName = PLAN_NAMES[order.plan] || order.plan;

  try {
    const { data, error } = await resend.emails.send({
      from: `System Toolkit <${EMAIL_FROM}>`,
      to: [order.email],
      subject: `🎉 অর্ডার সফল - System Toolkit (#${orderIdShort})`,
      html: getCustomerEmailHtml({
        name: order.name,
        mobile: order.mobile,
        email: order.email,
        plan: order.plan,
        amount: order.amount,
        orderIdShort
      })
    });

    if (error) {
      console.error('⚠️ Resend error:', error);
      lastEmailError = error;
      return false;
    }

    console.log('✅ Customer email sent! ID:', data?.id);
    return true;
  } catch (error) {
    console.error('⚠️ Email error:', error);
    lastEmailError = error;
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

    // Send email to customer
    let emailSent = false;
    if (email) {
      emailSent = await sendCustomerEmail({
        id: orderId,
        name,
        mobile,
        email,
        plan,
        amount
      });
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: 'Order created successfully',
      emailSent,
      googleSheetsSync: sheetsSync,
      dbSaved,
      emailError: lastEmailError
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
