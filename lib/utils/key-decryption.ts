import * as crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

// ✅ SAME as encrypt (hex decoding)
const SECRET_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

export function decryptCrypto(encryptedData: {
  iv: string;
  content: string;
  tag: string;
}) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    SECRET_KEY,
    Buffer.from(encryptedData.iv, "hex"),
  );

  decipher.setAuthTag(Buffer.from(encryptedData.tag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData.content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
