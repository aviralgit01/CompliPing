"use client";
import { useMemo } from "react";
import { FilingsByDate } from "./types";
import { cn } from "@/lib/utils";
import { ComplianceStatus } from "@/lib/api/compliance/compliance.types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DotProps {
  status?: ComplianceStatus;
}

function Dot({ status }: DotProps) {
  return (
    <span
      className={cn(
        "inline-block w-1.5 h-1.5 rounded-full shrink-0",
        {
          "bg-red-500": status === "OVERDUE",      
          "bg-green-500": status === "COMPLETED",   
          "bg-yellow-400": status === "PENDING",    
          "bg-gray-400": status === "CANCELLED",   
        }
      )}
    />
  );
}

interface DayCellProps {
  day: number;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  filings: FilingsByDate;
  onSelect: (key: string) => void;
}


function DayCell({
  day,
  dateKey,
  isCurrentMonth,
  isToday,
  isSelected,
  filings,
  onSelect,
}: DayCellProps) {
  
  const items = filings[dateKey] ?? [];

  return (
    <div
      onClick={() => onSelect(dateKey)}
      className={cn(
        "min-h-15 rounded-xl p-1.5 cursor-pointer relative border transition-all duration-150",
        {
          // DEFAULT
          "bg-background border-transparent": !isSelected && !isToday,

          // HOVER (use primary tint, not dull grey)
          "hover:bg-brand-primary/20": !isSelected,

          // TODAY (subtle highlight)
          "border-brand-primary/40 bg-brand-primary/5": isToday && !isSelected,

          // SELECTED (strong state)
          "bg-brand-primary/60 text-primary-foreground border-brand-primary/40 shadow-sm":
            isSelected,
        }
      )}
    >
      {/* Day number */}
      <span
        className={cn("text-[13px] font-semibold leading-none block", {
          "text-muted-foreground/30": !isCurrentMonth,

          // normal days
          "text-foreground": isCurrentMonth && !isSelected && !isToday,

          // today
          "text-primary": isToday && !isSelected,

          // selected
          "text-primary-foreground": isSelected,
        })}
      >
        {day}
      </span>

      {/* Dots */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-0.5 mt-1.5">
          {items.slice(0, 4).map((item) => (
            <Dot key={item.id} status={item.status} />
          ))}
          {items.length > 4 && (
            <span
              className={cn("text-[9px]", {
                "text-muted-foreground": !isSelected,
                "text-primary-foreground/80": isSelected,
              })}
            >
              +{items.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Task badge */}
      {items.length > 1 && (
        <span
          className={cn(
            "absolute bottom-1.5 left-1.5 text-[9px] font-medium px-1 py-0.5 rounded",
            {
              "bg-muted text-muted-foreground": !isSelected,
              "bg-primary-foreground/20 text-primary-foreground":
                isSelected,
            }
          )}
        >
          {items.length} TASKS
        </span>
      )}
    </div>
  );
}
interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  selectedDate: string;
  filings: FilingsByDate;
  onSelectDate: (key: string) => void;
}




function mapMonthlyRecurring({recurringData, year, month}:any) {
  const result:any = {};

  Object.keys(recurringData).forEach((day) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    result[dateKey] = recurringData[day].filter(
      (item:any) => item.frequency === "MONTHLY"
    );
  });

  return result;
}


export function CalendarGrid({
  year,
  month,
  selectedDate,
  filings,
  onSelectDate,
}: CalendarGridProps) {
  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);
  console.log(filings,"filings in grid");
  
  const cells = useMemo(() => {
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const items: { day: number; dateKey: string; isCurrentMonth: boolean }[] = [];

    // Prev month trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;
      items.push({ day: d, dateKey: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: false });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      items.push({ day: d, dateKey: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: true });
    }

    // Next month leading days
    let next = 1;
    while (items.length % 7 !== 0) {
      const m = month === 11 ? 0 : month + 1;
      const y = month === 11 ? year + 1 : year;
      items.push({ day: next, dateKey: `${y}-${String(m + 1).padStart(2, "0")}-${String(next).padStart(2, "0")}`, isCurrentMonth: false });
      next++;
    }

    return items;
  }, [year, month]);

  const weeks = useMemo(() => {
    const rows: typeof cells[] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [cells]);

  return (
    <div>
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-brand-primary uppercase tracking-wide py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="flex flex-col gap-0.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-0.5">
            {week.map((cell) => (
              <DayCell
                key={cell.dateKey}
                day={cell.day}
                dateKey={cell.dateKey}
                isCurrentMonth={cell.isCurrentMonth}
                isToday={cell.dateKey === today}
                isSelected={cell.dateKey === selectedDate}
                filings={filings}
                onSelect={onSelectDate}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
