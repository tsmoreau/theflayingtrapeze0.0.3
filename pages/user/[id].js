/* pages/index.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Footer from "../../components/Footer";
import { formatEtherscanLink, shortenHex } from "../../util";
import Alert from "../../components/AlertFaux";

import Nav from "../../components/Nav";

import { nftaddress, nftmarketaddress, IPFSgateway } from "../../config";
import { injected } from "../../connectors";
import Market from "../../abis/NFTMarket.json";
import NFT from "../../abis/NFT.json";

export default function Home() {
  const router = useRouter();
  const address = router.query.id;
  useEffect(() => {
    loadNFTs();
  }, []);
  const [nfts, setNfts] = useState([]);
  const [created, setCreated] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
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

  let id;
  id = router.query.id;
  if (!id && typeof window !== "undefined") {
    id = window.location.pathname.split("/").pop();
  }

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    console.log(id);
    const data = await marketContract.fetchUserOwnedItems(id);

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

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          itemId: i.itemId,
          minter: i.minter,
          owner: i.owner,
          image: IPFSgateway + meta.data.image.substring(7),
          name: meta.data.name,
          description: meta.data.description,
          tags: meta.data.tags,
          tag1: meta.data.tags[0],
          tag2: meta.data.tags[1],
          onSale: i.onSale,
          address1: "by"
        };

        return item;
      })
    );

    setNfts(items);
    setLoadingState("loaded");
  }

  async function loadOwned() {
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
    const data = await marketContract.fetchUserOwnedItems(router.query.id);
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
          image: IPFSgateway + meta.data.image.substring(7),
          name: meta.data.name,
          description: meta.data.description,
          tags: meta.data.tags,
          tag1: meta.data.tags[0],
          tag2: meta.data.tags[1],
          onSale: i.onSale,
          address1: "by"
        };
        return item;
      })
    );
    setNfts(items);
    console.log(items);
  }

  async function loadMinted() {
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
    const data = await marketContract.fetchUserMintedItems(router.query.id);
    const address1 = "owner";
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const finalURI = IPFSgateway + tokenUri.substring(7);
        const meta = await axios.get(finalURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          minter: i.owner,
          itemId: i.itemId,
          owner: i.owner,
          image: IPFSgateway + meta.data.image.substring(7),
          name: meta.data.name,
          description: meta.data.description,
          tags: meta.data.tags,
          tag1: meta.data.tags[0],
          tag2: meta.data.tags[1],
          onSale: i.onSale,
          address1: "owner"
        };
        return item;
      })
    );

    setNfts(items);
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <div>
        <Nav />
        <div className="mt-36 flex flex-col justify-between items-center">
          <p className=" w-2/3 md:w-1/2 lg:w-1/4  truncate sm:text-6xl text-5xl items-center font-medium Avenir tracking-tight text-gray-900">
            {router.query.id}
          </p>
          <div className="px-4 mt-9">
            <div className="flex justify-between">
              <div className="">
                <button
                  onClick={() => loadOwned()}
                  className="bg-white border border-opacity-80 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
                >
                  Owned
                </button>
                <button
                  onClick={() => loadMinted()}
                  className="bg-white border border-opacity-80 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
                >
                  Created
                </button>
              </div>
            </div>
          </div>{" "}
          <div className="mt-16 mb-40 text-2xl text-medium tracking-tight text-gray-300">
            No Items
          </div>
        </div>
        <Footer />
      </div>
    );
  return (
    <div className="flex flex-col justify-between">
      <Nav />
      <div className="mt-36 flex flex-col justify-between items-center">
        <p className=" w-2/3 md:w-1/2 lg:w-1/4  truncate sm:text-6xl text-5xl items-center font-medium Avenir tracking-tight text-gray-900">
          {router.query.id}
        </p>
        <div className="px-4 mt-9 ">
          <div className="flex justify-between">
            <div className="">
              <button
                onClick={() => loadOwned()}
                className="bg-white border border-opacity-80 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Owned
              </button>
              <button
                onClick={() => loadMinted()}
                className="bg-white border border-opacity-80 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Created
              </button>
            </div>
          </div>
        </div>{" "}
        <div className="flex mx-auto">
          <div className="max-w-6xl px-4 pb-4 mt-0 flex mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-2 pb-4 mt-2">
              {" "}
              {nfts.map((nft, i) => (
                <div
                  key={i}
                  className="shadow-xl max-w-sm border border-opacity-80 rounded-md transition duration-500 ease-in-out"
                >
                  <title>User {router.query.id}</title>
                  <span class="invisible absolute -top-2 right-2 inline-flex z-50 rounded-full h-5 w-5 bg-purple-500"></span>

                  <div className="relative">
                    {nft.onSale === true ? (
                      <span class="absolute -top-0.5 -right-3 inline-flex z-0 rounded-full  text-coral-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
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
                        className="rounded object-cover h-80 w-full"
                      />
                    </a>
                  </div>
                  <div className="p-2 mt-1">
                    <ul>
                      <li className="flex justify-between">
                        <a href={`/item/${encodeURIComponent(nft.itemId)}`}>
                          <li className="flex justify-start w-full overflow-hidden">
                            <p className="text-2xl text-gray-800 w-80 px-4 mt-3 truncate">
                              {nft.name}
                            </p>
                          </li>
                        </a>
                        <span className="mr-2">{/* Insert menu here */}</span>
                      </li>
                      <li className="flex mt-1 justify-between z-9999 ">
                        <a href={`/user/${encodeURIComponent(nft.minter)}`}>
                          <p className="w-32 mb-2 ml-4 text-sm bottom-1 text-gray-300 truncate mt-1.5">
                            {nft.address1} {nft.minter}
                          </p>
                        </a>
                        <div className="">
                          {nft.onSale === true ? (
                            <span>
                              <p className="text-lg mr-3 mb-2 font-normal text-gray-300">
                                {nft.price} XTO
                              </p>
                            </span>
                          ) : (
                            <span className=""></span>
                          )}
                        </div>
                      </li>

                      <li className="flex justify-center mb-3 mt-4 z-50">
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
      <Footer />
    </div>
  );
}
