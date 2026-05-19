import { Button } from "@/components/ui/button";
import { Plus, MessageCircleMore } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  month: string;
  year: string | number;
  onExport: () => void;
  onNewFiling: () => void;
  onBoardingCompleted: boolean;
  onNavigateOnboard: () => void;
}

function DashboardHeader({
  month,
  year,
  onNewFiling,
  onBoardingCompleted,
  onNavigateOnboard,
}: DashboardHeaderProps) {
  console.log(onBoardingCompleted, "onBoardingCompleted");

  return (
    <div className="space-y-4">
      {onBoardingCompleted === false && (
        <div
          className={cn(
            "w-full rounded-2xl border border-emerald-200",
            "bg-linear-to-r from-emerald-50 to-green-50",
            "p-4 transition-all duration-200",
            "hover:shadow-md hover:border-emerald-300",
          )}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <MessageCircleMore className="w-5 h-5 text-emerald-700" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Connect WhatsApp Automation
                </h2>

                <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                  Complete WhatsApp onboarding to enable automated client
                  messaging, reminders, filing updates, compliance alerts, and
                  document request notifications directly from your dashboard.
                </p>

                <div className="mt-4 flex justify-end w-full">
                  <Button
                    onClick={onNavigateOnboard}
                    className="bg-brand-primary hover:bg-blue-700 text-white font-semibold rounded-xl"
                  >
                    Complete Setup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[2rem] font-black text-slate-900 tracking-tight leading-none">
            Firm Dashboard
          </h1>

          <p className="text-sm text-slate-500 mt-1.5">
            Audit status overview for{" "}
            <span className="text-indigo-600 font-bold">
              {month} {year}
            </span>
          </p>
        </div>

        <div className="flex gap-2.5">
          <Button
            className="gap-2 font-semibold bg-indigo-600 hover:bg-indigo-700"
            onClick={onNewFiling}
          >
            <Plus className="w-4 h-4" />
            New Filing
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
