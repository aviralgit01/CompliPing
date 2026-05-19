import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ChevronRight, TrendingUp } from "lucide-react";

function AuditGuideWidget() {
  return (
    <Card className="bg-indigo-50 border-indigo-100">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-1.5">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-indigo-900">
            Audit Guide FY 2024-25
          </h3>
        </div>
        <p className="text-xs text-indigo-600/80 leading-relaxed mb-3">
          Latest MCA norms and filing deadlines for the current assessment year.
        </p>
        <div className="rounded-xl overflow-hidden h-20 bg-linear-to-br from-slate-900 via-indigo-900 to-indigo-600 flex items-center justify-center mb-3">
          <TrendingUp className="w-8 h-8 text-indigo-200 opacity-60" />
        </div>
        <Button
          variant="link"
          className="p-0 h-auto text-indigo-700 text-sm font-semibold"
          onClick={() => alert("Read Full Guide")}
        >
          Read Full Guide <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Button>
      </CardContent>
    </Card>
  );
}


export default AuditGuideWidget