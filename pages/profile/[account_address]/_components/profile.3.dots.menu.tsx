import React, { useRef } from "react";
import Link from "next/link";
import { useOnClickOutside } from "usehooks-ts";
import clsx from "clsx";
import { HiOutlineArchive, HiOutlineDotsVertical } from "react-icons/hi";

import { LoggedInUser } from "@/models/user";
import { AppRoutes } from "@/constants/app.routes";

interface Props {
  isOwnProfile: boolean;
  loggedInUser?: LoggedInUser;
}

const Profile3DotsMenu: React.FC<Props> = ({ isOwnProfile, loggedInUser }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuContainerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuContainerRef, () => setIsOpen(false));

  if (!isOwnProfile || !loggedInUser) return null;

  return (
    <div className="absolute top-2 right-2 z-[100]" ref={menuContainerRef}>
      <button
        className="p-1.5 bg-black/30 rounded-md"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <HiOutlineDotsVertical className="w-4 h-4 stroke-white" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] right-0 bg-black-shade-12 w-[200px] rounded-10px overflow-hidden">
          <Link
            href={{
              pathname: AppRoutes.profile.archived_posts,
              query: { account_address: loggedInUser.account_address },
            }}
            className={clsx(
              `w-full text-[13px] text-white flex items-center gap-3 transition hover:bg-background-shade-2 px-4 py-4`
            )}
          >
            <HiOutlineArchive className="w-[18px] h-[18px]" />
            <span>Archived Posts</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile3DotsMenu;
