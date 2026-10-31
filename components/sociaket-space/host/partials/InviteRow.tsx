import React from "react";
import Image from "next/image";
import Button from "@/components/button";
import { VipIcon } from "@/assets/svgs";

interface InviteProps {
  user: any;
  onAddClick?: (user: any) => void;
  onRemoveClick?: (user: any) => void;
}

const InviteRow: React.FC<InviteProps> = ({
  user,
  onAddClick,
  onRemoveClick,
}) => {
  return (
    <div
      className={`flex items-center gap-[12px] p-[12px] hover:rounded-[10px] hover:bg-[#141416] ${
        user.isActive ? `rounded-[10px] bg-[#141416]` : ""
      }`}
    >
      <div className="h-[40px] w-[40px]">
        <Image
          src={user.profile_image}
          alt={user.display_name}
          width={40}
          height={40}
          objectFit="cover"
          className="rounded-full object-cover"
        />
      </div>

      <div className="flex flex-grow items-center gap-[6px] text-sm">
        <span>{user.display_name}</span>
        {user.membership.status == "citizen" && (
          <span className="bottom-0 right-[-6px] rounded-full bg-[#1C1C1E]">
            <VipIcon />
          </span>
        )}
      </div>

      <div className="flex gap-[12px]">
        {onAddClick && (
          <Button
            title="Invite"
            variant="primary"
            onClick={() => onAddClick(user)}
            className={` text-xs font-medium`}
            borderRounded="10px"
          />
        )}

        {onRemoveClick != undefined && (
          <Button
            title="Remove"
            variant="danger"
            onClick={() => onRemoveClick(user)}
            className={`text-xs font-medium `}
            borderRounded="10px"
          />
        )}
      </div>
    </div>
  );
};

export default InviteRow;
