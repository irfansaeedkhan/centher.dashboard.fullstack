import { WalletServiceBaseURL } from "@/constants/base-urls";
import {
  JsonRpcProvider,
  JsonRpcSigner,
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/providers";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { logger } from "../blockchain/helpers/alert.helper";

type WalletMessage = {
  target: "wallet-service";
  event:
    | "success_login"
    | "sign"
    | "success_sign"
    | "success_send"
    | "logout"
    | "page_loaded"
    | "page_closed";
  data:
    | SuccessLoginMessage
    | SuccessSignMessage
    | TransactionReceipt
    | TransactionResponse;
};

type SuccessLoginMessage = {
  callback: string;
  publick_key: string;
  rpc?: string;
};

type SuccessSignMessage = {
  callback: string;
  signed_message: string;
};
const wallet_url = WalletServiceBaseURL;

export const useWalletService = () => {
  const PUBLICK_KEY_KEY = "publick_key";
  const CALBACK_KEY = "callback";
  const RPC_KEY = "rpc";
  const api_key = process.env.NEXT_PUBLIC_WALLET_SERVICE_API_KEY;

  let globalPromise: Promise<any>;
  let globalPromiseResolve: (value: any) => void;
  let globalPromiseReject: (value: any) => void;

  const [address, setAddress] = useState<null | string>(null);
  const [provider, setProvider] =
    useState<null | ethers.providers.JsonRpcProvider>(null);
  const [signer, setSigner] = useState<null | JsonRpcSigner>(null);

  useEffect(() => {
    initAddress();
  }, []);

  function initAddress() {
    const address = localStorage.getItem(PUBLICK_KEY_KEY);
    if (address) {
      setAddress(address);
    }
  }

  useEffect(() => {
    initSigner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  function initSigner() {
    if (address) {
      const rpc = localStorage.getItem(RPC_KEY);
      if (rpc) {
        const provider = new ethers.providers.JsonRpcProvider(rpc);
        setProvider(provider);
        const signer = provider.getSigner(address);
        signer.sendTransaction = sendTransaction;

        setSigner(signer);
      }
    }
  }

  function getProvider(): JsonRpcProvider {
    const rpc = localStorage.getItem(RPC_KEY);
    const provider = new ethers.providers.JsonRpcProvider(rpc!);
    return provider;
  }

  function disconnect() {
    try {
      setAddress(null);
      setProvider(null);
      localStorage.removeItem(PUBLICK_KEY_KEY);
      localStorage.removeItem(RPC_KEY);
      localStorage.removeItem(CALBACK_KEY);
    } catch (error) {
      logger(error, "disconnect wallet");
    }
  }
  async function connect(): Promise<any> {
    globalPromise = new Promise((resolve, reject) => {
      openWallet(`${wallet_url}/app?apikey=${api_key}`);
      globalPromiseResolve = resolve;
      globalPromiseReject = reject;
    });
    return globalPromise;
  }

  function openWallet(url: string, data?: any): Window | null {
    const width = 550;
    const height = 750;
    var leftPosition, topPosition;
    //Allow for borders.
    leftPosition = window.screen.width / 2 - (width / 2 + 10);
    //Allow for title and status bars.
    topPosition = window.screen.height / 2 - (height / 2 + 50);
    //Open the window.
    const wallet_window = window.open(
      url,
      "Window2",
      "status=no,height=" +
        height +
        ",width=" +
        width +
        ",resizable=yes,left=" +
        leftPosition +
        ",top=" +
        topPosition +
        ",screenX=" +
        leftPosition +
        ",screenY=" +
        topPosition +
        ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no"
    );

    window.addEventListener("message", (event) => {
      const check_origin = checkOrigin(event);
      if (check_origin) {
        const wallet_data = event.data as WalletMessage;
        if (wallet_data.event == "page_loaded") {
          if (data) {
            try {
              setTimeout(() => {
                wallet_window?.postMessage(data, "*");
              }, 1 * 1000);
            } catch (error) {
              logger(error, "postMessage");
            }
          }
        } else if (wallet_data.event == "page_closed") {
          globalPromiseReject("closed");
        } else {
          parseWalletMessage(wallet_data);
        }
      }
    });
    return wallet_window;
  }

  async function parseWalletMessage(data: WalletMessage) {
    try {
      switch (data.event) {
        case "success_login":
          const loginMessage = data.data as SuccessLoginMessage;
          setAddress(null);
          localStorage.setItem(PUBLICK_KEY_KEY, loginMessage.publick_key);
          localStorage.setItem(CALBACK_KEY, loginMessage.callback);
          if (loginMessage.rpc) {
            localStorage.setItem(RPC_KEY, loginMessage.rpc);
          }
          setAddress(loginMessage.publick_key);
          setTimeout(() => {
            globalPromiseResolve(loginMessage.publick_key);
          }, 1 * 1000);

          break;
        case "success_sign":
          const signedMessage = data.data as SuccessSignMessage;
          globalPromiseResolve(signedMessage.signed_message);
          break;

        case "success_send":
          const da = data.data as any;
          const receipt = da.data as TransactionResponse;
          if (provider != null && provider != undefined) {
            const e = await provider?.getTransaction(receipt.hash);
            receipt.wait = e!.wait;
            globalPromiseResolve(receipt);
          } else {
            const new_provider = getProvider();
            const e = await new_provider?.getTransaction(receipt.hash);
            receipt.wait = e!.wait;
            globalPromiseResolve(receipt);
          }

          break;
        case "logout":
          disconnect();
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  function checkOrigin(event: MessageEvent) {
    let valid_domain = new URL(wallet_url);
    const valid_domain_string = valid_domain.hostname.replace("www.", "");
    let domain = new URL(event.origin);
    const final_domain = domain.hostname.replace("www.", "");

    if (
      valid_domain_string == final_domain &&
      event.data.target == "wallet-service"
    ) {
      return true;
    }
    return false;
  }

  async function sign(data: string): Promise<string> {
    globalPromise = new Promise((resolve, reject) => {
      const message = { target: "wallet-service", message: data };
      openWallet(`${wallet_url}/app/sign`, message);
      globalPromiseResolve = resolve;
      globalPromiseReject = reject;
    });
    return globalPromise;
  }

  async function sendTransaction(
    data: ethers.utils.Deferrable<ethers.providers.TransactionRequest>,
    description?: string
  ): Promise<ethers.providers.TransactionResponse> {
    globalPromise = new Promise((resolve, reject) => {
      const message = { target: "wallet-service", message: data, description };
      openWallet(`${wallet_url}/app/send`, message);
      globalPromiseResolve = resolve;
      globalPromiseReject = reject;
    });
    return globalPromise;
  }

  async function send(
    data: ethers.PopulatedTransaction,
    description?: string
  ): Promise<TransactionReceipt> {
    globalPromise = new Promise((resolve, reject) => {
      const message = { target: "wallet-service", message: data, description };
      openWallet(`${wallet_url}/app/send`, message);
      globalPromiseResolve = resolve;
      globalPromiseReject = reject;
    });
    return globalPromise;
  }

  async function showWallet(): Promise<TransactionReceipt> {
    globalPromise = new Promise((resolve, reject) => {
      const message = { target: "wallet-service" };
      openWallet(`${wallet_url}/app/account`, message);
      globalPromiseResolve = resolve;
      globalPromiseReject = reject;
    });
    return globalPromise;
  }

  return {
    address,
    connect,
    showWallet,
    disconnect,
    sign,
    send,
    provider,
    signer,
  };
};
