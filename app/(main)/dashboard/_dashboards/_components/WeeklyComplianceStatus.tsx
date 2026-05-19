import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getAvatarColor, getInitials } from "@/lib/utils/dashboard";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { ComplianceItem } from "@/lib/api/dashboard/dashboard.api type";

interface WeeklyComplianceStatusProps {
  itemsDue: number;
  itemsCompleted: number;
  itemsOverdue: number;
  items: ComplianceItem[];
  onAction?: (client: string, action: string) => void;
}

function WeeklyComplianceStatus({
  itemsDue,
  itemsCompleted,
  itemsOverdue,
  items,
  onAction,
}: WeeklyComplianceStatusProps) {
  const summaryStats = [
    { label: "DUE THIS WEEK", value: itemsDue,       color: "text-slate-800" },
    { label: "COMPLETED",     value: itemsCompleted, color: "text-indigo-600" },
    { label: "OVERDUE",       value: itemsOverdue,   color: "text-rose-600" },
  ] as const;

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-bold">
            This Week's Compliance Status
          </CardTitle>
          <div className="flex gap-6">
            {summaryStats?.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[10px] font-bold tracking-widest text-slate-400 font-mono">
                  {s.label}
                </p>
                <p className={`text-xl font-black font-mono ${s.color}`}>
                  {String(s.value).padStart(2, "0")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <Separator className="mt-4" />
      <CardContent className="p-0">
        {items?.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            No items due today 🎉
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                {["Client Name", "Compliance Type", "Document Status", "Action"]?.map(
                  (h) => (
                    <TableHead
                      key={h}
                      className={`text-xs font-bold text-slate-400 tracking-wider ${h === "Client Name" ? "pl-5" : ""}`}
                    >
                      {h}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map((item) => {
                const initials = getInitials(item?.client);
                return (
                  <TableRow key={item.id} className="hover:bg-slate-50/60">
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8 rounded-lg">
                          <AvatarFallback
                            className={`rounded-lg text-xs font-bold ${getAvatarColor(initials)}`}
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm text-slate-800">
                          {item.client}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {item.complianceType}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.documentStatus} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-rose-600 hover:text-rose-700 hover:bg-transparent font-semibold text-sm"
                        onClick={() => onAction?.(item.client, item.action)}
                      >
                        {item.action}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}


export default WeeklyComplianceStatus