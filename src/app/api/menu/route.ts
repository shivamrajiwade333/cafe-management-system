import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cafeId = searchParams.get('cafe') || 'cafe001';
    const items = serverStore.getMenuItems(cafeId);
    return NextResponse.json({ success: true, items }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { item, cafe_id } = body;

    if (!item || !item.name || !item.price) {
      return NextResponse.json({ success: false, error: 'Name and price required' }, { status: 400 });
    }

    const created = serverStore.addMenuItem(item, cafe_id || 'cafe001');
    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { item, cafe_id } = body;

    if (!item || !item.id) {
      return NextResponse.json({ success: false, error: 'Item ID required' }, { status: 400 });
    }

    const updated = serverStore.updateMenuItem(item, cafe_id || 'cafe001');
    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, action, cafe_id } = body;

    if (action === 'toggle-availability') {
      const isAvailable = serverStore.toggleItemAvailability(itemId, cafe_id || 'cafe001');
      return NextResponse.json({ success: true, is_available: isAvailable });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('id');
    const cafeId = searchParams.get('cafe') || 'cafe001';

    if (!itemId) {
      return NextResponse.json({ success: false, error: 'Item id required' }, { status: 400 });
    }

    serverStore.deleteMenuItem(itemId, cafeId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
