import React from "react";
import { useRouter } from "next/router";

export const BackButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      className={`text-brand-primary text-[11px] px-4 py-2 bg-brand-primary/10 rounded-full hover:bg-brand-primary hover:text-black-shade-2 transition font-medium w-fit`}
      onClick={() => router.back()}
    >
      Back
    </button>
  );
};
