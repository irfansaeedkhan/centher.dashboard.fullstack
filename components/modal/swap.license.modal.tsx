import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useUser from "@/hooks/use.user";
import { AppRoutes } from "@/constants/app.routes";
import Button from "../button";
import ModalContainer from "./modal-container";

export const SwapLicenseModal = () => {
  const { user } = useUser();
  const [showSwapLicenseModal, setShowSwapLicenseModal] = useState(false);

  useEffect(() => {
    if (user) {
      setShowSwapLicenseModal(true);
    }
  }, [user]);

  return (
    <ModalContainer
      modalId="swap-license-modal"
      isOpen={showSwapLicenseModal}
      onClose={() => setShowSwapLicenseModal(false)}
    >
      <div className="flex flex-col gap-6">
        <Image
          src="/images/swap-license.png"
          alt="Swap license"
          width={442}
          height={251}
          className="h-[251px] w-full rounded-md object-cover"
        />
        <div className="mx-auto flex max-w-[403px] flex-col items-center gap-3">
          <h3 className="textGradient text-xl font-semibold leading-6">
            Swap your license
          </h3>
          <p className="text-center text-sm text-[#DBDDE6]">
            Your old DeXagon Real Estate Licenses are not compatible with the
            current version of our Marketplace. Please click the button below to
            swap your license with a new version compatible with Centher.
          </p>
        </div>
        <Link
          className="w-full"
          href={AppRoutes.marketplace.swap_nfts}
          onClick={() => setShowSwapLicenseModal(false)}
        >
          <Button className="w-full" title="Swap license" variant="primary" />
        </Link>
      </div>
    </ModalContainer>
  );
};
