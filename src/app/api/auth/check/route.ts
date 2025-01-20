import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const verified = jwt.verify(token.value, JWT_SECRET);
    return NextResponse.json({ authenticated: true, user: verified });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
} 