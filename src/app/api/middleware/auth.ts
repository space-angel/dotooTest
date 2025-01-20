import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as unknown;
    
    if (!isJwtPayload(decoded)) {
      throw new Error("유효하지 않은 토큰 페이로드입니다.");
    }

    return decoded.userId;
  } catch {
    throw new Error("유효하지 않은 인증 토큰입니다.");
  }
}

// 타입 가드 함수
function isJwtPayload(payload: unknown): payload is JwtPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "userId" in payload &&
    typeof (payload as JwtPayload).userId === "string"
  );
} 