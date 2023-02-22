import React from "react";
import Link from "next/link";
import { CgArrowLeft } from "react-icons/cg";

import { AppRoutes } from "@/constants/app.routes";

export const BackButton = () => {
  return (
    <Link
      href={AppRoutes.settings.index}
      className="mb-6 inline-block cursor-pointer rounded-full bg-black-shade-10 p-2 flg:hidden"
    >
      <CgArrowLeft className="h-6 w-6 text-white" />
    </Link>
  );
};
