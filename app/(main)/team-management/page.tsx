import React from "react";
import TeamStatSection from "./_components/stat-section";
import TeamTableSection from "./_components/team-table-section";

const TeamManagement = () => {
  return (
    <div className="">
      <div className="mb-8">
        <TeamStatSection />
      </div>
      <div>
        <TeamTableSection />
      </div>
    </div>
  );
};

export default TeamManagement;
