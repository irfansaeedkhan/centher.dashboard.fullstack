import { LoaderIcon } from "@/assets/svgs";

export const trxInProgress = {
  title: "Transaction in progress",
  visibility: true,
  content: () => (
    <div className="flex w-full flex-col gap-4 px-2 pt-2 text-center fmd:px-4 fmd:pt-4">
      <LoaderIcon className="mx-auto animate-spin" />
      <h3 className="text-18px font-semibold leading-6 text-white">
        Transaction in progress
      </h3>
      <p className="text-14px font-normal leading-6 text-gray-shade-2">
        Your transaction is in progress, Please wait.
      </p>
    </div>
  ),
};
