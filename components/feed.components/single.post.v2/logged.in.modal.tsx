import React, { useEffect } from "react";

import clsx from "clsx";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

import { ModalPortal } from "@/components/modal/modal.portal";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LoggedInModal: React.FC<Props> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalPortal wrapperId="post-delete-modal">
      <div
        className={`font-monto flex justify-center items-center fixed inset-0 z-[999] backdrop-filter backdrop-blur-lg overflow-y-auto overflow-x-hidden`}
      >
        <div className="bg-popup-0 w-full max-w-[656px] rounded-10px p-4 fmd:p-6 space-y-4 fmd:space-y-6 mx-2">
          <header className="flex items-center justify-between text-white">
            <h3 className="text-lg font-semibold">
              <Image
                src="/images/centher.logo.png"
                alt="Centher Logo"
                width={154}
                height={32}
              />
            </h3>
            <button onClick={onClose}>
              <IoClose className="w-6 h-6 cursor-pointer" />
            </button>
          </header>

          <main className="py-2 fmd:p-4">
            <div className="space-y-8 text-center mt-4">
              <h3 className="font-semibold text-2xl text-white">
                Register or login to <b>Centher</b>
              </h3>
              <div>
                <Link href={"/auth/login"}>
                  <ActionButton
                    //not confirm yet we need to close the modal or not
                    // onClick={onClose}
                    className="bg-brand-primary mb-6 hover:bg-brand-primary-dark text-black"
                  >
                    Login
                  </ActionButton>
                </Link>

                <Link href={"/auth/register "}>
                  <ActionButton
                    //not confirm yet we need to close the modal or not
                    // onClick={onClose}
                    className="bg-black-shade-7 hover:bg-gray-900 text-gray-shade-10"
                  >
                    Register
                  </ActionButton>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ModalPortal>
  );
};

interface ActionButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        `px-4 py-2 fmd:py-3 w-full font-bold rounded-lg transition-all`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
