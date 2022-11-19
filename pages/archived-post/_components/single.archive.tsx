import { Archived, MoreIcon, Polygon } from "@/assets/svgs";
import moment from "moment";
import Image from "next/image";
import React, { useState } from "react";
import ArchivePopup from "./archive.popup";

interface IArchivedPost {
  post: {
    _id: string;
    createdAt: string;
  };
}
const SingleArchive: React.FC<IArchivedPost> = ({ post }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  return (
    <div
      className="h-[116px] bg-gray-shade-9 rounded-xl px-6 py-4 space-y-2"
      key={post._id}
    >
      <div className="flex gap-2 items-center">
        <Archived />
        <span className="text-sm text-[#F6F7FA]">
          Archived {moment(post.createdAt).format("MMM Do YY")}
        </span>
      </div>
      <div className="flex gap-3 items-center">
        <Image
          src={"/images/a1.png"}
          width={44}
          height={44}
          className="rounded-full object-cover !w-[44px] !h-[44px]"
          alt={"profile image"}
          sizes={"256px"}
        />
        <div className="flex justify-between flex-grow items-start">
          <div className="">
            <div className="flex gap-1 text-sm">
              <span className="text-white font-semibold">John wedson </span>
              <span className="text-white">You shared a post </span>
              <span className="text-gray-shade-7">
                {moment(post.createdAt).format("MMM Do YY")}
              </span>
            </div>
            <div className="mt-2 text-sm font-medium text-brand-primary">
              yourpost.link.come/34214
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setPopupOpen(!popupOpen)}>
              <MoreIcon />
            </button>
            {popupOpen && (
              <>
                <span className="absolute right-[2px] -bottom-1">
                  <Polygon />
                </span>
                <ArchivePopup
                  onClose={() => setPopupOpen(false)}
                  id={post._id}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleArchive;
