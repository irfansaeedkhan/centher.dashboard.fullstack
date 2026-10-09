import React from "react";
import { toast } from "react-hot-toast";

import { RecommendedPeople } from "@/lib/recommended-people";
import { LoadingState } from "@/models/common";
import { axiosApi369x } from "@/utils/axios";
import RecommendedPeopleLeftCardSkeleton from "@/components/loading.skeletons/recommended.people.left.card";
import RecommendedUserCard from "./recommended-user-card";

interface Props {
  loading: LoadingState;
  setRecommendedPeople: React.Dispatch<
    React.SetStateAction<RecommendedPeople[]>
  >;
  recommendedPeople: RecommendedPeople[];
}

export const RecommendedCard: React.FC<Props> = ({
  loading,
  setRecommendedPeople,
  recommendedPeople,
}) => {
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

      await axiosApi369x.post("/api/socials/followers", {
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
      {loading === "idle" || loading === "loading" ? (
        <RecommendedPeopleLeftCardSkeleton />
      ) : null}

      {loading === "loaded" &&
        recommendedPeople
          .slice(0, 5)
          .map((user) => (
            <RecommendedUserCard
              key={user._id}
              user={user}
              followUser={followUser}
            />
          ))}

      {loading === "failed" && (
        <div className={`flex items-center justify-center`}>
          <p className={`text-danger`}>Failed to load</p>
        </div>
      )}
    </div>
  );
};
