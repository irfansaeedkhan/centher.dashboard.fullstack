import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import ViewAllRecommendedPeopleSkeleton from "@/components/loading.skeletons/view.all.recommended.people";
import {
  getRecommendedPeople,
  RecommendedPeople,
} from "@/lib/recommended-people";
import { axiosNodeApi } from "@/utils/axios";
import { LoadingState } from "@/models/common";
import { NextPageWithLayout } from "../_app.page";
import { RecommendedPageWrapper } from "./_components/recommended-page-wrapper";
import RecommendedUserCard from "./_components/recommended-user-card";

const RecommendedPeople: NextPageWithLayout = () => {
  const [recommendedPeople, setRecommendedPeople] = useState<
    RecommendedPeople[]
  >([]);
  const [loading, setLoading] = useState<LoadingState>("idle");
  useEffect(() => {
    setLoading("loading"); // Set loading state to loading before making API call

    getRecommendedPeople()
      .then((data) => {
        setRecommendedPeople(data);
        setLoading("loaded"); // Set loading state to loaded after data has been fetched
      })
      .catch((error) => {
        setLoading("failed"); // Set loading state to failed in case of error
      });
  }, []);

  const followUser = async (following_id: string) => {
    try {
      setRecommendedPeople((prev) =>
        prev.map((user) => {
          if (user._id === following_id) {
            return {
              ...user,
              is_followed_by_loggedin_user: !user.is_followed_by_loggedin_user,
            };
          }
          return user;
        })
      );

      await axiosNodeApi.post("api/socials/follows", {
        following_id,
      });
    } catch (error: any) {
      toast.error(
        error.response.data?.message_description || "Something went wrong"
      );
    }
  };

  return (
    <div>
      <div className="text-xl font-semibold text-white">
        Recommended people for you
      </div>
      {loading === "idle" || loading === "loading" ? (
        <ViewAllRecommendedPeopleSkeleton />
      ) : null}

      {loading === "loaded" &&
        recommendedPeople.map((user) => (
          <RecommendedUserCard
            key={user._id}
            user={user}
            followUser={followUser}
          />
        ))}

      {loading === "failed" && (
        <div className={`flex items-center justify-center`}>
          <p className={`text-red-500`}>Failed to load</p>
        </div>
      )}
    </div>
  );
};

RecommendedPeople.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Recommended people">
      <RecommendedPageWrapper>
        <div className="space-y-3">{page}</div>
      </RecommendedPageWrapper>
    </AllPagesWrapper>
  );
};

export default RecommendedPeople;
