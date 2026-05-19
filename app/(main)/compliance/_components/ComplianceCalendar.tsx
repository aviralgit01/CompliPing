"use client";

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

import { CalendarGrid } from "./CalendarGrid";
import { DailyAgenda } from "./DailyAgenda";
import { FilingStatusPanel, QuickStats } from "./SidePanel";
import { useCompliance } from "@/lib/hooks/api/compliance/useCompliance";
import { FilingsByDate } from "./types";
import Loader from "@/components/common/loader";
import { ComplianceData, Filing } from "@/lib/api/compliance/compliance.types";
import { ComplianceCalendarSkeleton } from "./ComplianceCalendarSkeleton";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function ComplianceCalendar() {
  const [viewYear, setViewYear] = useState(2023);
  const [viewMonth, setViewMonth] = useState(9);
  const [selectedDate, setSelectedDate] = useState("");
  const [todayKey, setTodayKey] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const getMonthRange = (year: number, month: number) => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const format = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    return {
      startDate: format(start),
      endDate: format(end),
    };
  };

  useEffect(() => {
    const d = new Date();

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    setTodayKey(key);
    setSelectedDate(key);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());

    const { startDate, endDate } = getMonthRange(d.getFullYear(), d.getMonth());

    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  useEffect(() => {
    const { startDate, endDate } = getMonthRange(viewYear, viewMonth);

    setStartDate(startDate);
    setEndDate(endDate);
  }, [viewYear, viewMonth]);

  const { data, isLoading } = useCompliance({
    page: 1,
    limit: 50,
    startDate,
    endDate,
  });
  const filings = useMemo<Record<string, Filing[]>>(() => {
    const compliance = data?.data as ComplianceData | undefined;
    if (!compliance) return {};

    const calendarData = compliance.calendarData ?? {};
    const recurringData = compliance.recurringData ?? {};

    const result: Record<string, Filing[]> = { ...calendarData };

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    Object.entries(recurringData).forEach(([day, items]) => {
      const dayNum = Number(day);
      if (dayNum > daysInMonth) return;

      const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;

      items.forEach((item) => {
        let shouldInclude = false;

        const due = new Date(item.dueDate);
        const dueMonth = due.getMonth();
        const dueYear = due.getFullYear();

        switch (item.frequency) {
          case "MONTHLY":
            shouldInclude = true;
            break;

          case "QUARTERLY": {
            const diff = viewYear * 12 + viewMonth - (dueYear * 12 + dueMonth);

            if (diff >= 0 && diff % 3 === 0) {
              shouldInclude = true;
            }
            break;
          }

          case "ANNUALLY": {
            if (viewMonth === dueMonth) {
              shouldInclude = true;
            }
            break;
          }

          case "ONE_TIME":
            break;
        }

        if (shouldInclude) {
          if (!result[dateKey]) result[dateKey] = [];

          // prevent duplicates
          const exists = result[dateKey].some((i) => i.id === item.id);

          if (!exists) {
            result[dateKey].push(item);
          }
        }
      });
    });

    return result;
  }, [data, viewYear, viewMonth]);

  const pendingCount = useMemo(() => {
    return Object.entries(filings)
      .filter(([key]) => {
        const [y, m] = key.split("-");
        return parseInt(y) === viewYear && parseInt(m) - 1 === viewMonth;
      })
      .reduce((acc, [, items]) => acc + items.length, 0);
  }, [viewYear, viewMonth, filings]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  function goToday() {
    if (!todayKey) return;

    const [y, m] = todayKey.split("-");

    setViewYear(parseInt(y));
    setViewMonth(parseInt(m) - 1);
    setSelectedDate(todayKey);
  }

  const completionRate = useMemo(() => {
    const all = Object.values(filings).flat();

    if (all.length === 0) return 0;

    const completed = all.filter((f) => f.status === "COMPLETED").length;

    return Math.round((completed / all.length) * 100);
  }, [filings]);

  return isLoading ? (
    <ComplianceCalendarSkeleton />
  ) : (
    <div className="min-h-screen from-background via-muted/30 to-muted/60">
      <div className=" mx-auto grid md:grid-cols-[1fr_180px] lg:grid-cols-[1fr_220px] gap-5">
        {/* LEFT */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* CALENDAR */}
          <Card className="overflow-hidden rounded-2xl border bg-background/80 backdrop-blur shadow-sm hover:shadow-md transition animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="p-2 rounded-lg bg-purple-600/10">
                  <CalendarDays className="h-5 w-5 text-purple-600" />
                </div>

                {/* Text */}
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                    {MONTHS[viewMonth]} {viewYear}
                  </h2>

                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    {/* <FileText className="h-3.5 w-3.5 text-primary" /> */}

                    <span className="font-semibold text-brand-primary">
                      {pendingCount}
                    </span>

                    <span className="text-muted-foreground">
                      pending filings
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={prevMonth}
                >
                  <ChevronLeft className="h-4 w-4 text-brand-primary" />
                </Button>

                <Button
                  size="sm"
                  className="h-8 rounded-lg px-4 text-xs font-semibold shadow-sm bg-brand-primary/80 hover:bg-brand-primary/90"
                  onClick={goToday}
                >
                  Today
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={nextMonth}
                >
                  <ChevronRight className="h-4 w-4 text-brand-primary" />
                </Button>
              </div>
            </div>

            {/* GRID */}
            <div className="p-4 pt-2 bg-muted/40 rounded-xl">
              <CalendarGrid
                year={viewYear}
                month={viewMonth}
                selectedDate={selectedDate}
                filings={filings}
                onSelectDate={setSelectedDate}
              />
            </div>
          </Card>

          {/* AGENDA */}
          <Card className="rounded-2xl py-2 border bg-background/80 backdrop-blur shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <DailyAgenda selectedDate={selectedDate} filings={filings} />
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-2 duration-500">
          {data && (
            <div className="rounded-xl border bg-muted/50 p-2 shadow-sm">
              {data && <FilingStatusPanel filings={filings} />}
            </div>
          )}

          <div className="rounded-xl border bg-muted/50 p-2 shadow-sm">
            <QuickStats completionRate={completionRate} />
          </div>
        </div>
      </div>
    </div>
  );
}
