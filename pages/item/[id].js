import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useEffect, useState, useLayoutEffect, Fragment, useRef } from "react";
import axios from "axios";
import Footer from "../../components/Footer";
import { nftaddress, nftmarketaddress, IPFSgateway } from "../../config";
import Market from "../../abis/NFTMarket.json";
import NFT from "../../abis/NFT.json";
import Nav from "../../components/Nav";
import Alert from "../../components/AlertFaux";

import Lightbox from "react-awesome-lightbox";
// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";
import {
  Popover,
  Transition,
  Dialog,
  Disclosure,
  Menu
} from "@headlessui/react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { injected } from "../../connectors";

import useEagerConnect from "../../hooks/useEagerConnect";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [priceD, setPriceD] = useState([]);
  const [lightbox, setLightbox] = useState(false);
  const triedToEagerConnect = useEagerConnect();
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [approveLoading, setApproveLoading] = useState(false);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
    tags: ""
  });

  const {
    active,
    error,
    activate,
    chainId,
    account,
    setError
  } = useWeb3React();

  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
    isApproved();
  }, []);

  const router = useRouter();

  let id;
  id = router.query.id;
  if (!id && typeof window !== "undefined") {
    id = window.location.pathname.split("/").pop();
  }

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */

    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.tao.network"
    );
    const signer = provider.getUncheckedSigner();

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchItem(id);

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const finalURI = IPFSgateway + tokenUri.substring(7);
        const meta = await axios.get(finalURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let price2 = i.price.toString();
        console.log(price2);
        setPriceD(price2);

        let item = {
          price,
          price2,
          tokenId: i.tokenId.toString(),
          minter: i.minter,
          owner: i.owner,
          image: IPFSgateway + meta.data.image.substring(7),
          name: meta.data.name,
          description: meta.data.description,
          tags: meta.data.tags,
          tag1: meta.data.tags[0],
          tag2: meta.data.tags[1],
          onSale: i.onSale
        };

        console.log(priceD.toString());
        return item;
      })
    );

    setNfts(items);
    console.log(priceD);
    setLoadingState("loaded");
  }

  async function isApproved() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const addy = await signer.getAddress();

    const isApproved = await tokenContract.isApprovedForAll(
      addy,
      nftmarketaddress
    );
    setApproved(isApproved);

    console.log("Address");
    console.log(addy);
    console.log(account);

    console.log(approved);
  }

  const cancelMarketItem = async (arg) => {
    console.log("Cancel");
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    contract

      .cancelMarketItem(arg)

      .then((tx) => {
        //action prior to transaction being mined
        setLoading(true);
        provider.waitForTransaction(tx.hash).then(() => {
          //action after transaction is mined
          setLoading(false);
          loadNFTs();
        });
      })
      .catch(() => {
        //action to perform when user clicks "reject"
        setLoading(false);
      });
  };

  const changeItemPrice = async (arg) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const price1 = ethers.utils.parseUnits(formInput.price, "ether");
    const handleChange = (e) => {
      setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);

      updateFormInput({ ...formInput, tags: e.map((x) => x.value) });
    };

    let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    contract

      .createMarketPriceUpdate(arg, price1)

      .then((tx) => {
        //action prior to transaction being mined
        setLoading(true);
        provider.waitForTransaction(tx.hash).then(() => {
          //action after transaction is mined
          setLoading(false);
          loadNFTs();
        });
      })
      .catch(() => {
        //action to perform when user clicks "reject"
        setLoading(false);
      });
  };

  const placeOnSale = async (arg) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const price1 = ethers.utils.parseUnits(formInput.price, "ether");
    const handleChange = (e) => {
      setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);

      updateFormInput({ ...formInput, tags: e.map((x) => x.value) });
    };

    let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    contract

      .createNewMarketResale(arg, price1)

      .then((tx) => {
        //action prior to transaction being mined
        setLoading(true);
        provider.waitForTransaction(tx.hash).then(() => {
          //action after transaction is mined
          setLoading(false);
          loadNFTs();
        });
      })
      .catch(() => {
        //action to perform when user clicks "reject"
        setLoading(false);
      });

    console.log(arg);
    console.log(price1);
  };

  const approveMarket = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);

    tokenContract

      .setApprovalForAll(nftmarketaddress, true)

      .then((tx) => {
        //action prior to transaction being mined
        setLoading(true);
        provider.waitForTransaction(tx.hash).then(() => {
          //action after transaction is mined
          setLoading(false);
          loadNFTs();
        });
      })
      .catch(() => {
        //action to perform when user clicks "reject"
        setLoading(false);
      });
    router.reload();
  };

  const sendItem = async (arg) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const address = formInput.address;
    const itemNum = arg;

    console.log("Send Test");
    console.log(formInput.address, itemNum);

    let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);

    contract
      .createMarketSend(address, arg)
      .then((tx) => {
        //action prior to transaction being mined
        setLoading(true);
        provider.waitForTransaction(tx.hash).then(() => {
          //action after transaction is mined
          setLoading(false);
          loadNFTs();
        });
      })
      .catch(() => {
        //action to perform when user clicks "reject"
        setLoading(false);
      });
    router.reload();
  };

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

    async function buyNft(nft) {
      /* needs the user to sign the transaction, so will use Web3Provider and sign it */
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );

      /* user will be prompted to pay the asking proces to complete the transaction */
      const price1 = priceD;
      const transaction = await contract.createMarketPurchase(nftaddress, id, {
        value: priceD
      });
      await transaction.wait();

      router.push("/dashboard");
    }

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
                  Wallet Not Connected
                </div>
              ) : (
                <div className=" bg-gray-400 w-64 text-white tracking-tight font-light py-2  rounded hover:bg-gray-600">
                  Wallet Not Connected
                </div>
              )}
            </button>
          ) : (
            <div className="flex justify-center bg-gray-400 w-64 text-white tracking-tight font-bold py-2  rounded hover:bg-gray-600">
              <button onClick={() => onboarding.current?.startOnboarding()}>
                Install Metamask
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        {nfts.map((nft, i) => (
          <div className="">
            {nft.owner === account ? (
              <span className="">
                <div>
                  {nfts.map((nft, i) => (
                    <span className=""></span>
                  ))}
                </div>
              </span>
            ) : (
              <span className="">
                <div>
                  {nfts.map((nft, i) => (
                    <button
                      onClick={() => buyNft(id)}
                      className=" bg-gray-400 w-64 text-white tracking-tight font-light py-2  rounded hover:bg-gray-600"
                    >
                      Purchase Item
                    </button>
                  ))}
                </div>
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {nfts.map((nft, i) => (
        <div className="">
          {lightbox === true ? (
            <span className="absolute top-0 left-0 h-screen w-screen">
              <Lightbox
                image={nft.image}
                title={nft.name}
                allowRotate=""
                onClose={() => {
                  setLightbox(false);
                }}
              />
            </span>
          ) : (
            <span className=""></span>
          )}
        </div>
      ))}

      <Nav />

      {nfts.map((nft, i) => (
        <div className=" max-w-6xl mx-auto flex px-2 md:px-5 md:pt-18 pb-4 pt-16 md:flex-row flex-col">
          <title>
            {nft.name} by {nft.minter}
          </title>
          <div className=" lg:max-w-6xl md:w-1/2 md:ml-24 pt-7 flex flex-col md:items-start md:text-left">
            <div className="relative w-full">
              {nft.onSale === true ? (
                <span class="absolute -top-0.5 -right-3 inline-flex z-0 rounded-full  text-coral-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="38"
                    height="38"
                    viewBox="0 0 24 24"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="currentColor"
                  >
                    <path d="M12.628 21.412l5.969-5.97 1.458 3.71-12.34 4.848-4.808-12.238 9.721 9.65zm-1.276-21.412h-9.352v9.453l10.625 10.547 9.375-9.375-10.648-10.625zm4.025 9.476c-.415-.415-.865-.617-1.378-.617-.578 0-1.227.241-2.171.804-.682.41-1.118.584-1.456.584-.361 0-1.083-.408-.961-1.218.052-.345.25-.697.572-1.02.652-.651 1.544-.848 2.276-.106l.744-.744c-.476-.476-1.096-.792-1.761-.792-.566 0-1.125.227-1.663.677l-.626-.627-.698.699.653.652c-.569.826-.842 2.021.076 2.938 1.011 1.011 2.188.541 3.413-.232.6-.379 1.083-.563 1.475-.563.589 0 1.18.498 1.078 1.258-.052.386-.26.763-.621 1.122-.451.451-.904.679-1.347.679-.418 0-.747-.192-1.049-.462l-.739.739c.463.458 1.082.753 1.735.753.544 0 1.087-.201 1.612-.597l.54.538.697-.697-.52-.521c.743-.896 1.157-2.209.119-3.247zm-9.678-7.476c.938 0 1.699.761 1.699 1.699 0 .938-.761 1.699-1.699 1.699-.938 0-1.699-.761-1.699-1.699 0-.938.761-1.699 1.699-1.699z" />
                  </svg>
                </span>
              ) : (
                <span className=""></span>
              )}
            </div>

            <button onClick={() => setLightbox(true)}>
              <img src={nft.image} className="rounded-lg" />
            </button>
          </div>
          <div className="flex justify-between sm:mb-6 md:justify-start lg:justify-start pl-5"></div>
          <ul>
            <li className="mx-auto md:mx-0 w-11/12 md:w-80 pt-6 text-4xl md:text-4xl tracking-tight  h-auto items-center text-center md:text-left">
              {nft.name}
            </li>
            <li className="mx-auto md:mx-0 w-11/12 md:w-80 tracking-tight pt-3 text-normal md:text-sm items-center text-center  md:text-left md:max-w-md">
              {nft.description}
            </li>

            <li className="flex mx-auto md:mx-0 pt-3 pb-0 sm:text-normal md:text-sm w-2/5 md:max-w-lg text-center md:text-left ">
              <p className="w-auto text-lg md:text-xs text-gray-300 truncate">
                <a href={`/user/${encodeURIComponent(nft.minter)}`}>
                  by {nft.minter}
                </a>
              </p>
            </li>
            <li className="flex mx-auto md:mx-0 pt-0.5 pb-2 sm:text-normal md:text-sm w-2/5 md:max-w-lg text-center md:text-left ">
              <p className="w-auto text-lg md:text-xs text-gray-300 truncate">
                <a href={`/user/${encodeURIComponent(nft.owner)}`}>
                  owner {nft.owner}
                </a>
              </p>
            </li>
            <li className="flex justify-center md:justify-start mb-6 mt-3 z-50">
              <div className="">
                {!!nft.tag1 ? (
                  <span className="">
                    <button
                      id="tagButton2"
                      class="bg-white border border-opacity-80 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
                      onClick={() => returnTags(nft.tag1)}
                    >
                      {nft.tag1}
                    </button>
                  </span>
                ) : (
                  <span className=""></span>
                )}
              </div>

              <div className="">
                {!!nft.tag2 ? (
                  <span className="">
                    <button
                      id="tagButton2"
                      class="bg-white border border-opacity-80 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
                      onClick={() => returnTags(nft.tag2)}
                    >
                      {nft.tag2}
                    </button>
                  </span>
                ) : (
                  <span className=""></span>
                )}
              </div>
            </li>

            <div className="pb-4">
              {nft.onSale === true ? (
                <span>
                  <p className="pt-10 text-4xl md:text-2xl text-center md:text-left">
                    {nft.price} XTO
                  </p>
                </span>
              ) : (
                <span className=""></span>
              )}
            </div>

            {nft.owner === account ? (
              <div className="">
                <span className="mr-2">
                  <div className="">
                    {approved === true ? (
                      <span className="">
                        {nft.onSale === true ? (
                          <span class="">
                            <Popover className="">
                              {({ open }) => (
                                <div className="flex items-center md:items-start flex-col text-gray-300">
                                  <Popover.Button className="mt-2 bg-gray-400 w-64 text-white tracking-tight font-light py-2  rounded hover:bg-gray-600">
                                    Item Options
                                  </Popover.Button>

                                  <Transition
                                    show={open}
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                  >
                                    <Popover.Panel
                                      static
                                      className="z-999 w-60 mx-auto rounded-md "
                                    >
                                      <div className="border bg-white rounded-md shadow-lg transform -translate-y-36 -translate-x-12 ml-1 z-999">
                                        <div className="flex mx-auto w-60 h-auto bg-white">
                                          <ul className="text-gray-700 flex flex-col mx-auto text-sm p-8 py-2">
                                            <li className="flex flex-col mx-auto">
                                              <Disclosure className="z-9999">
                                                {({ open }) => (
                                                  <>
                                                    <Disclosure.Button className=" flex justify-between mt-1 z-9999">
                                                      <span className="hover:bg-gray-300 hover:text-white rounded-lg flex bg-white  text-gray-500 font-light text-sm px-3 py-1">
                                                        <svg
                                                          width="20"
                                                          height="20"
                                                          viewBox="0 0 24 24"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          fill-rule="evenodd"
                                                          clip-rule="evenodd"
                                                          fill="currentColor"
                                                          className="pr-2"
                                                        >
                                                          <path d="M14.224+2L2.829+13.395L10.609+21.172L22+9.781L22+2C22+2+14.224+2+14.224+2ZM13.395+0L24+0L24+10.609L10.609+24L4.76837e-07+13.396L13.395+0ZM16.586+7.414C17.367+8.196+18.632+8.196+19.415+7.415C20.196+6.632+20.196+5.367+19.415+4.586C18.633+3.804+17.367+3.805+16.586+4.585C15.804+5.368+15.805+6.632+16.586+7.414Z" />
                                                        </svg>
                                                        Change Item Price
                                                      </span>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="rounded z-9999">
                                                      <ul>
                                                        <li className=" flex justify-center ">
                                                          <input
                                                            placeholder="New Price in XTO"
                                                            className="mt-1 border rounded py-2 pl-2 text-gray-500 w-full"
                                                            onChange={(e) =>
                                                              updateFormInput({
                                                                ...formInput,
                                                                price:
                                                                  e.target.value
                                                              })
                                                            }
                                                          />
                                                        </li>
                                                        <li className="hover:bg-gray-500 hover:text-white ml-2 mt-1 mb-3  rounded-full w-36 flex justify-center text-gray-500 ">
                                                          <svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            fill="currentColor"
                                                            className="pr-2 transform translate-x-3 translate-y-1"
                                                          >
                                                            <path d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z" />
                                                          </svg>
                                                          <button
                                                            onClick={() =>
                                                              changeItemPrice(
                                                                id
                                                              )
                                                            }
                                                            className=" flex   font-light text-sm px-3 py-1"
                                                          >
                                                            Set New Price
                                                          </button>
                                                        </li>
                                                      </ul>
                                                    </Disclosure.Panel>
                                                  </>
                                                )}
                                              </Disclosure>
                                            </li>

                                            <li className="flex flex-col mx-auto">
                                              <button
                                                onClick={() =>
                                                  cancelMarketItem(id)
                                                }
                                                className="hover:bg-gray-300 hover:text-white rounded-lg  flex bg-white  text-gray-500 font-light text-sm px-3 py-1"
                                              >
                                                <svg
                                                  width="20"
                                                  height="20"
                                                  viewBox="0 0 24 24"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill-rule="evenodd"
                                                  clip-rule="evenodd"
                                                  fill="currentColor"
                                                  className="pr-2"
                                                >
                                                  <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z" />{" "}
                                                </svg>
                                                Remove from Sale
                                              </button>
                                            </li>

                                            <li className="mb-1">
                                              <Disclosure className="flex justify-center  mb-1">
                                                {({ open }) => (
                                                  <>
                                                    <Disclosure.Button className="z-9999 flex justify-end mt-0">
                                                      <li className=" ">
                                                        <div className="hover:bg-gray-300 hover:text-white rounded-lg  flex bg-white ml-6 text-gray-500 font-light text-sm px-3 py-1">
                                                          <svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            fill="currentColor"
                                                            className="pr-2"
                                                          >
                                                            <path d="M0 12l11 3.1 7-8.1-8.156 5.672-4.312-1.202 15.362-7.68-3.974 14.57-3.75-3.339-2.17 2.925v-.769l-2-.56v7.383l4.473-6.031 4.527 4.031 6-22z" />
                                                          </svg>
                                                          Send Item
                                                        </div>
                                                      </li>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="rounded z-9999">
                                                      <ul className="flex flex-col justify-center">
                                                        <li className=" flex justify-center ">
                                                          <input
                                                            placeholder="Address to Send Item"
                                                            className="mt-1 border rounded py-2 pl-2 text-gray-500 w-full"
                                                            onChange={(e) =>
                                                              updateFormInput({
                                                                ...formInput,
                                                                address:
                                                                  e.target.value
                                                              })
                                                            }
                                                          />
                                                        </li>
                                                        <li className="hover:bg-gray-500  ml-6 mt-1 mb-3 hover:text-white rounded-lg w-28 flex justify-center text-gray-500 ">
                                                          <svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            fill="currentColor"
                                                            className="pr-2 transform translate-x-3 translate-y-1"
                                                          >
                                                            <path d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z" />
                                                          </svg>
                                                          <button
                                                            onClick={() =>
                                                              sendItem(id)
                                                            }
                                                            className=" flex   font-light text-sm px-3 py-1"
                                                          >
                                                            Send Item
                                                          </button>
                                                        </li>
                                                      </ul>
                                                    </Disclosure.Panel>
                                                  </>
                                                )}
                                              </Disclosure>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </Popover.Panel>
                                  </Transition>
                                </div>
                              )}
                            </Popover>
                          </span>
                        ) : (
                          <span className="">
                            <Popover className="">
                              {({ open }) => (
                                <div className="items-center md:items-start flex flex-col text-gray-300">
                                  <Popover.Button className="mt-2 bg-gray-400 w-64 text-white tracking-tight font-light py-2  rounded hover:bg-gray-600">
                                    Item Options
                                  </Popover.Button>

                                  <Transition
                                    show={open}
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                  >
                                    <Popover.Panel
                                      static
                                      className="z-999 w-56 mx-auto rounded-md "
                                    >
                                      <div className="border bg-white rounded-md shadow-lg transform -translate-y-28  -translate-x-12 ml-1 z-999">
                                        <div className="flex mx-auto w-56 h-auto ">
                                          <ul className="text-gray-700 flex flex-col mx-auto text-sm p-8 py-2">
                                            <li className="flex flex-col justify-center">
                                              <Disclosure className="z-9999">
                                                {({ open }) => (
                                                  <>
                                                    <Disclosure.Button className="flex justify-center mt-1 z-9999">
                                                      <span className="hover:bg-gray-300 hover:text-white rounded-lg  flex bg-white  text-gray-500 font-light text-sm px-3 py-1">
                                                        <svg
                                                          width="20"
                                                          height="20"
                                                          viewBox="0 0 24 24"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          fill-rule="evenodd"
                                                          clip-rule="evenodd"
                                                          fill="currentColor"
                                                          className="pr-2"
                                                        >
                                                          <path d="M14.224+2L2.829+13.395L10.609+21.172L22+9.781L22+2C22+2+14.224+2+14.224+2ZM13.395+0L24+0L24+10.609L10.609+24L4.76837e-07+13.396L13.395+0ZM16.586+7.414C17.367+8.196+18.632+8.196+19.415+7.415C20.196+6.632+20.196+5.367+19.415+4.586C18.633+3.804+17.367+3.805+16.586+4.585C15.804+5.368+15.805+6.632+16.586+7.414Z" />
                                                        </svg>
                                                        Place On Sale
                                                      </span>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="rounded z-9999">
                                                      <ul>
                                                        <li className=" flex justify-center ">
                                                          <input
                                                            placeholder="New Price in XTO"
                                                            className="mt-1 border rounded py-2 pl-2 text-gray-500 w-full"
                                                            onChange={(e) =>
                                                              updateFormInput({
                                                                ...formInput,
                                                                price:
                                                                  e.target.value
                                                              })
                                                            }
                                                          />
                                                        </li>
                                                        <li className="hover:bg-gray-500  ml-2 mt-1 mb-3 hover:text-white rounded-lg w-36 flex justify-center text-gray-500 ">
                                                          <svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            fill="currentColor"
                                                            className="pr-2 transform translate-x-3 translate-y-1"
                                                          >
                                                            <path d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z" />
                                                          </svg>
                                                          <button
                                                            onClick={() =>
                                                              placeOnSale(id)
                                                            }
                                                            className=" flex   font-light text-sm px-3 py-1"
                                                          >
                                                            Set New Price
                                                          </button>
                                                        </li>
                                                      </ul>
                                                    </Disclosure.Panel>
                                                  </>
                                                )}
                                              </Disclosure>
                                            </li>

                                            <li className="flex flex-col justify-center">
                                              <Disclosure className="z-9999">
                                                {({ open }) => (
                                                  <>
                                                    <Disclosure.Button className="hover:text-gray-600 flex justify-center z-9999">
                                                      <span className="hover:bg-gray-300 hover:text-white rounded-lg  flex bg-white  text-gray-500 font-light text-sm px-3 py-1">
                                                        <svg
                                                          width="20"
                                                          height="20"
                                                          viewBox="0 0 24 24"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          fill-rule="evenodd"
                                                          clip-rule="evenodd"
                                                          fill="currentColor"
                                                          className="pr-2"
                                                        >
                                                          <path d="M0 12l11 3.1 7-8.1-8.156 5.672-4.312-1.202 15.362-7.68-3.974 14.57-3.75-3.339-2.17 2.925v-.769l-2-.56v7.383l4.473-6.031 4.527 4.031 6-22z" />
                                                        </svg>
                                                        Send Item
                                                      </span>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="rounded z-9999">
                                                      <ul>
                                                        <li className=" flex justify-center ">
                                                          <input
                                                            placeholder="Address to Send Item"
                                                            className="mt-1 border rounded py-2 pl-2 text-gray-500 w-full"
                                                            onChange={(e) =>
                                                              updateFormInput({
                                                                ...formInput,
                                                                address:
                                                                  e.target.value
                                                              })
                                                            }
                                                          />
                                                        </li>
                                                        <li className="hover:bg-gray-500  ml-2 mt-1 mb-3 hover:text-white rounded-lg w-36 flex justify-center text-gray-500 ">
                                                          <svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            fill="currentColor"
                                                            className="pr-2 transform translate-x-3 translate-y-1"
                                                          >
                                                            <path d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z" />
                                                          </svg>
                                                          <button
                                                            onClick={() =>
                                                              sendItem(id)
                                                            }
                                                            className=" flex   font-light text-sm px-3 py-1"
                                                          >
                                                            Send Item
                                                          </button>
                                                        </li>
                                                      </ul>
                                                    </Disclosure.Panel>
                                                  </>
                                                )}
                                              </Disclosure>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </Popover.Panel>
                                  </Transition>
                                </div>
                              )}
                            </Popover>
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="">
                        <span class="">
                          <Popover className="mx-auto">
                            {({ open }) => (
                              <div className="items-center md:items-start flex flex-col text-gray-300">
                                <Popover.Button className="mt-2 bg-gray-400 w-64 text-white tracking-tight font-light py-2  rounded hover:bg-gray-600">
                                  Item Options
                                </Popover.Button>

                                <Transition
                                  show={open}
                                  as={Fragment}
                                  enter="transition ease-out duration-200"
                                  enterFrom="opacity-0 translate-y-1"
                                  enterTo="opacity-100 translate-y-0"
                                  leave="transition ease-in duration-150"
                                  leaveFrom="opacity-100 translate-y-0"
                                  leaveTo="opacity-0 translate-y-1"
                                >
                                  <Popover.Panel
                                    static
                                    className="relative z-999 mx-auto"
                                  >
                                    <div className="absolute rounded border -top-48 transform -right-20 translate-x-0  z-999">
                                      <div className="flex mx-auto w-60 h-auto bg-white">
                                        <ul className="text-gray-500 font-light flex flex-col mx-auto text-sm py-2 px-6 py-2">
                                          <li className="font-medium rounded-xl py-1 mb-1 mt-1 px-3 w-full flex mx-auto text-center">
                                            Please Approve Market to Use Tokens
                                          </li>
                                          <li className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs text-center flex mx-auto w-5/6">
                                            (You Will Only Have To Do This
                                            Once.)
                                          </li>
                                          <li className="hover:bg-gray-500   mt-2 mb-3 hover:text-white rounded-lg flex mx-auto justify-center text-gray-500 ">
                                            <svg
                                              width="20"
                                              height="20"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill-rule="evenodd"
                                              clip-rule="evenodd"
                                              fill="currentColor"
                                              className="pr-2 transform translate-x-3 translate-y-1"
                                            >
                                              <path d="M21.856 10.303c.086.554.144 1.118.144 1.697 0 6.075-4.925 11-11 11s-11-4.925-11-11 4.925-11 11-11c2.347 0 4.518.741 6.304 1.993l-1.422 1.457c-1.408-.913-3.082-1.45-4.882-1.45-4.962 0-9 4.038-9 9s4.038 9 9 9c4.894 0 8.879-3.928 8.99-8.795l1.866-1.902zm-.952-8.136l-9.404 9.639-3.843-3.614-3.095 3.098 6.938 6.71 12.5-12.737-3.096-3.096z" />
                                            </svg>
                                            <button
                                              onClick={() => approveMarket()}
                                              className=" flex   font-light text-sm px-3 py-1"
                                            >
                                              Approve illoMX
                                            </button>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </Popover.Panel>
                                </Transition>
                              </div>
                            )}
                          </Popover>
                        </span>
                      </span>
                    )}
                  </div>{" "}
                </span>
              </div>
            ) : (
              <span className=""></span>
            )}

            <div className="">
              {nft.onSale === true ? (
                <span className="pt-10 md:pt-1 flex justify-center md:justify-start">
                  <li className="pt-1 md:pt-3  flex justify-center md:justify-start">
                    <BuyButton triedToEagerConnect={triedToEagerConnect} />
                  </li>
                </span>
              ) : (
                <span className=""></span>
              )}
            </div>
          </ul>
        </div>
      ))}
      <Footer />
    </div>
  );
}
