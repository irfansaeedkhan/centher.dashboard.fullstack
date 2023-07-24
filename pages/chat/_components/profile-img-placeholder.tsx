import React from "react";
import clsx from "clsx";
import { ChatUserIcon } from "@/assets/svgs";

interface imgPlaceholderProps {
  className?: string;
}

const ProfileImgPlaceholder: React.FC<imgPlaceholderProps> = ({
  className,
}) => {
  let gradientArr = [
    "linear-gradient(309.7deg, #92BF58 8.03%, #D6C051 109.94%)",
    "linear-gradient(309.7deg, #DAA352 8.03%, #FF7474 109.94%)",
    "linear-gradient(309.7deg, #6B69D9 8.03%, #54C5CC 109.94%)",
    "linear-gradient(47.79deg, #59F5FF -8.98%, #DE782D 119.45%)",
    "linear-gradient(130.95deg, #6C7AF7 -9.48%, #83EAD7 108.82%)",
    "linear-gradient(304.23deg, #6AB1A0 7.17%, #D2D253 140.47%",
    "linear-gradient(313.26deg, #435DE9 -12.34%, #5E5A91 108.08%)",
    "linear-gradient(309.7deg, #AE81E8 8.03%, #304352 109.94%)",
    "linear-gradient(309.7deg, #FFF94C 8.03%, #304352 109.94%)",
    "linear-gradient(309.7deg, #FFD194 8.03%, #304352 109.94%)",
  ];

  let randomBackground =
    gradientArr[Math.floor(Math.random() * gradientArr.length)];

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full ",
        className
      )}
      style={{ background: randomBackground }}
    >
      <ChatUserIcon />
    </div>
  );
};

export default ProfileImgPlaceholder;
