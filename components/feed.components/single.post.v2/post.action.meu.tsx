import React, { useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import clsx from "clsx";
import { BsThreeDots } from "react-icons/bs";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { HiOutlineArchive } from "react-icons/hi";

import { DeleteModal } from "./delete.modal";

interface Props {
  isBefore15Minutes: boolean;
  onClickEdit: () => Promise<void>;
  onClickDelete: () => Promise<void>;
  onClickArchive: () => Promise<void>;
}

export const PostActionMenu: React.FC<Props> = ({
  isBefore15Minutes,
  onClickArchive,
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
          <div className="absolute right-0 z-[500] top-full w-[170px] bg-black-shade-12 rounded-10px overflow-hidden">
            {/* {isBefore15Minutes && (
              <MenuButton onClick={onClickEdit}>
                <FiEdit className="w-[18px] h-[18px]" />
                <span>Edit</span>
              </MenuButton>
            )} */}

            <MenuButton onClick={onClickArchive}>
              <HiOutlineArchive className="w-[18px] h-[18px]" />
              <span>Archive</span>
            </MenuButton>

            <MenuButton onClick={() => setIsDeleteModalOpen(true)}>
              <FiTrash2 className="w-[18px] h-[18px]" />
              <span>Delete</span>
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
