import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

// IMPORTANT: decode as HEX (not utf-8)
const SECRET_KEY = Buffer.from(process.env.ENCRYPTION_KEY as string, "hex");
console.log(SECRET_KEY.length);
export function encryptEmail(email: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(email, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
    tag: authTag.toString("hex"),
  };
}

