import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "@/pages/_app.page";
import ProfileCommunityLayout from "@/layouts/profile.community.layout";
import { OrgMember, getOrgMembers } from "@/lib/org-team-members";
import { customLog } from "@/utils/custom.log";
import TeamMember from "../../_components/team-member";

const Following: NextPageWithLayout = () => {
  const router = useRouter();
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);

  const fetchOrgMembers = useCallback(async () => {
    if (!router.query.user_id) return;
    try {
      const _orgMembers = await getOrgMembers(router.query.user_id?.toString());
      setOrgMembers(_orgMembers);
    } catch (err: any) {
      customLog(["development", "staging"], err);
    }
  }, [router.query.user_id]);

  useEffect(() => {
    fetchOrgMembers();
  }, [fetchOrgMembers]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 f2xl:grid-cols-2">
        {orgMembers.map((member) => {
          return (
            <TeamMember key={member.user_id} member={member} className="" />
          );
        })}
      </div>
    </>
  );
};

Following.getLayout = (page) => (
  <ProfileCommunityLayout>
    <div>{page}</div>
  </ProfileCommunityLayout>
);

export default Following;
