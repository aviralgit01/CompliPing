"use client";

import { useState } from "react";
import { ArrowRight, Building2, Lock } from "lucide-react";
import { CustomInput } from "@/components/customInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResetPasswordClient({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || password !== confirmPassword) return;

    console.log("Reset password with token:", token, password);

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden from-neutral-50 via-white to-neutral-100">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/40 mb-6">
              <Building2 className="w-8 h-8 text-brand-primary" />
            </div>

            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Reset Password
            </h1>

            <p className="text-neutral-600">
              Create a new secure password for your account
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 lg:p-8 pt-2 mb-2">
            {!submitted ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <CustomInput
                  label="Password"
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  iconLeft={<Lock className="w-4 h-4 text-neutral-400" />}
                  inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-brand-primary focus:ring-0"
                  labelClassName="text-sm font-medium text-neutral-700 mb-2"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  showPasswordToggle
                />

                <CustomInput
                  label="Confirm Password"
                  id="password"
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm your password"
                  iconLeft={<Lock className="w-4 h-4 text-neutral-400" />}
                  inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-brand-primary focus:ring-0"
                  labelClassName="text-sm font-medium text-neutral-700 mb-2"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  showPasswordToggle
                />

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-brand-primary hover:bg-brand-secondary flex items-center justify-center gap-2"
                  >
                    Submit
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <p className="text-neutral-700 text-sm">
                  If an account with this email exists, we have sent a password
                  reset link.
                </p>

                <Link
                  href="/login"
                  className="text-brand-primary hover:text-brand-secondary font-medium"
                >
                  Back to login
                </Link>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-sm text-neutral-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-brand-primary hover:text-brand-secondary font-medium"
              >
                Sign in
              </Link>
            </p>

            <div className="pt-4 border-t border-neutral-200/50">
              <p className="text-xs text-neutral-500">
                By continuing you agree to our{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-brand-primary hover:underline"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-brand-primary hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] pointer-events-none -z-10" />
    </div>
  );
}
