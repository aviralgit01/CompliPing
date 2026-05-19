"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MailWarning } from "lucide-react";

export default function ExpiredLinkPage({ email }: { email?: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    try {
      setLoading(true);
      setError("");

      await fetch("/api/auth/resend-reset-link", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setSent(true);
    } catch (err) {
      setError("Failed to resend link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-5">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100">
            <MailWarning className="text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold">Link Expired</h1>

        {/* Description */}
        <p className="text-neutral-600 text-sm">
          This password reset link is invalid or has expired.
        </p>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Button / Success */}
        {!sent ? (
          <Button
            onClick={handleResend}
            disabled={loading}
            className="h-10 text-base mx-auto font-semibold bg-brand-primary hover:bg-brand-secondary flex items-center justify-center gap-2"
          >
            {loading ? "Sending..." : "Resend Reset Link"}
          </Button>
        ) : (
          <p className="text-green-600 text-sm">
            Reset link sent successfully. Please check your email.
          </p>
        )}
      </div>
    </div>
  );
}
