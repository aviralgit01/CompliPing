"use client";

import { Button } from "@/components/ui/button";
import { Lock, Mail, Building2, ArrowRight } from "lucide-react";
import { CustomInput } from "@/components/customInput";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormValidation } from "@/lib/hooks/client/use-zod-form";
import { useForgetPasswordReset } from "@/lib/hooks/api/auth/useAuth";
import { resetPasswordSchema } from "@/lib/validation/auth-validation";

export default function ResetPasswordForm({ email }: { email: string }) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [submitClicked, setSubmitClicked] = useState(false);

  const { errors, validateField, validateForm } =
    useFormValidation(resetPasswordSchema);

  const { mutate: resetPassword, isPending } = useForgetPasswordReset();
  const router = useRouter();

  const handleInputChange = ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }) => {
    const updatedData = { ...formData, [key]: value };
    setFormData(updatedData);

    if (submitClicked) {
      validateField(key as any, value);
      validateForm(updatedData);
    }
  };

  const canSubmit =
    !!email && !!formData.password && !!formData.confirmPassword && !isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitClicked(true);

    const valid = validateForm(formData);
    if (valid.errors) return;

    resetPassword(
      {
        email,
        password: formData.password,
        conform_password: formData.confirmPassword,
      },
      {
        onSuccess: () => {
          router.push("/login");
        },
      },
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-neutral-50 via-white to-neutral-100">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/40 mb-6">
              <Building2 className="w-8 h-8 text-brand-primary" />
            </div>

            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Reset Password
            </h1>

            <p className="text-neutral-600">
              Set a new password for your account
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 lg:p-8 pt-2 mb-2">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <CustomInput
                label="Email Address"
                value={email}
                id="email"
                type="email"
                disabled
                iconLeft={<Mail className="w-4 h-4 text-neutral-400" />}
                inputClassName="h-12 text-base bg-neutral-100 border-neutral-200 text-neutral-500"
                labelClassName="text-sm font-medium text-neutral-700 mb-2"
              />

              <CustomInput
                label="New Password"
                value={formData.password}
                id="password"
                type="password"
                placeholder="Enter new password"
                iconLeft={<Lock className="w-4 h-4 text-neutral-400" />}
                inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-brand-primary focus:ring-0"
                labelClassName="text-sm font-medium text-neutral-700 mb-2"
                showPasswordToggle
                onChange={(e) =>
                  handleInputChange({
                    key: "password",
                    value: e.target.value,
                  })
                }
                required
                error={errors.password}
              />

              <CustomInput
                label="Confirm Password"
                value={formData.confirmPassword}
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                iconLeft={<Lock className="w-4 h-4 text-neutral-400" />}
                inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-brand-primary focus:ring-0"
                labelClassName="text-sm font-medium text-neutral-700 mb-2"
                showPasswordToggle
                onChange={(e) =>
                  handleInputChange({
                    key: "confirmPassword",
                    value: e.target.value,
                  })
                }
                required
                error={errors.confirmPassword}
              />

              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-12 text-base font-semibold bg-brand-primary hover:bg-brand-secondary transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{isPending ? "Resetting..." : "Reset Password"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-neutral-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-brand-primary hover:text-brand-secondary font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>

            <div className="pt-4 border-t border-neutral-200/50">
              <p className="text-xs text-neutral-500">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-brand-primary hover:underline"
                >
                  Terms of Service
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
