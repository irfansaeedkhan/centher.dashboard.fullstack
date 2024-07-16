import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { ModalPortal } from "@/components/modal/modal.portal";
import { AppRoutes } from "@/constants/app.routes";
import Button from "@/components/button";

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
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <ModalPortal wrapperId="post-delete-modal">
        <div
          className={`fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto overflow-x-hidden font-monto backdrop-blur-lg backdrop-filter`}
        >
          <div className="mx-2 w-full max-w-[656px] space-y-4 rounded-10px bg-popup-0 p-4 fmd:space-y-6 fmd:p-6">
            <header className="flex items-center justify-between text-white">
              <h3 className="text-lg font-semibold">
                <Image
                  src="/images/369x.logo.png"
                  alt="369x Logo"
                  width={75}
                  height={39}
                  className="w-18"
                />
              </h3>
              <button onClick={onClose}>
                <IoClose className="h-6 w-6 cursor-pointer" />
              </button>
            </header>

            <main className="py-2 fmd:p-4">
              <div className="mt-4 space-y-8 text-center">
                <h3 className="text-2xl font-semibold text-white">
                  Register or login to <b>Centher</b>
                </h3>
                <div>
                  <Link href={AppRoutes.auth.login}>
                    <Button
                      title={"Login"}
                      variant={"primary"}
                      className={"mb-2 w-full"}
                    />
                  </Link>

                  <Link href={AppRoutes.auth.register}>
                    <Button
                      title={"Register"}
                      variant={"primary"}
                      className={"w-full"}
                    />
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </ModalPortal>
    </div>
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
        `w-full rounded-lg px-4 py-2 font-bold transition-all fmd:py-3`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
