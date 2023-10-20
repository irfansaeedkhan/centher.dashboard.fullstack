import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";

import { AppRoutes } from "@/constants/app.routes";
import {
  RecommendedPeople,
  getRecommendedPeople,
} from "@/lib/recommended-people";
import { LoadingState } from "@/models/common";

import { RecommendedCard } from "./recommended.card";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const SuggestedCard: React.FC<Props> = ({ className, ...props }) => {
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

  if (loading === "loaded" && recommendedPeople.length === 0) return null;

  return (
    <div
      className={clsx(`relative max-w-[272px] select-none`, className)}
      {...props}
    >
      <div className={`relative rounded-10px bg-background-shade-3`}>
        <div className={`p-4`}>
          <h5 className={`pb-2 text-sm font-semibold text-white`}>
            Recommended people
          </h5>

          <RecommendedCard
            loading={loading}
            recommendedPeople={recommendedPeople}
            setRecommendedPeople={setRecommendedPeople}
          />
        </div>

        <div
          className={`flex cursor-pointer items-center justify-center border-t-2 border-gray-shade-3 text-center`}
        >
          <Link href={AppRoutes.recommended}>
            <button
              className={`hover: text-gradient-hover p-4 text-sm font-medium text-white`}
            >
              View all recommendations
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// styling
