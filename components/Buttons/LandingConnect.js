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
            {MetaMaskOnboarding.isMetaMaskInstalled() ? "Connect" : "Connect"}
          </button>
        ) : (
          <button onClick={() => onboarding.current?.startOnboarding()}>
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
    <a
      {...{
        href: formatEtherscanLink("Account", [chainId, account]),
        target: "_blank",
        rel: "noopener noreferrer"
      }}
    >
      {ENSName || `${shortenHex(account, 4)}`}
    </a>
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
        <button className="bg-gradient-to-r from-purple-600 via-blue-500 to-green-300 hover:amber-200 hover:via-violet-600 hover:to-sky-900 inline-flex items-center px-12 py-3 mt-4 font-normal text-white   active:bg-blue-600 rounded-md text-md md:mt-0">
          <Account triedToEagerConnect={triedToEagerConnect} />
        </button>
      </header>
    </div>
  );
}
