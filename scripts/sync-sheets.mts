import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import credentials from '../config/certain-router-448514-m2-e395dc375b02.json' assert { type: "json" };

const prisma = new PrismaClient();

async function syncToSheets() {
  try {
    // ... 나머지 코드는 동일 ...
  } catch (error) {
    console.error('동기화 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncToSheets(); 