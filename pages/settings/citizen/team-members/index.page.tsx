import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUser from "@/hooks/use.user";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ProfileSettingSkeleton from "@/components/loading.skeletons/profile.setting.skeleton";
import Button from "@/components/button";
import { AppRoutes } from "@/constants/app.routes";
import cn from "@/utils/cn";
import { SettingsPagesWrapper } from "../../_components";
import {
  TeamMembersJoinedTab,
  TeamMembersSentInvitationsTab,
  InviteMemberModal,
} from "../_components";

const TeamMembersSettings: NextPageWithLayout = () => {
  const { user: loggedInUser } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<"joined" | "sent_invitations">("joined");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    if (router.query.tab === "invitations") {
      setTab("sent_invitations");
    } else {
      setTab("joined");
    }
  }, [router.query.tab, tab]);

  return (
    <div className="w-full max-w-[640px] px-3 fsm:px-5 fmd:px-0">
      <h6 className="mb-10 text-xl font-semibold leading-7 text-white">
        Set up your Team Members
      </h6>

      <div className="mb-4 flex items-center">
        <div className="flex-grow space-x-3 text-sm font-semibold text-white">
          <button
            className={cn(tab === "joined" && "textGradient")}
            onClick={() => {
              router.push({
                pathname: AppRoutes.settings.citizen.team_members,
                query: { tab: "joined" },
              });
            }}
          >
            Joined
          </button>
          <button
            className={cn(tab === "sent_invitations" && "textGradient")}
            onClick={() => {
              router.push({
                pathname: AppRoutes.settings.citizen.team_members,
                query: { tab: "invitations" },
              });
            }}
          >
            Sent Invitations
          </button>
        </div>
        <div>
          <Button
            title={"Invite Member"}
            onClick={() => {
              setInviteModalOpen(true);
            }}
            variant="primary"
            className="text-sm"
            borderRounded="12px"
          />
        </div>
      </div>

      {loggedInUser ? (
        tab === "sent_invitations" ? (
          <TeamMembersSentInvitationsTab />
        ) : (
          <TeamMembersJoinedTab loggedInUser={loggedInUser} />
        )
      ) : (
        // TODO: Change Skeleton
        <ProfileSettingSkeleton />
      )}

      <InviteMemberModal
        isOpen={inviteModalOpen}
        onClose={() => {
          setInviteModalOpen(false);
        }}
      />
    </div>
  );
};

TeamMembersSettings.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Team Members" showSidebar={false}>
      <SettingsPagesWrapper>{page}</SettingsPagesWrapper>
    </AllPagesWrapper>
  );
};

export default TeamMembersSettings;
