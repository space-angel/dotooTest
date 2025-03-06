import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';
import { OAuth2Client } from 'google-auth-library';

const credentials = JSON.parse(
  readFileSync(
    join(process.cwd(), 'config', 'certain-router-448514-m2-e395dc375b02.json'),
    'utf-8'
  )
);

export const getGoogleSheetsAuth = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient() as OAuth2Client;
    const googleSheets = google.sheets({
      version: 'v4',
      auth: authClient
    });

    return googleSheets;
  } catch (error) {
    console.error('Google Sheets 인증 오류:', error);
    throw new Error('Google Sheets 인증 실패');
  }
}; 