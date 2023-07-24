import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NetworkGenealogySkeleton from "@/components/loading.skeletons/network.genealogy.skeleton";
import useUser from "@/hooks/use.user";
import { useGenealogyStore } from "@/store/network.genealogy";
import ProfileCommunityLayout from "@/layouts/profile.community.layout";
import { NextPageWithLayout } from "@/pages/_app.page";
import { AppRoutes } from "@/constants/app.routes";
import { LevelMain } from "./_components/level.main";

const Referrals: NextPageWithLayout = () => {
  const [level, setLevel] = useState(0);
  const [activeParent, setActiveParent] = useState<any>([]);
  const { user: loggedInUser } = useUser();
  const router = useRouter();

  const { genealogies, fetchGenealogy, fetchReferrers, loading, updating } =
    useGenealogyStore((state) => ({
      genealogies: state.genealogies,
      fetchGenealogy: state.fetchGenealogy,
      fetchReferrers: state.fetchReferrers,
      loading: state.loading,
      updating: state.updating,
    }));

  useEffect(() => {
    const fetchGenealogyBaseData = async (account: string) => {
      await fetchGenealogy(account);
      await fetchReferrers(account, 0);
    };

    if (router.query.user_id && loggedInUser) {
      if (
        router.query.user_id.toString().toLowerCase() !==
        loggedInUser._id.toLowerCase()
      ) {
        // Redirect to the profile page if the account address in the URL is not the same as the logged in user's account address
        router.replace({
          pathname: AppRoutes.profile.user_id,
          query: { user_id: router.query.user_id },
        });
        return;
      }

      fetchGenealogyBaseData(loggedInUser._id);
    }
  }, [fetchGenealogy, fetchReferrers, router, loggedInUser]);

  // handles the active parentCard and list shown
  const handleCard = async (childData: any) => {
    const _level = Number(childData.level);
    if (updating === "loading") return;
    if (_level === 6) return;
    childData.level !== "06" &&
      setActiveParent((prev: any) => {
        if (prev.length > 0) {
          return [...prev, childData];
        } else {
          return [childData];
        }
      });
    await fetchReferrers(childData.user, _level);
    setLevel(_level);
  };
  const totalPeople =
    genealogies &&
    genealogies.length > 0 &&
    genealogies
      .map((level) => level.people)
      .reduce((a, b) => Number(a) + Number(b), 0);

  return (
    <div className="w-full">
      <div className="customScrollbar flex w-full gap-3 overflow-auto pl-1 pr-2 pb-4">
        {!!genealogies?.length ? (
          <>
            {genealogies &&
              genealogies.length > 0 &&
              genealogies.map((parentData: any, index: number) => {
                return (
                  <LevelMain
                    parentData={parentData}
                    handleCard={handleCard}
                    key={index}
                  />
                );
              })}
          </>
        ) : (
          <>
            {Array.from({
              length: 6,
            }).map((_, index) => {
              return (
                <NetworkGenealogySkeleton
                  key={index}
                  className="flex-shrink-0"
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

Referrals.getLayout = (page) => (
  <ProfileCommunityLayout>
    <div>{page}</div>
  </ProfileCommunityLayout>
);

export default Referrals;
