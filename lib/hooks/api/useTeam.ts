import {
  acceptInviteApi,
  getTeamApi,
  getTeamStatApi,
  inviteMemberApi,
} from "@/lib/api/team-member/team.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UseTeamParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE" | null;
};

export const useTeam = ({
  page = 1,
  limit = 10,
  search = "",
  status,
}: UseTeamParams = {}) => {
  const queryClient = useQueryClient();
  const getTeamMember = useQuery({
    queryKey: ["team-members", page, limit, search || "", status || "ALL"],
    queryFn: () => getTeamApi({ page, limit, search, status }),
    placeholderData: (prev) => prev,
  });

  const getTeamStat = useMutation({
    mutationFn: getTeamStatApi,
    retry: false,
  });

  // Invite Member
  const inviteMemberMutation = useMutation({
    mutationFn: inviteMemberApi,
    retry: false,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (error: any) => {
      console.error("Invite error", error);
    },
  });

  // Accept Invite
  const acceptInviteMutation = useMutation({
    mutationFn: acceptInviteApi,
    retry: false,
    onSuccess: (data) => {
      toast.success("Accept invite successfully");
    },
    onError: (error: any) => {
      console.error("Accept invite error", error);
    },
  });

  return {
    getMember: getTeamMember,

    teamStat: getTeamStat.mutate,
    teamStatLoading: getTeamStat.isPending,

    inviteMember: inviteMemberMutation.mutate,
    inviteLoading: inviteMemberMutation.isPending,

    acceptInvite: acceptInviteMutation.mutate,
    acceptInviteLoading: acceptInviteMutation.isPending,
  };
};
