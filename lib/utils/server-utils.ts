// lib/auth.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserFromToken() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  console.log(token, "---token");
  console.log(process.env.JWT_SECRET);
  
  if (!token) return null;


  try {
    
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      tenantId: string | null;
      role: string;
    };
  } catch {
    console.log("Error while decoding token");
    return null;
  }
}
