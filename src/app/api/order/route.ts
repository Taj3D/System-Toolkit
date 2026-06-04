import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    // Log for debugging
    console.log('✅ Order created:', order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order created successfully'
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
