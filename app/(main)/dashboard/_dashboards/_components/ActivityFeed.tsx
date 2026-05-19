import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityItem, ActivityTabFilter } from "@/lib/api/dashboard/dashboard.api type";
import { formatAction } from "@/lib/utils/dashboard";
import { Filter, Play } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ACTIVITY_TABS: ActivityTabFilter[] = ["ALL", "DELIVERED", "SENT"];

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">
            Recent Activity Feed
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-700 gap-1.5 text-xs"
          >
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <Tabs defaultValue="ALL">
        <div className="px-5 pt-3 pb-1">
          <TabsList className="bg-slate-100 h-8">
            {ACTIVITY_TABS.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="text-xs font-bold tracking-wide data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-4"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {ACTIVITY_TABS.map((tab) => {
          const filtered: ActivityItem[] =
            tab === "ALL"
              ? activities
              : activities.filter((a) => a.status === tab);
          return (
            <TabsContent key={tab} value={tab} className="mt-0">
              <ScrollArea className="h-64">
                <div className="px-5 pb-3">
                  {filtered.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">
                      No activity
                    </p>
                  ) : (
                    filtered.map((a, i) => (
                      <div key={a.id}>
                        <div className="flex items-start gap-3 py-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                            <Play className="w-3.5 h-3.5 text-indigo-500 fill-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 leading-snug">
                              <span className="font-bold text-slate-900">
                                System
                              </span>{" "}
                              {formatAction(a.action)} to{" "}
                              <span className="font-bold text-slate-900">
                                {a.clientName}
                              </span>
                            </p>
                            <div className="mt-1.5">
                              <StatusBadge status={a.status} />
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono shrink-0 mt-0.5 whitespace-nowrap">
                            {a.time} IST
                          </span>
                        </div>
                        {i < filtered.length - 1 && <Separator />}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          );
        })}
      </Tabs>
    </Card>
  );
}



