import React, { useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
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

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <>
      <div className="relative" ref={menuRef}>
        <BsThreeDots
          className="fill-gray-shade-7 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        />

        {isOpen && (
          <div
            className={clsx(
              "absolute right-0 z-[500] top-full bg-black-shade-12 rounded-10px overflow-hidden",
              postType === "archived" ? "w-[190px]" : "w-[170px]"
            )}
          >
            {isBefore15Minutes && postType !== "archived" && (
              <MenuButton onClick={onClickEdit}>
                <FiEdit className="w-[18px] h-[18px]" />
                <span>Edit</span>
              </MenuButton>
            )}

            <MenuButton
              onClick={async (e) => {
                const button = e.currentTarget;
                if (button.disabled) return;

                button.disabled = true;

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
                <HiOutlineArchive className="w-[18px] h-[18px]" />
              ) : (
                <MdSettingsBackupRestore className="w-[18px] h-[18px]" />
              )}
              <span className="text-left flex-grow">
                {postType !== "archived" ? "Archive" : "Restore Post"}
              </span>
              <CgSpinner className="w-4 h-4 animate-spin hidden group-disabled:block" />
            </MenuButton>

            <MenuButton
              onClick={() => setIsDeleteModalOpen(true)}
              className={clsx({
                "text-danger": postType === "archived",
              })}
            >
              <FiTrash2 className="w-[18px] h-[18px]" />
              <span>Delete {postType === "archived" && "Forever"}</span>
            </MenuButton>
          </div>
        )}
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={onClickDelete}
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
      className={clsx(
        `w-full flex items-center gap-x-2.5 text-white text-sm font-semibold px-5 py-4 hover:bg-background-shade-2`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
