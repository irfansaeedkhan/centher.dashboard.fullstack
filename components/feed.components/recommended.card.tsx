import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getRecommendedPeople,
  RecommendedPeople,
} from "@/lib/recommended-people";
import { LoadingState } from "@/models/common";
import { axiosNodeApi } from "@/utils/axios";
import RecommendedPeopleLeftCardSkeleton from "@/components/loading.skeletons/recommended.people.left.card";
import RecommendedUserCard from "./recommended-user-card";

export const RecommendedCard = () => {
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
        console.log(error);
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
          <p className={`text-red-500`}>Failed to load</p>
        </div>
      )}
    </div>
  );
};
