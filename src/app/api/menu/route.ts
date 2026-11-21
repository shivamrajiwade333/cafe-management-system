import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cafeId = searchParams.get('cafe') || 'cafe001';
    const items = dataStore.getMenuItems(cafeId);
    return NextResponse.json({ success: true, items });
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

    const created = dataStore.addMenuItem(item, cafe_id || 'cafe001');
    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
