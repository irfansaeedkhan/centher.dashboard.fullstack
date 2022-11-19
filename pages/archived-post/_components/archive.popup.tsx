import { Restore, Trash } from "@/assets/svgs";
import { axiosNodeApi } from "@/utils/axios";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";

interface IArchivedPost {
  onClose: () => void;
  id: string;
}

const ArchivePopup: React.FC<IArchivedPost> = ({ onClose, id }) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => {
    onClose();
  });

  const handleUnarchive = (id: string) => {
    axiosNodeApi
      .post(`api/socials/posts/${id}/unarchive`)
      .then(() => {
        onClose();
        toast.success("Post unarchived successfully");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  return (
    <div
      ref={ref}
      className="absolute w-[229px] bg-black-shade-12 rounded-lg -right-1 top-8 z-10"
    >
      <button
        className="flex gap-2 h-14 items-center px-6 py-4"
        onClick={() => handleUnarchive(id)}
      >
        <Restore />
        <span className="text-white text-sm">Restore to profile</span>
      </button>
      <div className="flex gap-2 h-14 items-center cursor-pointer px-6 py-4">
        <Trash />
        <span className="text-white text-sm">Delete forever</span>
      </div>
    </div>
  );
};

export default ArchivePopup;
