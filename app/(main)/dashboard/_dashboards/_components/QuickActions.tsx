import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ClipboardList, ShieldAlert, UserRound, UserRoundPlus } from "lucide-react";

interface QuickActionsProps {
  overdueCount: number;
  onAddClient: () => void;
  onAddCompliance: () => void;
  onCompliance?: () => void;
  onViewOverdue: () => void;
}

function QuickActions({
  overdueCount,
  onAddClient,
  onAddCompliance,
  onViewOverdue,
  onCompliance,
}: QuickActionsProps) {
  return (
   <Card className="md:w-72">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5 pt-0 h-full justify-start">
        <Button
          className="w-full justify-start gap-2.5 bg-indigo-600 hover:bg-indigo-700 font-semibold"
          onClick={onAddClient}
        >
          <UserRound className="w-4 h-4" /> Clients
        </Button>
        <Button
          variant="secondary"
          className="w-full justify-start gap-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold border-0"
          onClick={onAddCompliance}
        >
          <ClipboardList className="w-4 h-4" /> Add Compliance Item
        </Button>
        <Button
          variant="secondary"
          className="w-full justify-start gap-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold border-0"
          onClick={onCompliance}
        >
          <Calendar className="w-4 h-4" /> Compliance Calendar
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold"
          onClick={onViewOverdue}
        >
          <span className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4" /> View Overdue Items
          </span>
          {overdueCount > 0 && (
            <Badge className="bg-rose-600 hover:bg-rose-600 text-white text-xs font-bold px-2">
              {String(overdueCount).padStart(2, "0")}
            </Badge>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}


export default QuickActions;