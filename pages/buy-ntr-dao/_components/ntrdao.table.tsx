// React, Next, NPM Packages
import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import ctl from "@netlify/classnames-template-literals";

// App imports
import Button from "@/components/button";
import { CustomProgressModal } from "@/components/modal/custom.progress.modal";
import { claimNtrTokens } from "@/web3/utils/call.helpers";
import { PurchasedInfo, RoundInfo } from "@/web3/constants/types";
import { ModalProps } from "./launchpad.modal";
import { useGetPurchasedInfo } from "@/web3/hooks/use.contracts.functions";

export const NTRDAOTable: React.FC<NTRDAOTableProps> = ({
  roundInfo,
  // purchasedInfo,
  // reload,
  // setReload,
  // roundNumber,
}) => {
  // For modal
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(<div></div>);
  const [modalTitle, setModalTitle] = useState<string>(
    "Authorization Contract"
  );
  const [modalSubTitle, setModalSubTitle] = useState<string>("");
  const [modalStatus, setModalStatus] = useState("success");
  const [modalDescription, setModalDescription] = useState<string>("");
  const [modalButtonTitle, setModalButtonTitle] = useState<string>("");

  const { account, library } = useWeb3React();
  const [clickItemNumber, setClickItemNumber] = useState(0);

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    status: "warning",
    title: "Authorization Contract",
    subtitle: `Allow Nether NFT to use your ${"selectedTokenA.tokenName"} token`,
    bodyText: `Confirmation of the ${"selectedTokenA.tokenName"} token to interact with the Nether NFT contract.`,
    confirmButtonText: "Authorize",
    onClose: () => {
      setModal((prev) => ({
        ...prev,
        isOpen: false,
      }));
    },
    onClickConfirm: () => {},
  });

  const [purchasedInfo, setPurchasedInfo] = useState<PurchasedInfo[]>([]);

  const [reload, setReload] = useState(false);
  const purchasedInfoResponse = useGetPurchasedInfo(
    account,
    roundInfo.round,
    reload
  );

  const handleClaim = async () => {
    try {
      setModalStatus("progress");
      const result = await claimNtrTokens(
        library,
        roundInfo.round,
        clickItemNumber
      );
      // setReload(!reload);
      if (result.success) {
        toast.success("Claim Successed!");
        setModalSubTitle("Claim Success!");
        setModalStatus("success");
        setModalDescription(
          `You claimed NTR tokens. Please check your balance.`
        );
        setModalButtonTitle("");
        setShowModal(true);
      } else {
        toast.error("Transaction has been failed.");
        setModalStatus("failed");
      }
    } catch (error) {
      setModalStatus("failed");
    }
  };

  const claimFunc = (index: number) => {
    setModalTitle("Claim NTRDAO");
    setModalSubTitle("Do you want to claim NTRDAO?");
    setModalStatus(`claim`);
    setModalDescription(`Confirmation that you claim NTRDAO.`);
    setModalButtonTitle("Claim Now");
    setShowModal(true);
    setClickItemNumber(Number(index));
  };

  return (
    <div className={nftdaoTableContainer}>
      <table className={table}>
        <thead className={thead}>
          <tr>
            <th scope="col" className={th}>
              #
            </th>
            <th scope="col" className={th}>
              Purchase date
            </th>
            <th scope="col" className={th}>
              BUSD paid amount
            </th>
            <th scope="col" className={th}>
              NTRDOA amount
            </th>
            <th scope="col" className={th}>
              Bonus
            </th>
            <th scope="col" className={th}>
              Lock months
            </th>
            <th scope="col" className={th}>
              Time remaining
            </th>
            <th scope="col" className={th}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {purchasedInfo?.map((item: PurchasedInfo, index: number) => {
            return (
              <tr className={tbodyTR} key={index}>
                <td className={tdh}>{index + 1}</td>
                <td className={td}>{item.purchasedDate}</td>
                <td className={td}>{`${item.contributedBusdAmount} BUSD`}</td>
                <td className={td}>{`${item.ntrdaoAmount} NTRDAO`}</td>
                <td className={td}>{`${item.bonusAmount} NTRDAO`}</td>
                <td className={td}>{`${item.lockmonths} MONTH`}</td>
                <td className={td}>{`${
                  item.remainingDate >= 0 ? item.remainingDate : 0
                } days`}</td>
                <td className={td}>
                  <Button
                    title={item.claimed ? "Claimed" : "Claim"}
                    variant={`${
                      item.remainingDate <= 0 && !item.claimed ? "v1" : "v2"
                    }`}
                    className="max-w-[80px]"
                    onClick={() => claimFunc(index)}
                    disabled={
                      item.remainingDate > 0 || item.claimed ? true : false
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {showModal && (
        <CustomProgressModal
          onClose={() => setShowModal(false)}
          title={modalTitle}
          status={modalStatus}
          subTitle={modalSubTitle}
          description={modalDescription}
          buttonTitle={modalButtonTitle}
          handleBuyNow={() => {}}
          handleAutorize={() => {}}
          handleClaim={handleClaim}
        />
      )}
    </div>
  );
};

// stying

const nftdaoTableContainer = ctl(` 
overflow-x-auto relative  shadow-md rounded-2xl mt-8 lg:mt-12
`);
const table = ctl(` 
overflow-hidden w-full border-2 rounded-2xl border-gray-shade-3 text-sm text-left text-gray-500 bg-black-shade-4
`);
const thead = ctl(` 
text-14px text-gray-shade-7 uppercase bg-background-shade-3 
`);
const th = ctl(` 
py-4 lg:py-7 px-5 lg:px-3
`);
const tbodyTR = ctl(` 
border-b border-gray-shade-3  odd:bg-black-shade-3 even:bg-black-shade-11
`);
const td = ctl(` 
text-14px py-4 lg:py-7 px-5 lg:px-3 text-white font-medium
`);
const tdh = ctl(` 
text-16px py-4 lg:py-7 px-5 lg:px-3 text-white font-semi-bold
`);

interface NTRDAOTableProps {
  roundInfo: RoundInfo;
  // purchasedInfo: PurchasedInfo[] | undefined;
  // reload: boolean;
  // setReload: any;
  // roundNumber: number;
}

interface ModalState {
  isOpen: boolean;
  status: ModalProps["status"];
  title: ModalProps["title"];
  subtitle: ModalProps["subtitle"];
  bodyText: ModalProps["bodyText"];
  confirmButtonText: ModalProps["confirmButtonText"];
  onClose: ModalProps["onClickClose"];
  onClickConfirm: ModalProps["onClickConfirm"];
}
