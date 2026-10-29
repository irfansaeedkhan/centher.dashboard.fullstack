import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { BsThreeDots } from "react-icons/bs";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { HiOutlineArchive } from "react-icons/hi";
import { MdSettingsBackupRestore } from "react-icons/md";

import { DeleteModal } from "./delete.modal";
import { PostType } from "./main";

interface Props {
  postType: PostType;
  isBefore15Minutes: boolean;
  onClickEdit: () => void;
  onClickDelete: () => Promise<void>;
  onClickArchive: () => Promise<void>;
  onClickRestore: () => Promise<void>;
}

export const PostActionMenu: React.FC<Props> = ({
  postType,
  isBefore15Minutes,
  onClickArchive,
  onClickRestore,
  onClickDelete,
  onClickEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const menuRef = React.useRef<HTMLDivElement>(null);

  // Feed fix 2026-10-29 (menu not opening / second click): the old
  // menu was a bare SVG icon with an onClick toggle plus a
  // permanently-mounted useOnClickOutside (mousedown) listener — the
  // same class of bug as the profile header menu, which needed a
  // second click. Two changes, both about the opening click:
  //  1. The toggle is a real <button> (keyboard/focusable, full hit
  //     area, aria-expanded) instead of a bare SVG icon, and it
  //     stops propagation so the feed/profile card's navigate-on-
  //     click wrapper can never swallow the toggle.
  //  2. The outside-close listener is mounted ONLY while the menu is
  //     open, on the click phase. A permanently-mounted outside
  //     listener can race the toggle on the very click that opens
  //     the menu (open-then-immediately-close reads as "did not
  //     open"); a listener added by the open render cannot fire for
  //     the click that caused that render. Escape also closes.
  useEffect(() => {
    if (!isOpen) return;
    const onDocumentClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
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

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-label="Post actions"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="flex cursor-pointer items-center justify-center rounded-md p-1"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          // Round 2 (Escape must close): the document-level Escape
          // listener in the effect above already exists; this
          // focus-local handler is a second path so Escape closes the
          // menu even when focus sits on the toggle itself.
          onKeyDown={(e) => {
            if (e.key === "Escape" && isOpen) setIsOpen(false);
          }}
        >
          <BsThreeDots className="h-6 w-6 fill-gray-shade-7" />
        </button>

        {isOpen && (
          <div
            className={clsx(
              "absolute right-0 top-full z-[500] overflow-hidden rounded-10px bg-black-shade-12",
              postType === "archived" ? "w-[190px]" : "w-[170px]"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {isBefore15Minutes && postType !== "archived" && (
              <MenuButton
                onClick={() => {
                  setIsOpen(false);
                  onClickEdit();
                }}
              >
                <FiEdit className="h-[18px] w-[18px]" />
                <span>Edit</span>
              </MenuButton>
            )}

            {/* Post-grill Q13: replies have no archive concept
                server-side (the item PATCHed a comment id into the
                posts archive route → guaranteed 404, silently
                swallowed). Don't offer an action that cannot work. */}
            {postType !== "reply" && postType !== "reply-w-parent-header" && (
              <MenuButton
                onClick={async (e) => {
                  const button = e.currentTarget;
                  if (button.disabled) return;

                  button.disabled = true;
                  setIsOpen(false);

                  if (postType === "archived") {
                    await onClickRestore();
                  } else {
                    await onClickArchive();
                  }
                  button.disabled = false;
                }}
                className="group"
              >
                {postType !== "archived" ? (
                  <HiOutlineArchive className="h-[18px] w-[18px]" />
                ) : (
                  <MdSettingsBackupRestore className="h-[18px] w-[18px]" />
                )}
                <span className="flex-grow text-left">
                  {postType !== "archived" ? "Archive" : "Restore Post"}
                </span>
                <CgSpinner className="hidden h-4 w-4 animate-spin group-disabled:block" />
              </MenuButton>
            )}

            <MenuButton
              onClick={() => {
                setIsOpen(false);
                setIsDeleteModalOpen(true);
              }}
              className={clsx({
                "text-danger": postType === "archived",
              })}
            >
              <FiTrash2 className="h-[18px] w-[18px]" />
              <span>Delete {postType === "archived" && "Forever"}</span>
            </MenuButton>
          </div>
        )}
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={onClickDelete}
        itemLabel={
          postType === "reply" || postType === "reply-w-parent-header"
            ? "Reply"
            : "Post"
        }
      />
    </>
  );
};

interface MenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const MenuButton: React.FC<MenuButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={clsx(
        `flex w-full items-center gap-x-2.5 px-5 py-4 text-sm font-semibold text-white hover:bg-background-shade-2`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
