"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User, Lock, Building2, ArrowRight } from "lucide-react";
import { CustomInput } from "@/components/customInput";
import Link from "next/link";
import { useState } from "react";
import { useLogin } from "@/lib/hooks/api/auth/useAuth";
import { useRouter } from "next/navigation";
import { useFormValidation } from "@/lib/hooks/client/use-zod-form";
import { loginSchema } from "@/lib/validation/auth-validation";

export default function LoginPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [submitClicked, setSubmitClicked] = useState(false);
  const { errors, validateField, validateForm } =
    useFormValidation(loginSchema);
  const [rememberMe, setRememberMe] = useState(true);
  const { mutate: login, isPending } = useLogin();
  const router = useRouter();
  const handleInputChange = ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }) => {
    if (submitClicked) {
      validateField(key as any, value);
    }

    setLoginData((prev) => ({ ...prev, [key]: value }));
  };

  const canLogin = loginData.email && loginData.password;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitClicked(true);

    const valid = validateForm(loginData);
    console.log(valid);
    if (valid.errors) {
      return;
    }

    login(
      {
        email: loginData.email,
        password: loginData.password,
      },
      {
        onSuccess: () => {
          console.log("Login success");
          router.push("/dashboard");
        },
        onError: (error: any) => {
          // console.log("Login failed", error);
        },
      },
    );
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
              Welcome Back
            </h1>

            <p className="text-neutral-600">
              Sign in to your CompliPingPro account
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 lg:p-8 pt-2 mb-2">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <CustomInput
                label="Email Address"
                value={loginData.email}
                id="email"
                type="email"
                placeholder="Enter your email"
                iconLeft={<User className="w-4 h-4 text-neutral-400" />}
                inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-brand-primary focus:ring-0"
                labelClassName="text-sm font-medium text-neutral-700 mb-2"
                onChange={(e) =>
                  handleInputChange({ key: "email", value: e.target.value })
                }
                required
                error={errors.email}
              />

              <CustomInput
                label="Password"
                value={loginData.password}
                id="password"
                type="password"
                placeholder="Enter your password"
                iconLeft={<Lock className="w-4 h-4 text-neutral-400" />}
                inputClassName="h-12 text-base bg-white border-neutral-200 focus:border-brand-primary focus:ring-0"
                labelClassName="text-sm font-medium text-neutral-700 mb-2"
                showPasswordToggle
                onChange={(e) =>
                  handleInputChange({ key: "password", value: e.target.value })
                }
                required
                error={errors.password}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) =>
                      setRememberMe(checked)
                    }
                    className="border-neutral-300 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-neutral-600 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>

                <Link
                  href="/forgot-password"
                  className="text-sm text-brand-primary hover:text-brand-secondary font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={!canLogin}
                className="w-full h-12 text-base font-semibold bg-brand-primary hover:bg-brand-secondary transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{isPending ? "Signing in..." : "Sign In"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-sm text-neutral-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-brand-primary hover:text-brand-secondary font-medium transition-colors"
              >
                Create account
              </Link>
            </p>

            <div className="pt-4 border-t border-neutral-200/50">
              <p className="text-xs text-neutral-500">
                By signing in, you agree to our{" "}
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
