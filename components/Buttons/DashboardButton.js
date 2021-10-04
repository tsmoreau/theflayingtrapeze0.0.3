import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { injected } from "../../connectors";
import useENSName from "../../hooks/useENSName";
import { formatEtherscanLink, shortenHex } from "../../util";
import { verifyMessage } from "@ethersproject/wallet";
import Head from "next/head";
import Link from "next/link";
import ETHBalance from "../../components/ETHBalance";
import useEagerConnect from "../../hooks/useEagerConnect";
import usePersonalSign, { hexlify } from "../../hooks/usePersonalSign";
import { useRouter } from "next/router";
import { ethers } from "ethers";

const Account = ({ triedToEagerConnect }) => {
  const {
    active,
    error,
    activate,
    chainId,
    account,
    setError,
    library
  } = useWeb3React();

  // initialize metamask onboarding
  const onboarding = useRef();

  const router = useRouter();

  useLayoutEffect(() => {
    onboarding.current = new MetaMaskOnboarding();
  }, []);

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      onboarding.current?.stopOnboarding();
    }
  }, [active, error]);

  const ENSName = useENSName(account);
  const isConnected = typeof account === "string" && !!library;

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  const addNetwork = () => {
    const params = [
      {
        chainId: "0x22e",
        chainName: "Tao Network",
        nativeCurrency: {
          name: "Tao",
          symbol: "TAO",
          decimals: 18
        },
        rpcUrls: ["https://rpc.tao.network"],
        blockExplorerUrls: ["https://scan.tao.network"]
      }
    ];
    window.ethereum
      .request({ method: "wallet_addEthereumChain", params })
      .then(() => console.log("Success"))
      .catch((error) => console.log("Error", error.message));
  };

  if (typeof account !== "string") {
    const hasMetaMaskOrWeb3Available =
      MetaMaskOnboarding.isMetaMaskInstalled() ||
      window?.ethereum ||
      window?.web3;

    return (
      <div>
        {hasMetaMaskOrWeb3Available ? (
          <button
            className="hidden"
            onClick={() => {
              setConnecting(true);

              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request

                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                  console.log("Rejected!");
                } else {
                  setError(error);
                }
              });

              addNetwork();
            }}
          >
            {MetaMaskOnboarding.isMetaMaskInstalled() ? "" : ""}
          </button>
        ) : (
          <button
            className="hidden"
            onClick={() => onboarding.current?.startOnboarding()}
          >
            Install Metamask
          </button>
        )}
      </div>
    );
  }

  if (!triedToEagerConnect) {
    console.log("test");
  }

  return (
    <div>
      <a href="/dashboard">
        <div class="space-x-0.5 pl-5 pr-3 text-sm text-gray-300 hover:text-white hover:bg-gray-500  rounded-lg px-2 py-1 tracking-tight flex">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            className="transform -translate-x-2 translate-y-0"
          >
            <path d="M20.021 12.593c-.141-.427-.314-.844-.516-1.242l-2.454 1.106c.217.394.39.81.517 1.242l2.453-1.106zm-12.573-.903c.271-.354.58-.675.919-.957l-1.89-1.969c-.328.294-.637.615-.918.957l1.889 1.969zm1.715-1.515c.379-.221.781-.396 1.198-.523l-1.034-2.569c-.41.142-.812.318-1.198.524l1.034 2.568zm-2.759 3.616c.121-.435.288-.854.498-1.25l-2.469-1.066c-.197.403-.364.822-.498 1.25l2.469 1.066zm9.434-6.2c-.387-.205-.79-.379-1.2-.519l-1.024 2.573c.417.125.82.299 1.2.519l1.024-2.573zm2.601 2.13c-.282-.342-.59-.663-.918-.957l-1.89 1.969c.339.282.647.604.918.957l1.89-1.969zm-5.791-3.059c-.219-.018-.437-.026-.649-.026s-.431.009-.65.026v2.784c.216-.025.434-.038.65-.038.216 0 .434.012.649.038v-2.784zm-.648 14.338c-1.294 0-2.343-1.049-2.343-2.343 0-.883.489-1.652 1.21-2.051l1.133-5.606 1.133 5.605c.722.399 1.21 1.168 1.21 2.051 0 1.295-1.049 2.344-2.343 2.344zm12-6c0 2.184-.586 4.233-1.61 5.999l-1.736-1.003c.851-1.471 1.346-3.174 1.346-4.996 0-5.523-4.477-10-10-10s-10 4.477-10 10c0 1.822.495 3.525 1.346 4.996l-1.736 1.003c-1.024-1.766-1.61-3.815-1.61-5.999 0-6.617 5.383-12 12-12s12 5.383 12 12z" />
          </svg>
          Dashboard
        </div>
      </a>
    </div>
  );
};

export default function Home() {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const sign = usePersonalSign();

  const handleSign = async () => {
    const msg = "Next Web3 Boilerplate Rules";
    const sig = await sign(msg);
    console.log(sig);
    console.log("isValid", verifyMessage(msg, sig) === account);
  };

  const isConnected = typeof account === "string" && !!library;

  async function login() {}

  return (
    <div>
      <header>
        <button className="">
          <Account triedToEagerConnect={triedToEagerConnect} />
        </button>
      </header>
    </div>
  );
}
