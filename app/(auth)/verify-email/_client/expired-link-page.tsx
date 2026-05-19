"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MailWarning } from "lucide-react";
import { useResendEmail } from "@/lib/hooks/api/auth/useAuth";

export default function ExpiredLinkPage({
  email,
  message,
}: {
  email?: string;
  message: string;
}) {
  const { mutate: resend, isPending } = useResendEmail();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    setLoading(true);
    setError("");
    resend(
      { email },
      {
        onSuccess: () => {
          setSent(true);
        },
        onError: (error: any) => {
          setError("Failed to resend verification link. Try again.");
        },
      },
    );
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-5">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100">
            <MailWarning className="text-yellow-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold">Verification Link Expired</h1>

        {/* Description */}
        <p className="text-neutral-600 text-sm">
          {message || "Your email verification link is invalid or has expired."}
        </p>

        {/* Optional email hint */}
        {email && (
          <p className="text-xs text-neutral-500">
            We can resend a new link to{" "}
            <span className="font-medium">{email}</span>
          </p>
        )}

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Button / Success */}
        {!sent ? (
          <Button
            onClick={handleResend}
            disabled={loading}
            className="h-10 text-base mx-auto font-semibold bg-brand-primary hover:bg-brand-secondary flex items-center justify-center gap-2"
          >
            {loading ? "Sending..." : "Resend Verification Link"}
          </Button>
        ) : (
          <p className="text-green-600 text-sm">
            Verification link sent successfully. Please check your email.
          </p>
        )}
      </div>
    </div>
  );
}
