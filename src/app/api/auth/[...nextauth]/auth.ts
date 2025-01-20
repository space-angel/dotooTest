import { getServerSession } from "next-auth";
import { authOptions } from "./route";

export function auth() {
  return getServerSession(authOptions);
} 