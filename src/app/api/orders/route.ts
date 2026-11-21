import { NextRequest, NextResponse } from 'next/server';
import { IOrder } from '@/types';
import { dataStore } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cafeId = searchParams.get('cafe') || 'cafe001';
    const orders = dataStore.getOrders(cafeId);
    return NextResponse.json({ success: true, orders });
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

    const saved = await dataStore.placeOrder(order);
    return NextResponse.json({ success: true, order: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
