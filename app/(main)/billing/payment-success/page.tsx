"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-green-100 bg-white p-8 shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Payment Successful
        </h1>

        <p className="text-slate-600 mb-6">
          Your subscription has been activated successfully.
        </p>

        <div className="flex items-center justify-center gap-5">
          <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>

          <Button onClick={() => router.push("transaction_history")}>
            Transaction History
          </Button>
        </div>
      </div>
    </div>
  );
}
