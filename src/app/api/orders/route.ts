import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

// Force dynamic execution so Next.js doesn't cache GET responses
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cafeId = searchParams.get('cafe') || 'cafe001';
    const orders = serverStore.getOrders(cafeId);
    return NextResponse.json({ success: true, orders }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order } = body;

    if (!order || !order.table_number || !order.items || order.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order payload. Missing items or table number.' },
        { status: 400 }
      );
    }

    const saved = await serverStore.placeOrder(order);
    return NextResponse.json({ success: true, order: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
