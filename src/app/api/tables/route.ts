import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cafeId = searchParams.get('cafe') || 'cafe001';
    const tables = dataStore.getTables(cafeId);
    return NextResponse.json({ success: true, tables });
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

    const created = dataStore.addTable(table_number, capacity || 4, cafe_id || 'cafe001');
    return NextResponse.json({ success: true, table: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
