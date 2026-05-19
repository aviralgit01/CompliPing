import { Role, ROLES } from "../constants/role";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Users2,
  CreditCard,
  ShieldCheck,
  Settings,
  User2,
  UserPlus,
  Subscript,
} from "lucide-react";

export interface NavItem {
  label: string;
  key: string;
  icon: React.ReactNode;
  href?: string;
  roles: Role[];
  description?: string;
  menuItem?: {
    icon?: React.ReactNode;
    label: string;
    href: string;
    description?: string;
    roles: Role[];
  }[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    key: "dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
    roles: [ROLES.PARTNER, ROLES.MANAGER, ROLES.JUNIOR, ROLES.SUPER_ADMIN],
  },

  {
    label: "Plans",
    key: "plans",
    href: "/super-admin/plan",
    icon: <CreditCard size={20} />,
    roles: [ROLES.SUPER_ADMIN],
  },

  {
    label: "Client Management",
    key: "clients",
    href: "/clients",
    icon: <Users size={20} />,
    roles: [ROLES.PARTNER, ROLES.MANAGER, ROLES.JUNIOR],
  },

  {
    label: "Compliance",
    key: "compliance",
    icon: <ShieldCheck size={20} />,
    roles: [ROLES.PARTNER, ROLES.MANAGER, ROLES.JUNIOR],
    menuItem: [
      {
        label: "All Compliance",
        href: "/compliance",
        roles: [ROLES.PARTNER, ROLES.MANAGER, ROLES.JUNIOR],
      },
      {
        label: "Create Compliance",
        href: "/compliance/create",
        roles: [ROLES.PARTNER, ROLES.MANAGER],
      },
    ],
  },

  // {
  //   label: "Documents",
  //   key: "documents",
  //   href: "/documents",
  //   icon: <FileText size={20} />,
  //   roles: [ROLES.PARTNER, ROLES.MANAGER, ROLES.JUNIOR],
  // },

  // {
  //   label: "Team Management",
  //   key: "team",
  //   href: "/team-management",
  //   icon: <Users2 size={20} />,
  //   roles: [ROLES.PARTNER],
  // },

  {
    label: "Billing",
    key: "billing",
    href: "/billing/subscription/upgrade",
    icon: <CreditCard size={20} />,
    roles: [ROLES.PARTNER],
  },

  // {
  //   label: "Audit Logs",
  //   key: "audit",
  //   href: "/audit",
  //   icon: <FolderKanban size={20} />,
  //   roles: [ROLES.PARTNER],
  // },
];

export const getFilteredNavItems = (
  items: NavItem[],
  role: Role,
): NavItem[] => {
  return (
    items
      // ✅ First filter parent
      .filter((item) => item.roles.includes(role))

      // ✅ Then map safely
      .map((item) => {
        const filteredSubMenu = item.menuItem?.filter((sub) =>
          sub.roles.includes(role),
        );

        return {
          ...item,
          menuItem: filteredSubMenu,
        };
      })

      // ✅ Final cleanup
      .filter(
        (item) => item.href || (item.menuItem && item.menuItem.length > 0),
      )
  );
};
