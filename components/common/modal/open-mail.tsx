import React from "react";
import { DynamicModal } from "./modal";
import { MailCheck, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type OpenMailProps = {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  onResend?: () => void;
};

const OpenMail: React.FC<OpenMailProps> = ({
  isOpen,
  onClose,
  email = "your email",
  onResend,
}) => {
  const handleOpenMail = () => {
    // You can customize based on email provider
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={onClose}
      header={{ title: "", description: "" }}
    >
      <div className="flex flex-col items-center text-center px-4 py-6">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <MailCheck className="w-7 h-7 text-green-600" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-neutral-900">
          Verify your email
        </h2>

        {/* Description */}
        <p className="text-sm text-neutral-500 mt-2 max-w-sm">
          We’ve sent a verification link to{" "}
          <span className="font-medium text-neutral-800">{email}</span>. Please
          check your inbox and click the link to continue.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2 w-full mt-5">
          {/* Open Mail */}
          <Button
            onClick={handleOpenMail}
            className="w-full h-10 rounded-md bg-brand-primary hover:bg-brand-secondary text-white text-sm font-medium transition"
          >
            Open Mail
          </Button>

          {/* Resend */}
          <Button
            variant={"outline"}
            onClick={onResend}
            className="w-full h-10 rounded-md border text-sm font-medium hover:bg-neutral-100 transition flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Resend Email
          </Button>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-neutral-400 mt-4">
          Didn’t receive the email? Check spam or try resending.
        </p>
      </div>
    </DynamicModal>
  );
};

export default OpenMail;
