import Button from "@/components/button";
import { CustomNumberInput } from "@/components/custom-number-input";
import React, { useState } from "react";

export const BuyToken = () => {
  const [payAmount, setPayAmount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);

  return (
    <div className="flex h-auto w-full flex-col gap-6 rounded-xl bg-black-shade-9 p-4 fxm:p-6">
      <div className="flex w-full flex-shrink-0 flex-col">
        <p className="font-small ml-1 text-sm text-gray-shade-14">Pay</p>

        <div className="flex w-full flex-row gap-2">
          <div className="col-span-2 w-full text-sm font-medium text-white md:col-span-2">
            <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
              <CustomNumberInput
                value={payAmount === 0 ? "" : payAmount}
                placeholder="0"
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="block w-full rounded-lg border-0 bg-transparent px-5 py-3 text-2xl placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          <div className="mx-1 mt-2 block w-2/6 appearance-none rounded-lg border-0 text-sm">
            {/* <DropdownSwapForm
              placeholder="Token"
              options={dropDownTokens?.base ?? []}
              selectedValue={baseToken ? baseToken : tokens.base[0]}
              onSelect={(value) => {
                setBaseToken(value);
              }}
            /> */}
          </div>
        </div>
        <p className="my-4 ml-1 text-sm font-medium text-gray-shade-14">
          Balance 0
        </p>
        <div className="mb-5 mt-2 border-b-2 border-gray-shade-3"></div>
        <p className="font-small ml-1 text-sm text-gray-shade-14">Receive</p>

        <div className="flex w-full flex-row gap-2">
          <div className="col-span-2 w-full text-sm font-medium text-white md:col-span-2">
            <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
              <CustomNumberInput
                value={receivedAmount === 0 ? "" : receivedAmount}
                onChange={(e) => setReceivedAmount(Number(e.target.value))}
                placeholder="0"
                className="block w-full rounded-lg border-0 bg-transparent px-5 py-3 text-2xl placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          <div className="mx-1 mt-2 block w-2/6 appearance-none rounded-lg border-0 text-sm">
            {/* <DropdownSwapForm
              placeholder="Token"
              options={dropDownTokens?.quote ?? []}
              selectedValue={quoteToken ? quoteToken : tokens.quote[0]}
              onSelect={(value) => {
                setQuoteToken(value);
              }}
            /> */}
          </div>
        </div>
        <p className="font-small my-4 ml-1 text-sm text-gray-shade-14">
          Select a token
        </p>

        <Button
          title={"Buy"}
          // disabled={isSwapping}
          // onClick={() => doSwap()}
          variant="primary"
          className="mt-4 w-full flex-shrink-0 rounded-[10px] text-sm fsm:text-base"
        />
      </div>
    </div>
  );
};
