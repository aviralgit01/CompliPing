import { redirect } from "next/navigation";
import { decryptCrypto } from "@/lib/utils/key-decryption";
import ResetPasswordForm from "./_client/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ iv?: string; content?: string; tag?: string }>;
}) {
  const { iv, content, tag } = await searchParams;

  if (!iv || !content || !tag) {
    redirect("/login");
  }

  const encryptedData = {
    iv,
    content,
    tag,
  };

  let email = "";

  try {
    email = decryptCrypto(encryptedData);
  } catch {
    redirect("/login");
  }

  if (!email) {
    redirect("/login");
  }

  return <ResetPasswordForm email={email} />;
}
