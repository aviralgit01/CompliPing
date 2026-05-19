"use client";
import StatCard from "@/components/common/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeam } from "@/lib/hooks/api/useTeam";
import { Timer, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";

type statType = {
  totalMembers: number;
  activeMembers: number;
  pendingInvites: number;
};

const TeamStatSection = () => {
  const { teamStat } = useTeam();
  const [stats, setStats] = useState<statType>({
    totalMembers: 0,
    activeMembers: 0,
    pendingInvites: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleStat = () => {
    setLoading(true);
    teamStat(undefined, {
      onSuccess: (data) => {
        console.log("stats", data);
        setStats(data?.data?.data);
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    handleStat();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-white/60 space-y-2.5"
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
      <StatCard
        icon={<Users />}
        value={stats.totalMembers}
        title="All Members"
        description="All members in firm including invites and inactive"
        iconBgClass="from-brand-primary/20! to-blue-100!"
      />
      <StatCard
        icon={<UserCheck />}
        value={stats.activeMembers}
        title="Active"
        description="Active team members"
        iconBgClass="from-green-200! to-green-100!"
      />
      <StatCard
        icon={<Timer />}
        value={stats.pendingInvites}
        title="Pending invites"
        description="Total pending invites"
        iconBgClass="from-yellow-200 to-yellow-100!"
      />
    </div>
  );
};

export default TeamStatSection;
