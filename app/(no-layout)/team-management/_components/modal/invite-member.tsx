"use client";

import { DynamicModal } from "@/components/common/modal/modal";
import { CustomInput } from "@/components/customInput";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import clsx from "clsx";
import { useFormValidation } from "@/lib/hooks/client/use-zod-form";
import { emailSchema } from "@/lib/validation/common-validation";

const roles = [
  {
    label: "MANAGER",
    role: "MANAGER",
    description: "Can manage members and settings",
  },
  {
    label: "JUNIOR",
    role: "JUNIOR",
    description: "Basic access to client view and statistics",
  },
];

const InviteMember = ({
  isOpen,
  onClose,
  onInvite,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: { email: string; role: string }) => void;
}) => {
  const { errors, validateField } = useFormValidation(emailSchema);
  const [selectedRole, setSelectedRole] = useState("MANAGER");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState({
    email: false,
  });

  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={onClose}
      header={{
        title: "Invite Member",
        description: "Send an invitation to join your organization workspace.",
      }}
      footer={
        <div className="flex-1">
          <Button
            onClick={() => onInvite({ email, role: selectedRole })}
            className="w-full"
          >
            Send Invite
          </Button>
        </div>
      }
    >
      {/* Email */}
      <CustomInput
        value={email}
        onChange={(e) => {
          const value = e.target.value.trim();
          setEmail(value);

          if (touched.email) {
            validateField("email", value);
          }
        }}
        onBlur={() => {
          setTouched((prev) => ({ ...prev, email: true }));
          validateField("email", email);
        }}
        label={"Email Address"}
        error={touched.email ? errors.email : undefined}
      />

      {/* Role Select */}
      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium text-slate-700">Select Role</p>

        <div className="flex gap-3">
          {roles.map((item) => {
            const isActive = selectedRole === item.role;

            return (
              <div
                key={item.role}
                onClick={() => setSelectedRole(item.role)}
                className={clsx(
                  "cursor-pointer flex-1 p-4 rounded-xl border transition-all",
                  isActive
                    ? "border-brand-primary bg-brand-primary/10 shadow-sm"
                    : "border-slate-200 hover:border-brand-primary/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>

                <p className="text-xs text-slate-500 mt-1">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </DynamicModal>
  );
};

export default InviteMember;
