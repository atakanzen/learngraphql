import { verify } from "jsonwebtoken";

export interface AuthTokenPayload {
  userId: string;
}

export function authenticate(authHeader: string): AuthTokenPayload {
  const token = authHeader.replace("Bearer", "");
  if (!token) {
    throw new Error("No token found");
  }

  return verify(token, process.env.APP_SECRET as string) as AuthTokenPayload;
}
