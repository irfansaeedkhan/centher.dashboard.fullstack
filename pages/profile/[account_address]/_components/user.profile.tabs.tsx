import clsx from "clsx";
import React from "react";
import type { SelectedTab } from "./types";

interface ProfileProps {
  selectedTab: SelectedTab;
  onSelect: (tab: SelectedTab) => void;
}

const UserProfileTabs: React.FC<ProfileProps> = ({ selectedTab, onSelect }) => {
  return (
    <div className="mt-6 flex gap-10">
      <button
        className={clsx(
          selectedTab === "Posts"
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "py-[10px] px-4 cursor-pointer"
        )}
        onClick={() => onSelect("Posts")}
      >
        My Post
      </button>
      <button
        className={clsx(
          selectedTab === "Followers"
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "py-[10px] px-4 cursor-pointer"
        )}
        onClick={() => onSelect("Followers")}
      >
        Followers
      </button>
      <button
        className={clsx(
          selectedTab === "Following"
            ? "border-b-2 text-white"
            : "text-gray-shade-7",
          "py-[10px] px-4 cursor-pointer"
        )}
        onClick={() => onSelect("Following")}
      >
        Following
      </button>
    </div>
  );
};

export default UserProfileTabs;
