import React, { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { LuInfo } from "react-icons/lu";

interface Props {
  showInfoIcon: boolean;
  title: string;
  negativeTitle: string;
  positiveTitle: string | null;
  description: string;
}

const ListCardSpacing: React.FC<Props> = ({
  showInfoIcon,
  title,
  negativeTitle,
  positiveTitle,
  description,
}) => {
  const ref = useRef(null);
  const [openModal, setOpenModal] = useState(false);

  useOnClickOutside(ref, () => setOpenModal(false));

  return (
    <div className="relative flex w-full">
      <span className="w-1/2 text-sm text-gray-shade-14">{title}</span>
      <div className="flex w-1/2 justify-end text-sm font-medium text-white">
        {showInfoIcon ? (
          <div className="relative flex items-center gap-1.5">
            <span>{negativeTitle}</span>
            <LuInfo
              className="h-4 w-4 cursor-pointer text-[#E34048]"
              onClick={() => setOpenModal(!openModal)}
            />
            {openModal && (
              <div
                ref={ref}
                className="absolute right-0 top-[1.3rem] z-[100] flex w-[300px] max-w-[220px] flex-col gap-2 overflow-y-auto rounded-lg border border-[#262A2D] bg-transparent p-3 text-xs text-white shadow-lg backdrop-blur-[50px]"
              >
                <LuInfo className="h-4 w-4 cursor-pointer text-[#E34048]" />
                <span>{description}</span>
              </div>
            )}
          </div>
        ) : (
          <span>{positiveTitle}</span>
        )}
      </div>
    </div>
  );
};

export default ListCardSpacing;
