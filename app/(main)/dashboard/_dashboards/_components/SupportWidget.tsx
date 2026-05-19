import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Headphones, MessageSquare } from "lucide-react";

function SupportWidget() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">
                Priority CA Support
              </p>
              <p className="text-xs text-slate-400">
                Live helpdesk: 09:00 – 18:00
              </p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  className="w-9 h-9 p-0 rounded-xl bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => alert("Open chat")}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}

export default SupportWidget;
