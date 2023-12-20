import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/button";
import { SwapToken } from "@/models/swap";
import DropdownSwapForm, {
  DropdownOption,
} from "@/pages/staking/_components/dropdown-swap-form";
import { BlockchainRead, BlockchainWrite } from "@/web3/blockchain";
import { useWallet } from "@/web3/hooks/use.wallet";
import {
  CurrencyAmount,
  TradeType,
  ERC20Token,
  Percent,
} from "@pancakeswap/sdk";
import {
  SmartRouter,
  SMART_ROUTER_ADDRESSES,
  SwapRouter,
  SmartRouterTrade,
} from "@pancakeswap/smart-router";
import { hexToBigInt } from "viem";
import { ethers } from "ethers";
import {
  dexSwappingConfig,
  v3SubgraphProvider,
  viemProviders,
} from "./dex-swapping-config";
import toast from "react-hot-toast";

export const DexSwapping = () => {
  const [tokens, setTokens] = useState<SwapToken[]>([]);
  const [baseToken, setBaseToken] = useState<SwapToken | undefined>(undefined);
  const [quoteToken, setQuoteToken] = useState<SwapToken | undefined>(
    undefined
  );
  const [dropDownTokens, setDropdownTokens] = useState<{
    base: DropdownOption[];
    quote: DropdownOption[];
  }>({ base: [], quote: [] });

  const [swapFrom, setSwapFrom] = useState<ERC20Token | undefined>(undefined);
  const [swapTo, setSwapTo] = useState<ERC20Token | undefined>(undefined);
  const [trade, setTrade] = useState<SmartRouterTrade<TradeType> | null>(null);

  const [fromAmount, setFromAmount] = useState<string>("0");
  const [toAmount, setToAmount] = useState<string>("0");
  const [balances, setBalances] = useState<{ base: string; quote: string }>({
    base: "0",
    quote: "0",
  });

  const [btnText, setBtnText] = useState<string>("Swap");
  const [btnDisable, setBtnDisabled] = useState<boolean>(false);
  const { connectedAddress, getSigner } = useWallet();
  const signer = getSigner();
  const chain_id = dexSwappingConfig.chainId;

  const quoteProvider = SmartRouter.createQuoteProvider({
    onChainProvider: viemProviders,
  });

  useEffect(() => {
    let tokens = dexSwappingConfig.bscTokens;
    let base = dexSwappingConfig.bscTokens[0];
    let quote = dexSwappingConfig.bscTokens[1];
    if (process.env.NEXT_PUBLIC_APP_ENV !== "production") {
      tokens = dexSwappingConfig.goerliTokens;
      base = dexSwappingConfig.goerliTokens[0];
      quote = dexSwappingConfig.goerliTokens[1];
    }

    setBaseToken(base);
    setQuoteToken(quote);
    const erc20TokenBase = new ERC20Token(
      base.ChainId,
      base.address as `0x${string}`,
      base.decimal,
      base.symbol,
      base.name,
      base.projectLink
    );
    setSwapFrom(erc20TokenBase);
    const erc20TokenQuote = new ERC20Token(
      quote.ChainId,
      quote.address as `0x${string}`,
      quote.decimal,
      quote.symbol,
      quote.name,
      quote.projectLink
    );
    setSwapTo(erc20TokenQuote);
    setTokens(tokens);
  }, []);

  useEffect(() => {
    if (tokens) {
      const dropDownBases = tokens.map((token) => ({
        title: token.symbol,
        value: token,
      }));

      const baseAddress =
        dropDownBases.length > 0 ? dropDownBases[0].value.address : null;

      const dropDownQuote = tokens
        .filter((token) => token.address !== baseAddress)
        .map((token) => ({ title: token.symbol, value: token }));

      setDropdownTokens({ quote: dropDownQuote, base: dropDownBases });
      updateBalances();
    }
  }, [tokens]);

  useEffect(() => {
    updateBalances();
    getBestRoute(Number(fromAmount));
  }, [swapFrom, swapTo]);

  const handleSwapFrom = (value: SwapToken) => {
    setBaseToken(value);
    const erc20Token = new ERC20Token(
      value.ChainId,
      value.address as `0x${string}`,
      value.decimal,
      value.symbol,
      value.name,
      value.projectLink
    );
    setSwapFrom(erc20Token);
    if (baseToken) {
      const filteredTokens = tokens.filter(
        (token) => token.address !== value.address
      );
      const dropDownQuote = filteredTokens.map((token) => ({
        title: token.symbol,
        value: token,
      }));

      const quote = dropDownQuote[0].value;
      setDropdownTokens({ ...dropDownTokens, quote: dropDownQuote });
      const erc20TokenQuote = new ERC20Token(
        quote.ChainId,
        quote.address as `0x${string}`,
        quote.decimal,
        quote.symbol,
        quote.name,
        quote.projectLink
      );
      setSwapTo(erc20TokenQuote);
      setQuoteToken(quote);
    }
  };

  const swapCallParams = useMemo(() => {
    if (!trade) {
      return null;
    }
    if (connectedAddress) {
      const { value, calldata } = SwapRouter.swapCallParameters(trade, {
        recipient: connectedAddress as `0x${string}`,
        slippageTolerance: new Percent(1),
      });

      return {
        address: SMART_ROUTER_ADDRESSES[chain_id],
        calldata,
        value,
      };
    }
  }, [trade, connectedAddress]);

  const getBestRoute = async (fromAmount: number) => {
    try {
      setBtnText("Swap");
      setBtnDisabled(false);

      if (swapFrom && swapTo && fromAmount > 0) {
        const amount = ethers.utils.parseEther(fromAmount.toString());
        const amountInCurrency = CurrencyAmount.fromRawAmount(
          swapFrom,
          amount.toBigInt()
        );
        const pairs = SmartRouter.getPairCombinations(swapFrom, swapTo);

        const [v2PoolsPromise, v3PoolsPromise, stablePoolsPromise] =
          await Promise.allSettled([
            SmartRouter.getV3PoolSubgraph({
              provider: v3SubgraphProvider,
              pairs,
            }).then((res) =>
              SmartRouter.v3PoolSubgraphSelection(swapFrom, swapTo, res)
            ),
            SmartRouter.getV2PoolsOnChain(pairs, viemProviders),
            SmartRouter.getStablePoolsOnChain(pairs, viemProviders),
          ]);

        let pools: any[] = [];

        if (v2PoolsPromise.status == "fulfilled") {
          pools = v2PoolsPromise.value;
        }
        if (v3PoolsPromise.status == "fulfilled") {
          pools = pools.concat(v3PoolsPromise.value);
        }
        if (stablePoolsPromise.status == "fulfilled") {
          pools = pools.concat(stablePoolsPromise.value);
        }
        try {
          const trade = await SmartRouter.getBestTrade(
            amountInCurrency,
            swapTo,
            TradeType.EXACT_INPUT,
            {
              gasPriceWei: () =>
                viemProviders({
                  chainId: dexSwappingConfig.chainId,
                }).getGasPrice(),
              maxHops: 2,
              maxSplits: 2,
              poolProvider: SmartRouter.createStaticPoolProvider(pools),
              quoteProvider,
              quoterOptimization: true,
            }
          );
          if (trade) {
            const quote = trade.outputAmount;
            const a = CurrencyAmount.fromFractionalAmount(
              quote.currency,
              quote.numerator,
              quote.denominator
            );
            setToAmount(a.toFixed(6));
            setTrade(trade);
          }
        } catch (error) {
          console.log(error);
          setBtnText("Insufficient liquidity for this trade.");
          setToAmount("0");
          setBtnDisabled(true);
        }
      }
      if (fromAmount == 0) {
        setToAmount("0");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFromAmount = (amount: string) => {
    amount = amount.replace(/^0+/, "");
    setFromAmount(amount);
    getBestRoute(Number(amount));
  };

  const handleSwapTo = (value: SwapToken) => {
    setQuoteToken(value);
    const erc20Token = new ERC20Token(
      value.ChainId,
      value.address as `0x${string}`,
      value.decimal,
      value.symbol,
      value.name,
      value.projectLink
    );
    setSwapTo(erc20Token);
  };

  const updateBalances = async () => {
    if (connectedAddress && signer && swapFrom) {
      let base_balance = "0";
      let quote_balance = "0";

      if (swapFrom) {
        if (swapFrom.isNative) {
          base_balance = await BlockchainRead.getWalletBalance(signer);
        } else {
          base_balance = await BlockchainRead.getERC20Balance(
            connectedAddress,
            swapFrom.address,
            signer
          );
        }
      }
      if (swapTo) {
        if (swapTo.isNative) {
          quote_balance = await BlockchainRead.getWalletBalance(signer);
        } else {
          quote_balance = await BlockchainRead.getERC20Balance(
            connectedAddress,
            swapTo.address,
            signer
          );
        }
      }

      setBalances({ base: base_balance, quote: quote_balance });
    }
  };

  const doSwap = async () => {
    try {
      setBtnText("Swapping ...");
      setBtnDisabled(true);
      if (signer && baseToken) {
        if (!swapCallParams || !connectedAddress) {
          return;
        }

        const { value, calldata, address: routerAddress } = swapCallParams;

        const allowenceAmount = await BlockchainRead.getERC20Allowance(
          signer,
          baseToken.address,
          connectedAddress,
          SMART_ROUTER_ADDRESSES[chain_id]
        );

        const fromAmountInWei = ethers.utils.parseUnits(
          `${fromAmount}`,
          "ether"
        );

        if (allowenceAmount.lt(fromAmountInWei)) {
          setBtnText("Approving ...");

          await BlockchainWrite.SetApprovalForWallet(
            signer,
            baseToken?.address,
            connectedAddress,
            routerAddress
          );
        }
        setBtnText("Swapping ...");
        const tx = {
          from: connectedAddress,
          to: SMART_ROUTER_ADDRESSES[chain_id],
          data: calldata,
          value: hexToBigInt(value),
          gasLimit: 238600,
        };
        const transaction = await signer.sendTransaction(tx);
        await transaction.wait(2);
        updateBalances();
        toast.success("Swapping successfully done");
        setFromAmount("0");
        setToAmount("0");
      }
    } catch (error) {
      console.log(error);
    }
    setBtnText("Swap");
    setBtnDisabled(false);
  };

  return (
    <div className="w-full rounded-xl border border-gray-shade-3 bg-black-shade-9 p-6">
      <div className="text-[min(10vw, 20px)] font-semibold text-white">
        Swap your token
      </div>
      <div className="mt-5 flex flex-col justify-center gap-5 flg:flex-row">
        <div className="flex w-full flex-shrink-0 flex-col rounded-xl bg-elevation-1 px-5 py-6 fmd:col-span-1 flg:max-w-[512px]">
          <p className="font-small ml-1 text-sm text-gray-shade-14">Pay</p>

          <div className="flex w-full flex-row gap-2">
            <div className="col-span-2 w-full text-sm font-medium text-white md:col-span-2">
              <div className="focus-within:gradient-border-3 mt-2 !rounded-lg p-[1px]">
                <input
                  type="number"
                  value={fromAmount}
                  placeholder="Enter amout"
                  onChange={(v) => handleFromAmount(v.target.value)}
                  className="block w-full rounded-lg border-0 bg-transparent px-5 py-3 text-2xl placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            <div className="mx-1 mt-2 block w-2/6 appearance-none rounded-lg border-0 text-sm">
              {dropDownTokens?.base ? (
                <DropdownSwapForm
                  placeholder="Token"
                  options={dropDownTokens?.base ?? []}
                  selectedValue={baseToken ? baseToken : tokens[0]}
                  onSelect={(value) => {
                    handleSwapFrom(value);
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
                  value={toAmount}
                  placeholder="Enter amout"
                  className="block w-full rounded-lg border-0 bg-transparent px-5 py-3 text-2xl placeholder:text-gray-shade-17 focus:outline-none focus:ring-0"
                  onChange={(v) => console.log(v.target.value)}
                />
              </div>
            </div>
            <div className="mx-1 mt-2 block w-2/6 appearance-none rounded-lg border-0 text-sm">
              {dropDownTokens?.quote ? (
                <DropdownSwapForm
                  placeholder="Token"
                  options={dropDownTokens?.quote ?? []}
                  selectedValue={quoteToken ? quoteToken : tokens[1]}
                  onSelect={function (value: SwapToken): void {
                    handleSwapTo(value);
                  }}
                />
              ) : null}
            </div>
          </div>
          <p className="font-small my-4 ml-1 text-sm text-gray-shade-14">
            Balance {balances ? balances.quote : ""}
          </p>

          <Button
            title={btnText}
            onClick={() => doSwap()}
            disabled={btnDisable}
            variant="primary"
            className="mt-4 w-full flex-shrink-0 rounded-[10px] text-sm fsm:text-base"
          />
        </div>
      </div>
    </div>
  );
};
