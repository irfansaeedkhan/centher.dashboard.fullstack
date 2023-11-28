import React, { FC, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { clsx } from "clsx";
import { Faq } from "./faqs-data";

interface Props {
  faq: Faq;
}

const SingleFaq: FC<Props> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      key={faq.id}
      className={clsx(
        "flex h-auto min-h-[86px] w-full justify-between gap-2 rounded-xl border border-gray-shade-3 bg-background-shade-3 px-4 py-4 fsm:rounded-3xl fsm:px-8",
        isOpen ? "" : "items-center"
      )}
    >
      <div className="flex flex-col gap-6">
        <p className="text-base font-semibold text-white fsm:text-lg">
          {faq.question}
        </p>
        {isOpen && (
          <p className="text-sm font-normal leading-[22px] tracking-[-.14px] text-gray-shade-14">
            {faq.answer}
          </p>
        )}
      </div>

      {isOpen ? (
        <FiMinus
          className="flex-shrink-0 cursor-pointer text-base text-white"
          onClick={() => setIsOpen(false)}
        />
      ) : (
        <FiPlus
          className="flex-shrink-0 cursor-pointer text-base text-white"
          onClick={() => setIsOpen(true)}
        />
      )}
    </div>
  );
};

export default SingleFaq;
