import { api } from "../axios";

export const inviteMemberApi = async (data: any) => {
  return api.post("/team/invite", data);
};

export const acceptInviteApi = async (data: any) => {
  return api.post("/team/accept-invite", data);
};

export const getTeamApi = async ({
  page,
  limit,
  search,
  status,
}: {
  page: number;
  limit: number;
  search: string;
  status?: "ACTIVE" | "INACTIVE" | null;
}) => {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (search) params.append("search", search);
  if (status) params.append("status", status);

  return api.get(`/team?${params.toString()}`);
};

export const getTeamStatApi = async () => {
  return api.get("/team/stat");
};
