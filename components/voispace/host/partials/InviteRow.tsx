import React from "react";
import Image from "next/image";
import Button from "@/components/button";

interface InviteProps {
  user: any;
}

const InviteRow: React.FC<InviteProps> = ({ user }) => {
  const handler = (action: string) => {
    alert(action);
  };

  return (
    <div
      className={`flex items-center gap-[12px] p-[12px] hover:rounded-[10px] hover:bg-[#141416] ${
        user.isActive ? `rounded-[10px] bg-[#141416]` : ""
      }`}
    >
      <div className="h-[40px] w-[40px]">
        <Image
          src={user.imageURL}
          alt={user.name}
          width={40}
          height={40}
          objectFit="cover"
          className="rounded-full object-cover"
        />
      </div>

      <div className="flex flex-grow items-center gap-[6px]">
        <span>{user.name}</span>
        {user.isCitizen && (
          <span className="primary-gradient-btn-text primary-btn-text-gradient relative rounded-[7px] border px-[5px] py-[3px] font-monto text-[9px] font-medium">
            CITIZEN
          </span>
        )}
      </div>

      <div className="flex gap-[12px]">
        <Button
          title="Invite"
          variant="primary"
          onClick={() => handler("Accept")}
          className={` text-xs font-medium`}
          borderRounded="10px"
        />
      </div>
    </div>
  );
};

export default InviteRow;
