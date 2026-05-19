// components/profile/security-tab.tsx
"use client";

import React, { useState } from "react";
import {
  Lock,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Key,
  Shield,
} from "lucide-react";
import { CustomInput } from "@/components/customInput";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "@/lib/hooks/api/auth/useAuth";
import { showToast } from "@/components/common/toast";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecurityTab: React.FC = () => {
  const [form, setForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState(false);

  const {
    mutate: changePassword,
    isError,
    isPending,
    error,
  } = useChangePassword();

  // Simplified password validation - only check length
  const isPasswordValid = form.newPassword.length >= 8;
  const passwordsMatch =
    form.newPassword === form.confirmPassword && form.confirmPassword !== "";

  const handleInputChange =
    (field: keyof PasswordForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setSuccess(false);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      showToast.error("All fields are required");
      return;
    }

    if (!isPasswordValid) {
      showToast.error("Password must be at least 8 characters long");
      return;
    }

    if (!passwordsMatch) {
      showToast.error("New passwords do not match");
      return;
    }

    changePassword({
      password: form.currentPassword,
      new_password: form.newPassword,
      confirm_password: form.confirmPassword,
    });
  };

  const handleReset = () => {
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setSuccess(false);
  };

  const getErrorMessage = (err: unknown) => {
    if (!err) return "Something went wrong";
    if (typeof err === "string") return err;

    const anyErr = err as any;
    const msg =
      anyErr?.response?.data?.message ||
      anyErr?.response?.data?.error ||
      anyErr?.message;

    if (typeof msg === "string") return msg;
    if (msg && typeof msg === "object") return JSON.stringify(msg);
    return "Something went wrong";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Security Settings
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage your account security and password
          </p>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Change Password</h4>
            <p className="text-sm text-gray-600">
              Update your account password
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Password changed successfully!
                </p>
                <p className="text-xs text-green-600">
                  Your password has been updated.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-xs text-red-600">text </p>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Form */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <CustomInput
              label="Current Password"
              placeholder="Enter your current password"
              error={
                error && !form.currentPassword
                  ? "Current password is required"
                  : ""
              }
              type="password"
              showPasswordToggle
              onChange={handleInputChange("currentPassword")}
              value={form.currentPassword}
            />

            {/* New Password */}
            <CustomInput
              label="New Password"
              placeholder="Enter your new password (minimum 8 characters)"
              error={
                form.newPassword !== "" && !isPasswordValid
                  ? "Password must be at least 8 characters long"
                  : ""
              }
              type="password"
              showPasswordToggle
              onChange={handleInputChange("newPassword")}
              value={form.newPassword}
            />

            {/* Simple Password Length Indicator */}
            {form.newPassword && (
              <div
                className={`flex items-center gap-2 text-xs ${
                  isPasswordValid ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPasswordValid ? <Check size={12} /> : <X size={12} />}
                <span>
                  {isPasswordValid
                    ? `Password length: ${form.newPassword.length} characters ✓`
                    : `Password length: ${form.newPassword.length}/8 characters`}
                </span>
              </div>
            )}

            {/* Confirm Password */}
            <CustomInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              error={
                form.confirmPassword !== "" && !passwordsMatch
                  ? "Passwords do not match"
                  : ""
              }
              type="password"
              showPasswordToggle
              onChange={handleInputChange("confirmPassword")}
              value={form.confirmPassword}
            />

            {/* Password Match Indicator */}
            {form.confirmPassword && (
              <div
                className={`flex items-center gap-2 text-xs ${
                  passwordsMatch ? "text-green-600" : "text-red-600"
                }`}
              >
                {passwordsMatch ? <Check size={12} /> : <X size={12} />}
                <span>
                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 flex-wrap">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium w-full sm:w-auto"
                disabled={isPending}
              >
                Reset
              </button>
              <Button
                type="submit"
                disabled={
                  isPending ||
                  !isPasswordValid ||
                  !passwordsMatch ||
                  !form.currentPassword
                }
                className="w-full sm:w-auto"
              >
                <Key size={16} />
                {isPending ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">Account Secure</span>
          </div>
          <p className="text-sm text-gray-600">
            Your account is protected with a secure password
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Data Protected</span>
          </div>
          <p className="text-sm text-gray-600">
            Your personal information is secure and encrypted
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Access Controlled</span>
          </div>
          <p className="text-sm text-gray-600">
            Only you can access your account information
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
