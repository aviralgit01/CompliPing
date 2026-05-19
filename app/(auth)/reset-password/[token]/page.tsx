// app/reset-password/[token]/page.tsx

import { redirect } from "next/navigation";
import ResetPasswordClient from "../_client/reset-password-client";
import ExpiredLinkPage from "../_client/expired-link-page";

export default async function Page({ params }: { params: { token?: string } }) {
  const token = params?.token;

  if (!token || token.trim() === "") {
    redirect("/login");
  }

  // 🔥 Validate token (DB/JWT)
  const result = { email: "", valid: false };

  if (!result.valid) {
    return <ExpiredLinkPage email={result.email} />;
  }

  return <ResetPasswordClient token={token} />;
}
