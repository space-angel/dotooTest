import { NextResponse } from 'next/server'

export async function POST() {
  try {
    throw new Error('Google Sheets 동기화가 비활성화되었습니다.');
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
} 