/* pages/creator-dashboard.js */
import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { nftmarketaddress, nftaddress, IPFSgateway } from "../../config";
import { Popover, Transition, Dialog, Disclosure } from "@headlessui/react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import Market from "../../abis/NFTMarket.json";
import NFT from "../../abis/NFT.json";

export default function DashboardItemsOwned() {
  const [nfts, setNfts] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approved, setApproved] = useState([]);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
    tags: "",
    address: ""
  });
  const {
    active,
    error,
    activate,
    chainId,
    account,
    setError
  } = useWeb3React();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchMyOwnedItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const finalURI = IPFSgateway + tokenUri.substring(7);
        const meta = await axios.get(finalURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          itemId: i.itemId,
          minter: i.minter,
          owner: i.owner,
          sold: i.sold,
          image: IPFSgateway + meta.data.image.substring(7),
          name: meta.data.name,
          description: meta.data.description,
          tag1: meta.data.tags[0],
          tag2: meta.data.tags[1],
          onSale: i.onSale
        };
        return item;
      })
    );

    const addy = await signer.getAddress();
    console.log("Address");
    console.log(addy);
    const isApproved = await tokenContract.isApprovedForAll(
      addy,
      nftmarketaddress
    );

    setApproved(isApproved);

    setNfts(items);

    setLoadingState("loaded");
    console.log(approved);
  }

  const cancelMarketItem = async (arg) => {
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
          loadNFTs2();
        });
      })
      .catch(() => {
        //action to perform when user clicks "reject"
        setLoading(false);
      });
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
    console.log("test");
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
  };

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className="py-10 px-20 text-3xl text-gray-300 mt-20">
        No Items Owned
      </h1>
    );
  return (
    <div>
      <div className="mt-2 flex flex-col justify-between items-center ">
        <div className="flex mx-auto">
          <div className=" px-4 pb-4 flex mx-auto">
            <div className=" grid grid-cols- sm:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-3 pb-4 mt-0 mb-4">
              {" "}
              {nfts.map((nft, i) => (
                <div
                  key={i}
                  className="shadow-xl  border border-opacity-80 rounded-md transition duration-500 ease-in-out "
                >
                  <span class="invisible absolute -top-2 right-2 inline-flex z-50 rounded-full h-5 w-5 bg-purple-500"></span>

                  <div className="relative ">
                    {nft.onSale === true ? (
                      <span class="absolute -top-0.5 -right-4 inline-flex z-0 rounded-full  text-coral-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
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

                  <div className="">
                    <a href={`/item/${encodeURIComponent(nft.itemId)}`}>
                      <img
                        src={nft.image}
                        className="rounded object-cover h-64 w-64"
                      />
                    </a>
                  </div>
                  <div className="p-2 mt-2">
                    <ul>
                      <li className="w-full flex justify-between">
                        <a href={`/item/${encodeURIComponent(nft.itemId)}`}>
                          <li className="flex justify-start w-full overflow-hidden">
                            <p className="text-xl text-gray-800 w-36 md:w-36 lg:w-48 px-4 mt-1 truncate">
                              {nft.name}
                            </p>
                          </li>
                        </a>
                        <span className="mr-2">
                          <div className="">
                            {approved === true ? (
                              <span className="">
                                {nft.onSale === true ? (
                                  <span class="">
                                    <Popover className="mx-auto">
                                      {({ open }) => (
                                        <div className="flex flex-col text-gray-300">
                                          <Popover.Button className="p-3">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="currentColor"
                                            >
                                              <path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
                                            </svg>
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
                                              className="z-999  mx-auto"
                                            >
                                              <div className="absolute z-999">
                                                <div className="absolute transform translate-y-3 -right-8 -translate-x-1 rounded-lg border -top-40 flex mx-auto w-60 h-auto bg-white">
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
                                                                Change Item
                                                                Price
                                                              </span>
                                                            </Disclosure.Button>
                                                            <Disclosure.Panel className="rounded z-9999">
                                                              <ul>
                                                                <li className=" flex justify-center ">
                                                                  <input
                                                                    placeholder="New Price in XTO"
                                                                    className="mt-1 border rounded py-2 pl-2 text-gray-500 w-full"
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      updateFormInput(
                                                                        {
                                                                          ...formInput,
                                                                          price:
                                                                            e
                                                                              .target
                                                                              .value
                                                                        }
                                                                      )
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
                                                                        nft.itemId
                                                                      )
                                                                    }
                                                                    className=" flex   font-light text-sm px-3 py-1"
                                                                  >
                                                                    Set New
                                                                    Price
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
                                                          cancelMarketItem(
                                                            nft.itemId
                                                          )
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
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      updateFormInput(
                                                                        {
                                                                          ...formInput,
                                                                          address:
                                                                            e
                                                                              .target
                                                                              .value
                                                                        }
                                                                      )
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
                                                                      sendItem(
                                                                        nft.itemId
                                                                      )
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
                                    <Popover className="mx-auto">
                                      {({ open }) => (
                                        <div className="flex flex-col text-gray-300">
                                          <Popover.Button className="p-3">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="currentColor"
                                            >
                                              <path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
                                            </svg>
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
                                              className="z-999  mx-auto"
                                            >
                                              <div className="absolute z-999">
                                                <div className="absolute transform translate-y-3 -right-7 -translate-x-0.5 rounded-lg border -top-32 flex mx-auto w-60 h-auto bg-white">
                                                  <ul className="text-gray-700 flex flex-col mx-auto text-sm p-8 py-2">
                                                    <li className="flex flex-col mx-auto">
                                                      <Disclosure className="z-9999">
                                                        {({ open }) => (
                                                          <>
                                                            <Disclosure.Button className="mx-auto flex justify-between mt-1 z-9999">
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
                                                                Place On Sale
                                                              </span>
                                                            </Disclosure.Button>
                                                            <Disclosure.Panel className="rounded z-9999">
                                                              <ul>
                                                                <li className=" flex justify-center ">
                                                                  <input
                                                                    placeholder="New Price in XTO"
                                                                    className="mt-1 border rounded py-2 pl-2 text-gray-500 w-full"
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      updateFormInput(
                                                                        {
                                                                          ...formInput,
                                                                          price:
                                                                            e
                                                                              .target
                                                                              .value
                                                                        }
                                                                      )
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
                                                                      placeOnSale(
                                                                        nft.itemId
                                                                      )
                                                                    }
                                                                    className=" flex   font-light text-sm px-3 py-1"
                                                                  >
                                                                    Set New
                                                                    Price
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
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      updateFormInput(
                                                                        {
                                                                          ...formInput,
                                                                          address:
                                                                            e
                                                                              .target
                                                                              .value
                                                                        }
                                                                      )
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
                                                                      sendItem(
                                                                        nft.itemId
                                                                      )
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
                                      <div className="flex flex-col text-gray-300">
                                        <Popover.Button className=" p-3">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                          >
                                            <path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
                                          </svg>
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
                                            <div className="absolute rounded border -top-48 transform -right-7 z-999">
                                              <div className="flex mx-auto w-60 h-auto bg-white">
                                                <ul className="text-gray-500 font-light flex flex-col mx-auto text-sm py-2 px-6 py-2">
                                                  <li className="font-medium rounded-xl py-1 mb-1 mt-1 px-3 w-full flex mx-auto text-center">
                                                    Please Approve Market to Use
                                                    Tokens
                                                  </li>
                                                  <li className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs text-center flex mx-auto w-5/6">
                                                    (You Will Only Have To Do
                                                    This Once.)
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
                                                      onClick={() =>
                                                        approveMarket()
                                                      }
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
                      </li>

                      <li className="mt-1 w-full flex justify-between">
                        <a href={`/user/${encodeURIComponent(nft.minter)}`}>
                          <p className="w-24 mb-2 ml-4 pt-2 text-sm bottom-1 text-gray-300 truncate ">
                            by {nft.minter}
                          </p>
                        </a>

                        <div className="">
                          {nft.onSale === true ? (
                            <span>
                              <p className=" text-lg mr-3 mb-2 font-normal text-gray-300">
                                {nft.price} XTO
                              </p>
                            </span>
                          ) : (
                            <span className=""></span>
                          )}
                        </div>
                      </li>

                      <li className="flex justify-center mb-2 mt-1">
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
                      <li></li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="">
        {loading === true ? (
          <div class="border w-full h-full fixed top-0 left-0 opacity-90 bg-white z-9999">
            <div class=" transform translate-y-36">
              <div class="flex flex-col items-center justify-center ">
                <div className="mb-8 w-2/3 md:w-1/5 text-gray-400 text-4xl flex mx-auto text-center tracking-tight">
                  Please Wait While The Transaction is Mined...
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="w-24 h-24 text-gray-400 animate-spin"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm8 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-19 0c0-6.065 4.935-11 11-11v2c-4.962 0-9 4.038-9 9 0 2.481 1.009 4.731 2.639 6.361l-1.414 1.414.015.014c-2-1.994-3.24-4.749-3.24-7.789z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <span className=""></span>
        )}
      </div>
      <div className="">
        {approveLoading === true ? (
          <div class="border w-full h-full fixed top-0 left-0 opacity-90 bg-white z-9999">
            <div class=" transform translate-y-36">
              <div class="flex flex-col items-center justify-center ">
                <div className="mb-8 w-2/3 md:w-1/5 text-gray-400 text-4xl flex mx-auto text-center tracking-tight">
                  Please Approve The Marketplace to Transfer Your Items...
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="w-24 h-24 text-gray-400 animate-spin"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm8 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-19 0c0-6.065 4.935-11 11-11v2c-4.962 0-9 4.038-9 9 0 2.481 1.009 4.731 2.639 6.361l-1.414 1.414.015.014c-2-1.994-3.24-4.749-3.24-7.789z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <span className=""></span>
        )}
      </div>
    </div>
  );
}
