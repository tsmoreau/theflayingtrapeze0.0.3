import { verifyMessage } from "@ethersproject/wallet";
import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import useEagerConnect from "../hooks/useEagerConnect";
import usePersonalSign, { hexlify } from "../hooks/usePersonalSign";

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

  return (
    <div>
      <header>
        <div>
          <Account triedToEagerConnect={triedToEagerConnect} />
        </div>
      </header>
    </div>
  );
}
