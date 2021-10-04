import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { injected } from "../connectors";
import useENSName from "../hooks/useENSName";
import { formatEtherscanLink, shortenHex } from "../util";

const BuyButton = ({ triedToEagerConnect }) => {
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
                } else {
                  setError(error);
                }
              });

              addNetwork();
            }}
          >
            {MetaMaskOnboarding.isMetaMaskInstalled() ? (
              <div className=" bg-gray-400 w-64 text-white tracking-tight font-light py-2  rounded hover:bg-gray-600">
                {" "}
                Wallet Not COnnected
              </div>
            ) : (
              <div className=" bg-gray-400 w-64 text-white tracking-tight font-light py-2  rounded hover:bg-gray-600">
                Wallet Not Connected
              </div>
            )}
          </button>
        ) : (
          <button onClick={() => onboarding.current?.startOnboarding()}>
            Install Metamask
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => buyNft(nft)}
        className=" bg-gray-400 w-64 text-white tracking-tight font-light py-2  rounded hover:bg-gray-600"
      >
        Purchase Item
      </button>
    </div>
  );
};

export default BuyButton;
