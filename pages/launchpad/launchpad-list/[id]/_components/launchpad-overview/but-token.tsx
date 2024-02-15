import Button from "@/components/button";
import { CustomNumberInput } from "@/components/custom-number-input";
import React, { useEffect, useState } from "react";
import { PresaleDataType } from "../../../_components/launchpad-card-data";
import { customLog } from "@/utils/custom.log";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import useUser from "@/hooks/use.user";
import { useWallet } from "@/web3/hooks/use.wallet";
import { BlockchainConfig } from "@/web3/blockchain/config";
import { formatEther } from "viem";
import { PresaleRoundDetails } from "@/web3/blockchain/types";
import { SmartContractProvider } from "@/web3/blockchain/providers/smart.contract.provider";
import { SmartContractName } from "@/web3/blockchain/enum/smart.contract.name.enum";

interface Props extends PresaleDataType {
  token_name: string;
  token_symbol: string;
  website: string;
  currentRound: number;
}

export const BuyToken: React.FC<Props> = ({
  token_symbol,
  fundType,
  token,
  currentRound,
}) => {
  const { user } = useUser();
  const { getSigner, getProvider } = useWallet();
  const [payAmount, setPayAmount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);

  const [tokenBalance, setTokenBalance] = useState(0);
  const [roundPrice, setroundPrice] = useState(-1);
  const [allowance, setAllowance] = useState(false);

  currentRound = currentRound - 1;

  useEffect(() => {
    const provider = getProvider();
    if (!user || !provider) return;

    (async () => {
      try {
        if (fundType === 0) {
        } else {
          const token =
            process.env.NEXT_PUBLIC_APP_ENV === "production"
              ? BlockchainConfig.contracts.USDT[56]
              : BlockchainConfig.contracts.USDT[5];

          const balance = await BlockchainRead.getERC20Balance(
            user._id,
            token,
            provider
          );

          setTokenBalance(Number(balance));
        }
      } catch (err) {
        customLog(["development", "staging"], err);
      }
    })();
  }, [fundType, getProvider, user]);

  useEffect(() => {
    if (currentRound < 0) return;

    const provider = getProvider();
    if (!provider) return;

    (async () => {
      const data: PresaleRoundDetails[] =
        await BlockchainRead.launchpadPresaleRoundDetails(provider, token);

      setroundPrice(Number(data[currentRound].pricePerToken));
    })();
  }, [getProvider, token, currentRound]);

  useEffect(() => {
    const provider = getProvider();
    if (!user || !provider) return;
    (async () => {
      const presaleContract = SmartContractProvider.getContract(
        SmartContractName.LAUNCHPAD,
        provider
      );
      const usdtContract = SmartContractProvider.getContract(
        SmartContractName.USDT,
        provider
      );
      const allowance = await BlockchainRead.getERC20Allowance(
        provider,
        usdtContract.address,
        user._id,
        presaleContract.address
      );

      if (payAmount < Number(allowance)) {
        setAllowance(true);
      }
    })();
  }, [getProvider, token, user, payAmount]);

  const doPurchase = async () => {
    const signer = getSigner();
    if (!signer) return;

    try {
      if (fundType === 0) {
        await BlockchainWrite.buyPresaleToken(true, token, payAmount, signer);
      } else {
        if (!allowance) {
          await BlockchainWrite.getTokenApprovalForLaunchpad("USDT", signer);
        }

        await BlockchainWrite.buyPresaleToken(false, token, payAmount, signer);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleReceiveAmount = (e: any) => {
    e.preventDefault();

    setPayAmount(Number(e.target.value));

    const receivableAmount = (Number(e.target.value) * 1e18) / roundPrice;
    setReceivedAmount(receivableAmount);
  };

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
                onChange={(e) => handleReceiveAmount(e)}
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
          Balance {formatEther(BigInt(tokenBalance))}
        </p>
        <div className="mb-5 mt-2 border-b-2 border-gray-shade-3"></div>
        <p className="font-small ml-1 text-sm text-gray-shade-14">Receive</p>

        <div className="flex w-full flex-row gap-2">
          <div className="col-span-2 w-full text-sm font-medium text-white md:col-span-2">
            <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
              <CustomNumberInput
                value={receivedAmount === 0 ? "" : receivedAmount}
                // onChange={(e) => setReceivedAmount(Number(e.target.value))}
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
          {token_symbol}
        </p>

        <Button
          title={"Buy"}
          // disabled={isSwapping}
          onClick={() => doPurchase()}
          variant="primary"
          className="mt-4 w-full flex-shrink-0 rounded-[10px] text-sm fsm:text-base"
        />
      </div>
    </div>
  );
};
