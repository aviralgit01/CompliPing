"use client";

import { useEffect, useState, useCallback } from "react";
import {
  User,
  Mail,
  Lock,
  Building2,
  Phone,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { CustomInput } from "@/components/customInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CountryCodeSelector from "@/components/common/country-code-selector";
import Link from "next/link";
import { useSignup } from "@/lib/hooks/api/auth/useAuth";
import { useRouter } from "next/navigation";
import OpenMail from "@/components/common/modal/open-mail";
import { useFormValidation } from "@/lib/hooks/client/use-zod-form";
import { registerSchema } from "@/lib/validation/auth-validation";
import { error } from "console";
interface Country {
  alpha2: string;
  name: string;
  countryCallingCodes: string[];
  minLength: number;
  maxLength: number;
}

export default function SignupPage() {
  const [country, setCountry] = useState<Country | null>(null);
  const { mutate: signup, isPending } = useSignup();
  const { errors, validateField, validateForm } =
    useFormValidation(registerSchema);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    firmName: "",
    icaiNumber: "",
    phone: "",
    city: "",
  });
  const router = useRouter();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);

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
    setSignupData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password, firmName, icaiNumber, phone, city } =
      signupData;
    if (!agreeTerms) return;
    setSubmitClicked(true);
    const valid = validateForm(signupData);
    if (valid.errors) {
      return;
    }

    signup(
      { name, email, password, firmName, icaiNumber, phone, city },
      {
        onSuccess: () => {
          setShowModal(true);
        },
        onError: (error: any) => {
          // console.log("Login failed", error);
        },
      },
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden  from-neutral-50 via-white to-neutral-100">
      {showModal && (
        <OpenMail isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/40 mb-4">
              <Building2 className="w-8 h-8 text-brand-primary" />
            </div>

            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Create Account
            </h1>

            <p className="text-neutral-600">
              Register your CA firm on CompliPing Pro
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 lg:p-8 pt-2 mb-2">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <CustomInput
                label="Full Name"
                type="text"
                value={signupData.name}
                placeholder="Enter your full name"
                iconLeft={<User className="w-4 h-4 text-neutral-400" />}
                inputClassName="h-11 text-sm bg-white border-neutral-200 focus:border-brand-primary"
                labelClassName="text-sm font-medium text-neutral-700 mb-1"
                onChange={(e) =>
                  handleInputChange({ key: "name", value: e.target.value })
                }
                required
                error={errors.name}
              />

              <CustomInput
                label="Email Address"
                type="email"
                value={signupData.email}
                placeholder="Enter your email"
                iconLeft={<Mail className="w-4 h-4 text-neutral-400" />}
                inputClassName="h-11 text-sm bg-white border-neutral-200 focus:border-brand-primary"
                labelClassName="text-sm font-medium text-neutral-700 mb-1"
                onChange={(e) =>
                  handleInputChange({ key: "email", value: e.target.value })
                }
                required
                error={errors.email}
              />

              {/* Phone with Country Code */}
              <CustomInput
                label="Phone Number"
                id="phnumber"
                type="tel"
                value={signupData.phone}
                iconLeft={<Phone className="w-4 h-4 text-neutral-400" />}
                placeholder="Enter phone number"
                inputClassName="h-11 text-sm bg-white border-neutral-200 focus:border-brand-primary"
                labelClassName="text-sm font-medium text-neutral-700 mb-1"
                onChange={(e) =>
                  handleInputChange({ key: "phone", value: e.target.value })
                }
                required
                error={errors.phone}
              />

              <CustomInput
                label="Password"
                type="password"
                value={signupData.password}
                placeholder="Create password"
                iconLeft={<Lock className="w-4 h-4 text-neutral-400" />}
                inputClassName="h-11 text-sm bg-white border-neutral-200 focus:border-brand-primary"
                labelClassName="text-sm font-medium text-neutral-700 mb-1"
                showPasswordToggle
                onChange={(e) =>
                  handleInputChange({ key: "password", value: e.target.value })
                }
                required
                error={errors.password}
              />
              <CustomInput
                label="City"
                type="text"
                value={signupData.city}
                placeholder="Enter your city"
                iconLeft={<MapPin className="w-4 h-4 text-neutral-400" />}
                inputClassName="h-11 text-sm bg-white border-neutral-200 focus:border-brand-primary"
                labelClassName="text-sm font-medium text-neutral-700 mb-1"
                onChange={(e) =>
                  handleInputChange({ key: "city", value: e.target.value })
                }
                required
                error={errors.city}
              />

              <CustomInput
                label="CA Firm Name"
                type="text"
                value={signupData.firmName}
                placeholder="Enter your firm name"
                iconLeft={<Building2 className="w-4 h-4 text-neutral-400" />}
                inputClassName="h-11 text-sm bg-white border-neutral-200 focus:border-brand-primary"
                labelClassName="text-sm font-medium text-neutral-700 mb-1"
                onChange={(e) =>
                  handleInputChange({ key: "firmName", value: e.target.value })
                }
                required
                error={errors.firmName}
              />

              <CustomInput
                label="ICAI Membership Number (optional)"
                type="text"
                value={signupData.icaiNumber}
                placeholder="Enter ICAI number"
                iconLeft={<Building2 className="w-4 h-4 text-neutral-400" />}
                inputClassName="h-11 text-sm bg-white border-neutral-200 focus:border-brand-primary"
                labelClassName="text-sm font-medium text-neutral-700 mb-1"
                onChange={(e) =>
                  handleInputChange({
                    key: "icaiNumber",
                    value: e.target.value,
                  })
                }
                error={errors.icaiNumber}
              />

              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked: boolean) => setAgreeTerms(checked)}
                  className="border-neutral-300 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary text-white"
                />

                <Label htmlFor="terms" className="text-sm text-neutral-600">
                  I agree to{" "}
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
                </Label>
              </div>

              <Button
                type="submit"
                disabled={!agreeTerms || isPending}
                className="w-full h-11 text-base font-semibold bg-brand-primary hover:bg-brand-secondary flex items-center justify-center gap-2"
              >
                {isPending ? "Creating Account......" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-neutral-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-brand-primary hover:text-brand-secondary font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] pointer-events-none -z-10" />
    </div>
  );
}
