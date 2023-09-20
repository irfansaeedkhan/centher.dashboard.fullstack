import toast from "react-hot-toast";
import useUser from "@/hooks/use.user";
import useGetUser from "@/hooks/use.get.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import {
  acceptReceivedInvite,
  leaveOrg,
  rejectReceivedInvite,
} from "@/lib/org-team-members";
import { useGetReceivedInvites } from "@/hooks/org-team-members";
import { SettingsPagesWrapper } from "../_components";
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
  const {
    receivedInvites,
    loading: invitesLoading,
    removeReceivedInvite,
  } = useGetReceivedInvites();

  const handleLeaveTeam = async () => {
    try {
      await leaveOrg();
      mutateUser(null);
      toast.success("You have left the team");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptReceivedInvite(inviteId);
      refetchUser();
      removeReceivedInvite(inviteId);
      toast.success("You have joined the team");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await rejectReceivedInvite(inviteId);
      removeReceivedInvite(inviteId);
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
      <SettingsPagesWrapper>{page}</SettingsPagesWrapper>
    </AllPagesWrapper>
  );
};

export default TeamSettings;
