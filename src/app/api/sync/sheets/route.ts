import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getGoogleSheetsAuth } from '@/lib/google-sheets'

export async function POST() {
  try {
    const googleSheets = await getGoogleSheetsAuth();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID가 설정되지 않았습니다.');
    }

    // Prisma에서 데이터 가져오기
    const tasks = await prisma.task.findMany({
      include: {
        space: true,
      },
    });

    // 데이터 변환
    const values = tasks.map(task => [
      task.id,
      task.title,
      task.description || '',
      task.dueDate.toISOString(),
      task.isCompleted ? '완료' : '미완료',
      task.space?.name || '',
      task.assignedTo || '',
      task.environment
    ]);

    // Google Sheets에 데이터 쓰기
    await googleSheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A2:H',
      valueInputOption: 'RAW',
      requestBody: {
        values
      }
    });

    return NextResponse.json({ 
      message: "구글 시트 동기화가 완료되었습니다.",
      syncedCount: values.length 
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
} 