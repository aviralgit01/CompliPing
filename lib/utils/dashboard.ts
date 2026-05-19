export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace("Gstr 1 Monthly", "GSTR-1 Monthly")
    .replace("Tds Payment", "TDS Payment")
    .replace("Pf Payment", "PF Payment")
    .replace("3 Day", "3-Day")
    .replace("7 Day", "7-Day");
}

export const AVATAR_COLOR_MAP: Record<string, string> = {
  RS: "bg-rose-100 text-rose-700",
  KS: "bg-amber-100 text-amber-700",
  AS: "bg-sky-100 text-sky-700",
};

export const DEFAULT_AVATAR_COLOR = "bg-indigo-100 text-indigo-700";

export function getAvatarColor(initials: string): string {
  return AVATAR_COLOR_MAP[initials] ?? DEFAULT_AVATAR_COLOR;
}

export const BADGE_CLASS_MAP = {
  Missing: "bg-rose-50 text-rose-600 border-rose-200",
  Overdue: "bg-rose-50 text-rose-600 border-rose-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SENT: "bg-indigo-50 text-indigo-600 border-indigo-200",
  URGENT: "bg-rose-600 text-white border-rose-600",
};