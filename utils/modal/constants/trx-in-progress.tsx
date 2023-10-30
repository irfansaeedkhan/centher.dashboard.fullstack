import { LoaderIcon } from "@/assets/svgs";
import Button from "@/components/button";

export const trxInProgress = {
  title: "Transaction in progress",
  visibility: true,
  content: function () {
    return (
      <div className="flex w-full flex-col gap-2 px-2 pt-4 text-center fmd:px-4">
        <LoaderIcon className="mx-auto animate-spin" />
        <h3 className="text-18px pt-5 font-semibold leading-6 text-white">
          Transaction in progress
        </h3>
        <p className="text-14px font-normal leading-6 text-gray-shade-2">
          Your transaction is in progress, Please wait.
        </p>
        <Button
          title="Cancel"
          disabled
          variant={"primary"}
          className="mt-6 rounded-[14px] opacity-50"
        />
      </div>
    );
  },
};
