import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useRef, useState } from "react";
import { injected } from "../connectors";
import useENSName from "../hooks/useENSName";
import { formatEtherscanLink, shortenHex } from "../util";

const Account = ({ triedToEagerConnect }) => {
  const {
    active,
    error,
    activate,
    chainId,
    account,
    setError
  } = useWeb3React();

  // initialize metamask onboarding
  const onboarding = useRef();

  useEffect(() => {
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

  const [ischain, setIsChain] = useState(false);
  useEffect(() => {
    if (chainId === 558) {
      setIsChain(true);
    } else {
      setIsChain(false);
    }
  });

  const ENSName = useENSName(account);

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
            className="bg-gradient-to-br bg-gradient-to-br from-amber-300 via-rose-500  to-violet-700 hover:amber-200 hover:via-violet-600 hover:to-sky-900 inline-flex items-center px-9 py-2 mt-4 lg:-mr-6 font-normal text-white   active:bg-blue-600 rounded-full text-sm md:mt-0"
            onClick={() => {
              setConnecting(true);

              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
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
          <button
            className="bg-gradient-to-br bg-gradient-to-br from-amber-300 via-rose-500  to-violet-700 hover:amber-200 hover:via-violet-600 hover:to-sky-900 inline-flex items-center px-9 py-2 mt-4 lg:-mr-6 font-normal text-white   active:bg-blue-600 rounded-full text-sm md:mt-0"
            onClick={() => onboarding.current?.startOnboarding()}
          >
            Install Metamask
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <a
        className="bg-gradient-to-br bg-gradient-to-br from-amber-300 via-rose-400  to-violet-700  hover:amber-200 hover:via-violet-600 hover:to-sky-900 inline-flex items-center px-9 py-2 mt-4 lg:-mr-6 font-normal text-white   active:bg-blue-600 rounded-full text-sm md:mt-0"
        {...{
          href: formatEtherscanLink("Account", [chainId, account]),
          target: "_blank",
          rel: "noopener noreferrer"
        }}
      >
        {ENSName || `${shortenHex(account, 4)}`}
      </a>
      <div className="relative w-full">
        {ischain === true ? (
          <span className=""></span>
        ) : (
          <div>
            <span className="fixed inset-0 bg-opacity-90 bg-white flex items-center justify-center">
              <p className="flex mx-auto w-80 "></p>
            </span>

            <div class="border w-full h-full fixed top-0 left-0 opacity-90 bg-white z-9999">
              <div class=" transform translate-y-72">
                <div class="flex flex-col items-center justify-center ">
                  <div className="mb-8 w-11/12 lg:w-1/3 text-gray-400 text-4xl flex mx-auto text-center tracking-tight">
                    You Are Connected to a Non-Tao Network. Please Change Your
                    Network or Disconnect Your Wallet.
                  </div>
                  <button
                    className="animate-pulse w-80 py-2 bg-gray-400 text-white border rounded-lg"
                    onClick={() => addNetwork()}
                  >
                    Switch to Tao Network
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
