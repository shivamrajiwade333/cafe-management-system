import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cafeId = searchParams.get('cafe') || 'cafe001';
    const tables = serverStore.getTables(cafeId);
    return NextResponse.json({ success: true, tables }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { table_number, capacity, cafe_id } = body;

    if (!table_number) {
      return NextResponse.json({ success: false, error: 'table_number required' }, { status: 400 });
    }

    const created = serverStore.addTable(table_number, capacity || 4, cafe_id || 'cafe001');
    return NextResponse.json({ success: true, table: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
