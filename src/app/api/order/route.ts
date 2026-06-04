import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ============ GOOGLE SHEETS CONFIGURATION ============
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';

// ============ WEB3FORMS CONFIGURATION ============
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || '6a0c50ef-51fb-448d-a055-8086e0185a9a';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'conceptbd.net@gmail.com';

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

// ============ EMAIL FUNCTIONS (WEB3FORMS) ============
async function sendWelcomeEmail(order: {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  plan: string;
  amount: number;
}) {
  console.log(`📧 Sending email via Web3Forms to: ${order.email || NOTIFICATION_EMAIL}`);

  const planName = PLAN_NAMES[order.plan] || order.plan;
  const orderIdShort = order.id.slice(-8).toUpperCase();

  // Email to customer (if email provided)
  if (order.email) {
    try {
      const customerEmailData = new URLSearchParams({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `🎉 অর্ডার সফল - System Toolkit (#${orderIdShort})`,
        email: order.email,
        name: order.name,
        from_name: 'System Toolkit - NextGen Digital Studio',
        
        // Email content
        message: `
আপনার অর্ডার সফলভাবে গৃহীত হয়েছে!

📦 অর্ডার বিবরণ:
━━━━━━━━━━━━━━━━━━━━━
অর্ডার আইডি: #${orderIdShort}
নাম: ${order.name}
মোবাইল: ${order.mobile}
ইমেইল: ${order.email}
প্ল্যান: ${planName}
মূল্য: ৳${order.amount}
━━━━━━━━━━━━━━━━━━━━━

📱 পেমেন্ট তথ্য:
বিকাশ/নগদ: +880 1711-731354
পেমেন্ট করুন এবং স্ক্রিনশট WhatsApp এ পাঠান।

💬 WhatsApp: https://wa.me/8801711731354

পেমেন্ট সম্পন্ন হলে ১ ঘন্টার মধ্যে আপনি সফটওয়্যার অ্যাক্সেস পাবেন।

ধন্যবাদান্ত,
NextGen Digital Studio
        `.trim()
      });

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: customerEmailData.toString()
      });

      const result = await response.json();
      if (result.success) {
        console.log('✅ Customer email sent via Web3Forms');
      } else {
        console.error('⚠️ Customer email failed:', result.message);
      }
    } catch (error) {
      console.error('⚠️ Customer email error:', error);
    }
  }

  // Email notification to admin
  try {
    const adminEmailData = new URLSearchParams({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `🔔 নতুন অর্ডার - System Toolkit (#${orderIdShort})`,
      email: NOTIFICATION_EMAIL,
      name: 'Admin - NextGen Digital Studio',
      from_name: 'System Toolkit Order System',
      
      message: `
🎉 নতুন অর্ডার এসেছে!

📦 অর্ডার বিবরণ:
━━━━━━━━━━━━━━━━━━━━━
অর্ডার আইডি: #${orderIdShort}
তারিখ: ${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}

👤 গ্রাহক তথ্য:
নাম: ${order.name}
মোবাইল: ${order.mobile}
ইমেইল: ${order.email || 'N/A'}

📋 অর্ডার তথ্য:
প্ল্যান: ${planName}
মূল্য: ৳${order.amount}
━━━━━━━━━━━━━━━━━━━━━

যোগাযোগ করুন: +880 1711-731354
WhatsApp: https://wa.me/8801711731354

NextGen Digital Studio
      `.trim()
    });

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: adminEmailData.toString()
    });

    const result = await response.json();
    if (result.success) {
      console.log('✅ Admin notification email sent via Web3Forms');
      return true;
    } else {
      console.error('⚠️ Admin email failed:', result.message);
      return false;
    }
  } catch (error) {
    console.error('⚠️ Admin email error:', error);
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

    // Try to save to database (may fail on serverless)
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

    // Send to Google Sheets (primary storage for production)
    const sheetsSync = await sendToGoogleSheets({
      id: orderId,
      name,
      mobile,
      email: email || null,
      plan,
      amount,
      createdAt: orderDate
    });

    // Send welcome email via Web3Forms
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
