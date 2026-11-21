import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { OrderStatus } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const cafeId = searchParams.get('cafe') || 'cafe001';

    const order = serverStore.getOrderById(id, cafeId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { 
        status: 404,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
      });
    }

    return NextResponse.json({ success: true, order }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, cafe_id } = body;

    const validStatuses: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'served', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const updated = await serverStore.updateOrderStatus(id, status as OrderStatus, cafe_id || 'cafe001');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
