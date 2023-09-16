import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import {
  PendingInvite,
  acceptReceivedInvite,
  getReceivedInvites,
  leaveOrg,
  rejectReceivedInvite,
} from "@/lib/org-team-members";
import { LoadingState } from "@/models/common";
import SettingsSidebar from "../_components/settings.sidebar";
import SettingsTopBar from "../_components/settings.topbar";
import { JoinedTeam, SingleReceivedInvite } from "./_components";

const TeamSettings: NextPageWithLayout = () => {
  const {
    user: loggedInUser,
    refetchUser,
    isLoading: loggedInUserLoading,
  } = useUser();
  const {
    user: joinedOrgUser,
    loading: joinedOrgUserLoading,
    mutateUser,
  } = useGetUser(loggedInUser?.organization?.org_id);
  const [receivedInvites, setReceivedInvites] = useState<PendingInvite[]>([]);
  const [invitesLoading, setInvitesLoading] = useState<LoadingState>("idle");

  const fetchSentInvites = useCallback(async () => {
    try {
      setInvitesLoading("loading");
      const _receivedInvites = await getReceivedInvites();
      setReceivedInvites(_receivedInvites);
      setInvitesLoading("loaded");
    } catch (err: any) {
      toast.error(err.message);
      setInvitesLoading("failed");
    }
  }, []);

  useEffect(() => {
    fetchSentInvites();
  }, [fetchSentInvites]);

  const handleLeaveTeam = async () => {
    try {
      await leaveOrg();
      mutateUser(null);
      toast.success("You have left the team");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const removeInvite = (inviteId: string) => {
    setReceivedInvites((invites) =>
      invites.filter((invite) => invite._id !== inviteId)
    );
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptReceivedInvite(inviteId);
      refetchUser();
      removeInvite(inviteId);
      toast.success("You have joined the team");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await rejectReceivedInvite(inviteId);
      removeInvite(inviteId);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const isLoading =
    loggedInUserLoading ||
    joinedOrgUserLoading === "loading" ||
    invitesLoading === "idle" ||
    invitesLoading === "loading";

  return (
    <div className="w-full max-w-[640px] px-3 fsm:px-5 fmd:px-0">
      <h6 className="mb-10 text-xl font-semibold leading-7 text-white">Team</h6>
      <div className="space-y-6">
        {/* Joined Team */}
        {joinedOrgUser && (
          <JoinedTeam
            joinedOrgUser={joinedOrgUser}
            handleLeaveTeam={handleLeaveTeam}
          />
        )}

        {/* Received Invitation */}
        {!!receivedInvites.length && (
          <div className="rounded-10px border border-gray-shade-3">
            {receivedInvites.map((invite) => (
              <SingleReceivedInvite
                key={invite._id}
                invite={invite}
                handleAcceptInvite={handleAcceptInvite}
                handleRejectInvite={handleRejectInvite}
              />
            ))}
          </div>
        )}

        {!isLoading && !joinedOrgUser && !receivedInvites.length && (
          <div className="rounded-10px border border-gray-shade-3 px-6 py-4">
            <p className="text-center text-sm font-normal text-gray-shade-18">
              You are not a member of any team
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

TeamSettings.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Team" showSidebar={false}>
      <div className="flex flex-col justify-center fsm:gap-5 flg:flex-row flg:gap-10">
        <span className="hidden flg:block">
          <SettingsSidebar />
        </span>
        <span className="block flg:hidden">
          <SettingsTopBar />
        </span>
        {page}
      </div>
    </AllPagesWrapper>
  );
};

export default TeamSettings;
