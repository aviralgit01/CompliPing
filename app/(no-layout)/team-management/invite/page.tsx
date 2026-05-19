"use client";

import React, { useState } from "react";
import { CustomInput } from "@/components/customInput";
import { Button } from "@/components/ui/button";
import { User, Lock, ArrowRight } from "lucide-react";
import { useFormValidation } from "@/lib/hooks/client/use-zod-form";
import { z } from "zod";
import { common } from "@/lib/validation/common-validation";
import { useTeam } from "@/lib/hooks/api/useTeam";
import { useRouter, useSearchParams } from "next/navigation";
import { invalid } from "moment-timezone";
import InvalidLink from "@/components/common/invalid-link";

const schema = z.object({
  name: common.name,
  password: common.password,
});

const AcceptInvite = () => {
  const router = useRouter();
  const { acceptInvite } = useTeam();
  const [form, setForm] = useState({
    name: "",
    password: "",
  });
  const searchParams = useSearchParams();

  const iv = searchParams.get("iv");
  const content = searchParams.get("content");
  const tag = searchParams.get("tag");

  const [touched, setTouched] = useState({
    name: false,
    password: false,
  });

  const { errors, validateField, validateForm } = useFormValidation(schema);
  const [showInvalid, setInvalid] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // validate on change only if already touched
    if (touched[key]) {
      validateField(key, value);
    }
  };

  const handleBlur = (key: keyof typeof form) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    validateField(key, form[key]);
  };

  const handleSubmit = () => {
    const result = validateForm(form);
    const tokenPayload = {
      iv: searchParams.get("iv"),
      content: searchParams.get("content"),
      tag: searchParams.get("tag"),
    };

    if (!result.success) return;

    const finalData = {
      ...form,
      token: JSON.stringify(tokenPayload),
    };

    console.log("Joining with:", finalData);
    acceptInvite(finalData, {
      onSuccess: () => {
        router.replace("/login");
      },
      onError: (err) => {
        setInvalid(true);
      },
    });
  };

  const isDisabled =
    !form.name || !form.password || Object.keys(errors).length > 0;

  if (showInvalid) {
    return <InvalidLink />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome to CompliPing Pro
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete your profile to join your workspace
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <CustomInput
            label="Full Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Enter your full name"
            iconLeft={<User className="w-4 h-4 text-slate-400" />}
            error={touched.name ? errors.name : undefined}
          />

          <CustomInput
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            placeholder="Create a password"
            iconLeft={<Lock className="w-4 h-4 text-slate-400" />}
            showPasswordToggle
            error={touched.password ? errors.password : undefined}
          />

          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full h-11 mt-4 text-base font-semibold"
          >
            Proceed to Join <ArrowRight strokeWidth={3} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
