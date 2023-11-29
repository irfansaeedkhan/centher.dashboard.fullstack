import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQRCode } from "next-qrcode";
import Button from "@/components/button";
import { GetSwapRates, SwapRates, SwapToken } from "@/models/swap";
import DropdownSwapForm, {
  DropdownOption,
} from "@/pages/staking/_components/dropdown-swap-form";
import { axiosCIS } from "@/utils/axios";
import { copyText } from "@/utils/copy.text";
import { WalletServiceBaseURL } from "@/constants/base-urls";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { useWallet } from "@/web3/hooks/use.wallet";
import { GradientCopy } from "@/assets/svgs";

export const SwapTokens = () => {
  const wallet_url = WalletServiceBaseURL;
  const { SVG } = useQRCode();
  const { connectedAddress, getSigner } = useWallet();
  const [swapRates, setSwapRates] = useState<SwapRates[] | null>(null);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapRate, setSwapRate] = useState<SwapRates | undefined>(undefined);
  const [tokens, setTokens] = useState<{
    base: SwapToken[];
    quote: SwapToken[];
  } | null>(null);
  const [wallet, setWallet] = useState<string>("");
  const [balances, setBalances] = useState<{ base: string; quote: string }>({
    base: "0",
    quote: "0",
  });
  const [formAmounts, setFormAmounts] = useState<{
    base: number;
    quote: number;
  }>({ base: 0, quote: 0 });

  const [dropDownTokens, setDropdownTokens] = useState<{
    base: DropdownOption[];
    quote: DropdownOption[];
  } | null>(null);

  const [baseToken, setBaseToken] = useState<SwapToken | undefined>(undefined);
  const [quoteToken, setQuoteToken] = useState<SwapToken | undefined>(
    undefined
  );

  const signer = getSigner();

  useEffect(() => {
    const getSwapDetails = async () => {
      const { data } = await axiosCIS.get<GetSwapRates>(
        `${wallet_url}/v1/swap/sale/rates`
      );
      setSwapRates(data.swaps);
      setWallet(data.wallet);
    };
    getSwapDetails();
  }, [wallet_url]);

  useEffect(() => {
    if (swapRates) {
      const bases = [];
      const quotes = [];

      // Extract base and quote tokens into separate arrays
      for (const rate of swapRates) {
        bases.push(rate.base);
        quotes.push(rate.quote);
      }
      setTokens({ base: bases, quote: quotes });
      setBaseToken(bases[0]);
      setQuoteToken(quotes[0]);
      let drop_down_bases = bases.map((i) => {
        return { title: i.symbol, value: i };
      });
      drop_down_bases = drop_down_bases.filter(onlyUnique);

      let drop_down_qoutes = quotes.map((i) => {
        return { title: i.symbol, value: i };
      });
      drop_down_qoutes = drop_down_qoutes.filter(onlyUnique);
      setDropdownTokens({ base: drop_down_bases, quote: drop_down_qoutes });
    }
  }, [swapRates]);

  useEffect(() => {
    if (baseToken && quoteToken && swapRates) {
      const calcaulateRate = async () => {
        const rate = swapRates.find(
          (r) =>
            r.base.address == baseToken.address &&
            r.quote.address == quoteToken.address
        );

        setSwapRate(rate);

        if (connectedAddress && signer) {
          let base_balance = "0";
          let quote_balance = "0";

          if (baseToken.is_native) {
            base_balance = await BlockchainRead.getWalletBalance(signer);
          } else {
            base_balance = await BlockchainRead.getERC20Balance(
              connectedAddress,
              baseToken.address,
              signer
            );
          }

          if (quoteToken.is_native) {
            quote_balance = await BlockchainRead.getWalletBalance(signer);
          } else {
            quote_balance = await BlockchainRead.getERC20Balance(
              connectedAddress,
              quoteToken.address,
              signer
            );
          }

          setBalances({ base: base_balance, quote: quote_balance });
        }
      };
      calcaulateRate();
    }
  }, [isSwapping, baseToken, connectedAddress, quoteToken, signer, swapRates]);

  const onlyUnique = (
    value: DropdownOption,
    value_index: number,
    array: DropdownOption[]
  ) => {
    return !array
      .slice(0, value_index)
      .some((element) => element.title === value.title);
  };

  const handleBase = (amount: string) => {
    if (swapRate) {
      const quote = Number(amount) / swapRate.rate;
      setFormAmounts({ quote, base: Number(amount) });
    }
  };

  const handleQuote = (amount: string) => {
    if (swapRate) {
      const base = Number(amount) * swapRate.rate;
      setFormAmounts({ base, quote: parseInt(amount, 100) });
    }
  };

  const doSwap = async () => {
    if (baseToken && connectedAddress && signer) {
      if (Number(balances.base) < formAmounts.base) {
        toast.error("You don't have enough balance");
        return;
      }
      setIsSwapping(true);
      if (baseToken.is_native) {
        await BlockchainWrite.transferNative(
          wallet,
          formAmounts.base.toString(),
          signer
        );
      } else {
        await BlockchainWrite.transferERC20(
          wallet,
          baseToken.address,
          formAmounts.base.toString(),
          signer
        );
      }

      setFormAmounts({ base: 0, quote: 0 });
      setIsSwapping(false);
    }
  };

  return (
    <div className="w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
      <div className="text-[min(10vw, 20px)] font-semibold text-white">
        Swap your token
      </div>
      <div className="mt-5 flex flex-col justify-between gap-5 flg:flex-row">
        <div className="flex w-full flex-shrink-0 flex-col rounded-xl bg-elevation-1 px-5 py-6 fmd:col-span-1 flg:max-w-[512px]">
          <p className="font-small ml-1 text-sm text-gray-shade-14">Pay</p>

          <div className="flex w-full flex-row gap-2">
            <div className="col-span-2 w-full text-sm font-medium text-white md:col-span-2">
              <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                <input
                  type="number"
                  value={formAmounts.base}
                  placeholder="Enter amout"
                  onChange={(v) => handleBase(v.target.value)}
                  className="block w-full rounded-lg border-0 bg-transparent px-5 py-3 text-2xl placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            <div className="mx-1 mt-2 block w-2/6 appearance-none rounded-lg border-0 text-sm">
              {tokens?.base ? (
                <DropdownSwapForm
                  placeholder="Token"
                  options={dropDownTokens?.base ?? []}
                  selectedValue={baseToken ? baseToken : tokens.base[0]}
                  onSelect={(value) => {
                    setBaseToken(value);
                  }}
                />
              ) : null}
            </div>
          </div>
          <p className="my-4 ml-1 text-sm font-medium text-gray-shade-14">
            Balance {balances ? balances.base : ""}
          </p>
          <div className="my-1 border-b-2 border-gray-shade-3"></div>
          <p className="font-small ml-1 text-sm text-gray-shade-14">Receive</p>

          <div className="flex w-full flex-row gap-2">
            <div className="col-span-2 w-full text-sm font-medium text-white md:col-span-2">
              <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                <input
                  type="number"
                  value={formAmounts.quote}
                  onChange={(v) => handleQuote(v.target.value)}
                  placeholder="Enter amout"
                  className="block w-full rounded-lg border-0 bg-transparent px-5 py-3 text-2xl placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            <div className="mx-1 mt-2 block w-2/6 appearance-none rounded-lg border-0 text-sm">
              {tokens?.quote ? (
                <DropdownSwapForm
                  placeholder="Token"
                  options={dropDownTokens?.quote ?? []}
                  selectedValue={quoteToken ? quoteToken : tokens.quote[0]}
                  onSelect={(value) => {
                    setQuoteToken(value);
                  }}
                />
              ) : null}
            </div>
          </div>
          <p className="font-small my-4 ml-1 text-sm text-gray-shade-14">
            Balance {balances ? balances.quote : ""}
          </p>

          <Button
            title={isSwapping ? "Swapping . . " : "Swap now"}
            disabled={isSwapping}
            onClick={() => doSwap()}
            variant="primary"
            className="mt-4 w-full flex-shrink-0 rounded-[10px] text-sm fsm:text-base"
          />
        </div>

        <div className="flex w-full justify-center rounded-xl bg-elevation-1 px-5 py-6 fmd:col-span-1">
          <div className="flex w-1/2">
            {wallet ? (
              <div className="flex w-full flex-col items-center justify-center ">
                <div className="hidden sm:flex">
                  <SVG
                    text={wallet}
                    options={{
                      margin: 2,
                      width: 235,
                      color: {
                        dark: "#000",
                        light: "#fff",
                      },
                    }}
                  />
                </div>{" "}
                <div className="flex sm:hidden">
                  <SVG
                    text={wallet}
                    options={{
                      margin: 2,
                      width: 200,
                      color: {
                        dark: "#000",
                        light: "#fff",
                      },
                    }}
                  />
                </div>
                <div className="flex  flex-row items-center justify-center ">
                  <p className="font-small mt-4 h-11 w-56 break-words  text-sm text-white">
                    {wallet}
                  </p>
                  <GradientCopy
                    className="cursor-pointer"
                    onClick={async () => {
                      await copyText(wallet);
                      toast.success("Wallet address copied");
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
