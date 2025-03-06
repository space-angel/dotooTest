import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

// JSON 파일 직접 읽기
const credentials = JSON.parse(
  readFileSync(
    join(process.cwd(), 'config', 'certain-router-448514-m2-e395dc375b02.json'),
    'utf-8'
  )
);

async function syncToSheets() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets('v4');
    const googleSheets = sheets;
    const spreadsheetId = '1mReunWIGqhpSBPGvjbr49AJhok5FDg-SKG_lxCn9uOc';

    // 모든 데이터 가져오기
    const [users, spaces, tasks] = await Promise.all([
      prisma.user.findMany(),
      prisma.space.findMany(),
      prisma.task.findMany({
        include: {
          space: true,
          user: true,
        },
      })
    ]);

    console.log('데이터 조회 완료:');
    console.log(`- 사용자: ${users.length}명`);
    console.log(`- 공간: ${spaces.length}개`);
    console.log(`- 할일: ${tasks.length}개`);

    // 데이터 변환
    const userValues = users.map(user => [
      user.id,
      user.email,
      user.name || '',
      user.createdAt.toISOString(),
      user.updatedAt.toISOString()
    ]);

    const spaceValues = spaces.map(space => [
      space.id,
      space.name,
      space.createdAt.toISOString(),
      space.updatedAt.toISOString()
    ]);

    const taskValues = tasks.map(task => [
      task.id,
      task.title,
      task.description || '',
      task.dueDate.toISOString(),
      task.isCompleted ? '완료' : '미완료',
      task.space?.name || '',
      task.user?.name || '',
      task.assignedTo || '',
      task.environment,
      task.createdAt.toISOString(),
      task.updatedAt.toISOString()
    ]);

    // 헤더 정의
    const userHeaders = [['ID', '이메일', '이름', '생성일', '수정일']];
    const spaceHeaders = [['ID', '공간 이름', '생성일', '수정일']];
    const taskHeaders = [['ID', '제목', '설명', '마감일', '상태', '공간', '작성자', '담당자', '환경', '생성일', '수정일']];

    // 각 시트에 데이터 쓰기
    const updates = [
      {
        range: 'A1:E',
        values: [...userHeaders, ...userValues]
      },
      {
        range: 'A1:D',
        values: [...spaceHeaders, ...spaceValues]
      },
      {
        range: 'A1:K',
        values: [...taskHeaders, ...taskValues]
      }
    ];

    // 각 시트별로 업데이트
    for (const [index, update] of updates.entries()) {
      const sheetName = ['Users', 'Spaces', 'Tasks'][index];
      console.log(`${sheetName} 시트 업데이트 중...`);
      
      try {
        await googleSheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!${update.range}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: update.values
          }
        });
        console.log(`${sheetName} 시트 업데이트 완료`);
      } catch (error) {
        console.error(`${sheetName} 시트 업데이트 실패:`, error.message);
      }
    }

    console.log('\n전체 동기화 완료!');

  } catch (error) {
    console.error('동기화 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncToSheets(); 