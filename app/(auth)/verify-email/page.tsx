import { delay } from "@/lib/utils/common-utils";
import EmailVerifiedPage from "./_client/email-verified";
import ExpiredLinkPage from "./_client/expired-link-page";
import { redirect } from "next/navigation";
import { decryptCrypto } from "@/lib/utils/key-decryption";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ iv?: string; content?: string; tag?: string }>;
}) {
  const { iv, content, tag } = await searchParams;

  if (!iv || !content || !tag) {
    redirect("/login");
  }

  // ✅ Build encrypted object
  const encryptedData = {
    iv,
    content,
    tag,
  };

  // ✅ Decrypt
  let email = "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify_email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: encryptedData }),
      cache: "no-store",
    },
  );

  const result = await res.json();

  email = decryptCrypto(encryptedData);

  if (!res.ok) {
    return <ExpiredLinkPage message={result.message} email={email} />;
  }

  return <EmailVerifiedPage />;
}
