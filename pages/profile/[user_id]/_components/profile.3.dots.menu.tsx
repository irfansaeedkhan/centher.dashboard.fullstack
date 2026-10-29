import React, { useEffect, useRef } from "react";
import Link from "next/link";
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

  // Feed fix 2026-10-29 (second-click menu): same class as the post
  // action menu. The old permanently-mounted useOnClickOutside
  // (mousedown) listener could race the toggle on the opening click,
  // so the menu needed a second click. The outside-close listener
  // is now mounted only while open, on the click phase — it cannot
  // fire for the click that opened the menu — plus Escape to close.
  useEffect(() => {
    if (!isOpen) return;
    const onDocumentClick = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  if (!isOwnProfile || !loggedInUser) return null;

  return (
    <div className="absolute -top-[45px] right-2 z-[49]" ref={menuContainerRef}>
      <button
        type="button"
        aria-label="Profile actions"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="rounded-md bg-black/30 p-1.5"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        <HiOutlineDotsVertical className="h-4 w-4 stroke-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+4px)] w-[200px] overflow-hidden rounded-10px bg-black-shade-12">
          <Link
            href={{
              pathname: AppRoutes.profile.archived_posts,
              query: { user_id: loggedInUser._id },
            }}
            onClick={() => setIsOpen(false)}
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
