import React from "react";
import useUser from "@/hooks/use.user";
import ModalContainer from "../modal-container";

export const WrongConnectedAccountModal = () => {
  const { user } = useUser();

  return (
    <>
      <ModalContainer
        modalId="wrong-connected-account-modal"
        isOpen={true}
        onClose={() => {}}
        shouldCloseOnEsc={false}
        shouldCloseOnOverlayClick={false}
      >
        <div className="">
          <h1 className="text-center text-lg font-semibold text-white">
            Wrong Connected Account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-shade-14">
            You are connected to wrong account. Switch to the correct account in
            your wallet to continue using the app.
          </p>

          <div className="mt-8 text-center">
            <h3 className="text-base font-medium text-white">
              Correct Account
            </h3>
            <p className="mt-1 text-sm text-gray-shade-14">{user?._id}</p>
          </div>
        </div>
      </ModalContainer>
    </>
  );
};
