import { cn } from "@/lib/utils";
const SectionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ icon, title, children, className }) => (
  <div
    className={cn(
      "bg-white/80 p-6 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl shadow-slate-200/50",
      className,
    )}
  >
    <div className="flex items-center gap-2 mb-5">
      <span className="text-teal-600">{icon}</span>
      <h2 className="text-sm font-semibold text-neutral-800">{title}</h2>
    </div>
    {children}
  </div>
);

export default SectionCard;
