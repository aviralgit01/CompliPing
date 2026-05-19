"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Zap } from "lucide-react";
import { showToast } from "@/components/common/toast";
import { useGetPlans, usePostSubscription } from "@/lib/hooks/api/useBilling";
import { DropdownSearch } from "@/components/ui/searchableDropdown";
import { loadRazorpayScript } from "@/lib/validation/loadRazorpay";
import { useGetUserProfile } from "@/lib/hooks/api/auth/useAuth";
import { useRouter } from "next/navigation";

type Plan = {
  id: string;
  razor_pay_plan_id?: string | null;
  name: string;
  currency: string;
  price: number;
  description: string;
  interval?: string | null;
  interval_count?: number | null;
  trailDays?: number | null;
  status?: string | null;
  active?: boolean;
};

function Page() {
  const router = useRouter();
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { isIndia } = useMemo(() => {
    if (typeof window === "undefined") {
      return { isIndia: false, userTimezone: "UTC" };
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      isIndia: tz.includes("Kolkata") || tz.includes("Calcutta"),
      userTimezone: tz,
    };
  }, []);

  const currencySymbol = isIndia ? "₹" : "$";

  const { data: profileData } = useGetUserProfile();

  const { data: plansData, isLoading: plansLoading } = useGetPlans({
    page: 1,
    limit: 100,
    search: "",
  });

  const { mutateAsync: postSubscription, isPending } = usePostSubscription();

  const plans: Plan[] = plansData?.data || [];

  useEffect(() => {
    if (!plans.length || activePlan) return;

    const defaultPlan =
      plans.find((plan) => plan.status !== "free" && plan.active) ||
      plans.find((plan) => plan.status !== "free") ||
      plans[0];

    setActivePlan(defaultPlan || null);
  }, [plans, activePlan]);

  const dropdownOptions = plans
    .filter((plan) => plan.status !== "free")
    .map((plan) => ({
      label: `${plan.name} - ${currencySymbol} ${plan.price}`,
      value: plan.id,
      raw: plan,
    }));

  const planPrice = activePlan?.price || 0;
  const gstRate = isIndia ? 0.18 : 0;
  const gstAmount = planPrice * gstRate;
  const grandTotal = planPrice + gstAmount;

  const planInterval = (interval: string | null | undefined): string => {
    switch (interval) {
      case "daily":
        return "Day";
      case "weekly":
        return "Week";
      case "monthly":
        return "Month";
      case "yearly":
        return "Year";
      default:
        return "Month";
    }
  };

  const handlePayment = async () => {
    if (!activePlan) {
      showToast.error("Please select a plan");
      return;
    }

    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      showToast.error("Razorpay SDK failed to load");
      return;
    }

    postSubscription(
      {
        razor_pay_plan_id: activePlan.razor_pay_plan_id,
        plan_id: activePlan.id,
        total_count: 1,
        quantity: 1,
        amount: planPrice,
        notes: {
          userId: profileData?.id,
          userEmail: profileData?.email,
          userName: profileData?.name,
        },
        status: "ACTIVE",
      },
      {
        onSuccess: (payload) => {
          showToast.success("Subscription created successfully");

          const subscriptionId = payload?.data?.subscription_id;

          if (!subscriptionId) {
            showToast.error("Subscription id not found");
            return;
          }

          const options = {
            key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID,
            subscription_id: subscriptionId,
            description: activePlan.name,
            name: "Atticbits Solution Pvt Ltd.",
            currency: activePlan.currency || "INR",
            handler: () => {
              showToast.success("Payment successful");
              router.push("/billing/payment-success");
            },
            theme: { color: "#2563eb" },
            prefill: {
              name: profileData?.name,
              email: profileData?.email,
              contact: profileData?.tenant?.phone,
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        },
        onError: (error: any) => {
          showToast.error(
            error?.response?.data?.message || "Failed to create subscription",
          );
        },
      },
    );
  };

  if (plansLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen  bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 pb-32">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {activePlan?.name || "Loading Plan..."}
              </h2>
              <p className="text-slate-500 text-sm max-w-md">
                {activePlan?.description ||
                  "Upgrade your workspace with our premium features."}
              </p>
              {activePlan && (
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    Payment via: Razorpay
                  </span>
                </div>
              )}
            </div>

            <Button
              disabled={paymentLoading}
              onClick={handlePayment}
              variant={"default"}
              className="w-[clamp(10rem,30%,12rem)] py-3 text-lg hidden md:flex"
            >
              <Zap />
              Pay Now
            </Button>
          </div>

          <div className="my-6 flex items-baseline gap-2">
            <h1 className="text-5xl font-extrabold text-black">
              {currencySymbol} {planPrice}
            </h1>
            {activePlan && (
              <p className="text-neutral-500 text-sm">
                per {activePlan?.interval_count || 1}{" "}
                {planInterval(activePlan?.interval)}
              </p>
            )}
          </div>

          <div className="mt-6 mb-6 pt-4 border-t border-neutral-200 bg-slate-50/50 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <p className="text-neutral-600 text-sm font-medium">
                Selected Plan
              </p>
              <p className="text-neutral-900 font-semibold">
                {currencySymbol} {planPrice.toFixed(2)}
              </p>
            </div>

            {isIndia && (
              <div className="flex justify-between items-center mb-2">
                <p className="text-neutral-600 text-sm">GST (18%)</p>
                <p className="text-neutral-900 font-semibold">
                  {currencySymbol} {gstAmount.toFixed(2)}
                </p>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <p className="text-neutral-800 text-lg font-bold">
                Total Payable:
              </p>
              <p className="md:text-3xl text-xl font-extrabold text-blue-600">
                {currencySymbol} {grandTotal.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 gap-4 flex-wrap mt-10">
            <div className="w-full max-w-xl">
              <h2 className="text-2xl font-bold text-slate-900">
                Plan Details
              </h2>
              <p className="text-sm text-slate-600 mt-1 mb-4">
                Search and select a plan
              </p>
              <DropdownSearch
                options={dropdownOptions}
                selected={activePlan?.id || ""}
                placeholder="Search plans (Pro, Nice, etc.)..."
                onChange={(selected: string | string[]) => {
                  const value =
                    typeof selected === "string" ? selected : selected[0];
                  const selectedPlan = plans.find((plan) => plan.id === value);
                  setActivePlan(selectedPlan || null);
                }}
                showSearch={true}
                loading={plansLoading}
              />
            </div>
          </div>

          <div className="md:hidden">
            <Button
              disabled={paymentLoading}
              onClick={handlePayment}
              variant={"default"}
              className="w-full py-3 text-lg"
            >
              <Zap />
              Pay Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
