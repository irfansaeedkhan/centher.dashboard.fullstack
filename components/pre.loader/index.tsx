import React, { useRef } from "react";
import Image from "next/image";

import { ModalPortal } from "@/components/modal/modal.portal";

export const PreLoader: React.FC = () => {
  const PassportModalRef = useRef<HTMLDivElement>(null);

  return (
    <ModalPortal wrapperId="pre-loader">
      <div
        className={`fixed inset-0 z-[3050] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black-shade-8 font-monto backdrop-blur-[7px] backdrop-filter`}
      >
        <Image
          src="/images/preloader.png"
          alt="pre loader"
          width={64}
          height={64}
          className="h-16 w-16 flex-shrink-0 object-cover"
        />
      </div>
    </ModalPortal>
  );
};
