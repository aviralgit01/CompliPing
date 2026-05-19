"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function EmailVerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000); // ⏱️ 3 sec delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center">
          <CheckCircle2 className="text-green-500 w-12 h-12" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold">Email Verified Successfully</h1>

        {/* Description */}
        <p className="text-neutral-600 text-sm">
          Your account has been verified. Redirecting to login...
        </p>
      </div>
    </div>
  );
}
