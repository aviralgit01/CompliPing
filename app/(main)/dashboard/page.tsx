// import WhatsAppSignup from "@/components/common/WhatsAppSignup";
// import { ROLES } from "@/lib/constants/role";
// import { getUserFromToken } from "@/lib/utils/server-utils";
// import React from "react";
// import AdminDashbaord from "./_dashboards/admin-dashboard";
// import ManagerDashboard from "./_dashboards/manager-dashboard";
// import PartnerDashboard from "./_dashboards/partner-dashboard";
// import JuniorDashboard from "./_dashboards/junior-dashboard";

// const Dashboard = async () => {
//   const user = await getUserFromToken();
  
//   return (
//     <div>
//       <WhatsAppSignup />
//       {user?.role === ROLES.SUPER_ADMIN && <AdminDashbaord />}
//       {user?.role === ROLES.PARTNER && <PartnerDashboard />}
//       {user?.role === ROLES.MANAGER && <ManagerDashboard />}
//       {user?.role === ROLES.JUNIOR && <JuniorDashboard />}
//     </div>
//   );
// };

// export default Dashboard;




import WhatsAppSignup from "@/components/common/WhatsAppSignup";
import { ROLES } from "@/lib/constants/role";
import { getUserFromToken } from "@/lib/utils/server-utils";
import React from "react";
import AdminDashbaord from "./_dashboards/admin-dashboard";
import ManagerDashboard from "./_dashboards/manager-dashboard";
import PartnerDashboard from "./_dashboards/partner-dashboard";
import JuniorDashboard from "./_dashboards/junior-dashboard";

const Dashboard = async () => {
  const user = await getUserFromToken();
  
  return (
    <div>
      {/* <WhatsAppSignup /> */}
      {user?.role === ROLES.SUPER_ADMIN && <AdminDashbaord />}
      {user?.role === ROLES.PARTNER && <PartnerDashboard />}
      {user?.role === ROLES.MANAGER && <ManagerDashboard />}
      {user?.role === ROLES.JUNIOR && <JuniorDashboard />}
    </div>
  );
};

export default Dashboard;
