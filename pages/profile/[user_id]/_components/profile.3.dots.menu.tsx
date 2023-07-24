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
    <div
      className="absolute -top-[45px] right-2 z-[100]"
      ref={menuContainerRef}
    >
      <button
        className="rounded-md bg-black/30 p-1.5"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <HiOutlineDotsVertical className="h-4 w-4 stroke-white" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] right-0 w-[200px] overflow-hidden rounded-10px bg-black-shade-12">
          <Link
            href={{
              pathname: AppRoutes.profile.archived_posts,
              query: { user_id: loggedInUser._id },
            }}
            className={clsx(
              `flex w-full items-center gap-3 px-4 py-4 text-[13px] text-white transition hover:bg-background-shade-2`
            )}
          >
            <HiOutlineArchive className="h-[18px] w-[18px]" />
            <span>Archived Posts</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile3DotsMenu;
