import StatCard from "@/components/common/stat-card";
import { Calendar, UserCheck, Users, Watch } from "lucide-react";
import React from "react";

const TeamStatSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
      <StatCard
        icon={<Users />}
        value={2}
        title="All Members"
        description="All members in firm including invites and inactive"
        iconBgClass="from-brand-primary/20! to-blue-100!"
      />
      <StatCard
        icon={<UserCheck />}
        value={2}
        title="Active"
        description="Active team members"
        iconBgClass="from-green-200! to-green-100!"
      />
      <StatCard
        icon={<Watch />}
        value={2}
        title="Pending invites"
        description="Total pending invites"
        iconBgClass="from-red-200 to-red-100!"
      />
    </div>
  );
};

export default TeamStatSection;
