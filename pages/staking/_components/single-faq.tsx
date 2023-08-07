import React, { FC, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Faq } from "./faqs-data";

interface Props {
  faq: Faq;
}

const SingleFaq: FC<Props> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return isOpen ? (
    <div key={faq.id} className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <p className="text-lg font-semibold text-white">{faq.question}</p>
        <FiMinus
          className="cursor-pointer text-base text-white"
          onClick={() => setIsOpen(false)}
        />
      </div>
      <p className="text-sm font-normal leading-[22px] tracking-[-.14px] text-gray-shade-14">
        {faq.answer}
      </p>
    </div>
  ) : (
    <div
      key={faq.id}
      className="flex h-auto min-h-[86px] w-full items-center justify-between rounded-3xl border border-gray-shade-3 bg-background-shade-3 px-8"
    >
      <p className="text-lg font-semibold text-white">{faq.question}</p>

      <FiPlus
        className="cursor-pointer text-base text-white"
        onClick={() => setIsOpen(true)}
      />
    </div>
  );
};

export default SingleFaq;
