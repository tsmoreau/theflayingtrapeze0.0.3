/* pages/index.js */
import { ethers } from "ethers";
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
  MinusIcon
} from "@heroicons/react/solid";

import { nftaddress, nftmarketaddress, IPFSgateway } from "../config";
import { injected } from "../connectors";
import Market from "../abis/NFTMarket.json";
import NFT from "../abis/NFT.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [fixed, setFixed] = useState([]);
  const [tags3D, setTags3D] = useState([]);
  const [hasTag1, setTag1] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);

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
    const dataArray = await marketContract.fetchOnSaleItems();

    let string = null;

    const data3 = dataArray
      .slice()
      .sort((a, b) => b.onSaleBlock - a.onSaleBlock);

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const marketItems = await Promise.all(
      data3.map(async (i) => {
        const tokenUri = await marketContract.fetchOnSaleItems();

        let item2 = {
          tokenId: i.itemId.toNumber()
        };

        return item2;
      })
    );
    console.log(data3);

    const items = await Promise.all(
      data3.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta2 = await marketContract.fetchOnSaleItems();
        const finalURI = IPFSgateway + tokenUri.substring(7);
        const meta = await axios.get(finalURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          minter: i.minter,
          owner: i.owner,
          featured: i.featured,
          image: IPFSgateway + meta.data.image.substring(7),
          name: meta.data.name,
          description: meta.data.description,
          tags: meta.data.tags,
          tag1: meta.data.tags[0],
          tag2: meta.data.tags[1],
          itemId: i.itemId.toNumber(),
          block: i.onSaleBlock.toNumber()
        };

        return item;
      })
    );
    console.log(items);

    let arr3 = items.map((item, i) => Object.assign({}, item, marketItems[i]));

    setNfts(arr3);

    console.log(arr3);
    setLoadingState("loaded");
  }

  async function returnTags(arg) {
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
    const data = await marketContract.fetchOnSaleItems();
    const data3 = data.slice().sort((a, b) => b.onSaleBlock - a.onSaleBlock);
    console.log(data3);
    const items = await Promise.all(
      data3.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const finalURI = IPFSgateway + tokenUri.substring(7);
        const meta = await axios.get(finalURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          fixedId: meta.data.external_url.substring(21),
          minter: i.minter,
          owner: i.owner,
          image: IPFSgateway + meta.data.image.substring(7),
          name: meta.data.name,
          description: meta.data.description,
          tags: meta.data.tags,
          tag1: meta.data.tags[0],
          tag2: meta.data.tags[1],
          block: meta.data.onSaleBlock,
          itemId: i.itemId.toNumber()
        };

        return item;
      })
    );
    let tagged = items.filter((e) => {
      return e.tags.includes(arg);
    });
    setNfts(tagged);
  }

  async function returnFeatured() {
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
    const data = await marketContract.fetchOnSaleItems();
    const data3 = data.slice().sort((a, b) => b.onSaleBlock - a.onSaleBlock);
    console.log(data3);
    const items = await Promise.all(
      data3.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const finalURI = IPFSgateway + tokenUri.substring(7);
        const meta = await axios.get(finalURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          fixedId: meta.data.external_url.substring(21),
          minter: i.minter,
          owner: i.owner,
          featured: i.featured,
          image: IPFSgateway + meta.data.image.substring(7),
          name: meta.data.name,
          description: meta.data.description,
          tags: meta.data.tags,
          tag1: meta.data.tags[0],
          tag2: meta.data.tags[1],
          block: meta.data.onSaleBlock,
          itemId: i.itemId.toNumber()
        };

        return item;
      })
    );

    let featuredItems = items.filter(function (e) {
      return e.featured === true;
    });
    setNfts(featuredItems);
  }

  async function resetTags() {
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
    const data = await marketContract.fetchOnSaleItems();
    const data3 = data.slice().sort((a, b) => b.onSaleBlock - a.onSaleBlock);
    console.log(data3);
    const items = await Promise.all(
      data3.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const finalURI = IPFSgateway + tokenUri.substring(7);
        const meta = await axios.get(finalURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          fixedId: meta.data.external_url.substring(21),
          minter: i.minter,
          owner: i.owner,
          image: IPFSgateway + meta.data.image.substring(7),
          name: meta.data.name,
          description: meta.data.description,
          tags: meta.data.tags,
          tag1: meta.data.tags[0],
          tag2: meta.data.tags[1],
          itemId: i.itemId.toNumber()
        };

        return item;
      })
    );

    setNfts(items);
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <div>
        <div className="flex flex-col justify-center">
          <div className="px-4 w-5xl flex mx-auto mt-8">
            <div className="justify-between">
              <button
                onClick={() => resetTags()}
                className="bg-white border-double border-4 border-opacity-80 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-2 py-0.5 mr-0.5"
              >
                RESET
              </button>
              <button
                onClick={() => returnFeatured()}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                FEATURED!
              </button>

              <button
                onClick={() => returnTags("3D")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                3D
              </button>

              <button
                onClick={() => returnTags("Abstract")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Abstract
              </button>
              <button
                onClick={() => returnTags("Animated")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Animated
              </button>
              <button
                onClick={() => returnTags("Design")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Design
              </button>
              <button
                onClick={() => returnTags("Games")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Games
              </button>
              <button
                onClick={() => returnTags("Illustration")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Illustration
              </button>
              <button
                onClick={() => returnTags("Meme")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Meme
              </button>

              <button
                onClick={() => returnTags("Music")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Music
              </button>
              <button
                onClick={() => returnTags("Painting")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Painting
              </button>
              <button
                onClick={() => returnTags("Photo")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Photo
              </button>
              <button
                onClick={() => returnTags("Trash")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Trash
              </button>
              <button
                onClick={() => returnTags("Other")}
                className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
              >
                Other...
              </button>
            </div>
          </div>{" "}
          <span className="flex mx-auto text-3xl text-gray-300 mt-12">
            No Items
          </span>
        </div>
      </div>
    );
  return (
    <div className="flex flex-col justify-center">
      <div className="px-4 w-5xl flex mx-auto mt-8">
        <div className="justify-between items-center text-center ">
          <button
            onClick={() => resetTags()}
            className="bg-white border-double border-4 border-opacity-80 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-2 py-0.5 mr-0.5"
          >
            RESET
          </button>
          <button
            onClick={() => returnFeatured()}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            FEATURED!
          </button>

          <button
            onClick={() => returnTags("3D")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            3D
          </button>

          <button
            onClick={() => returnTags("Abstract")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            Abstract
          </button>
          <button
            onClick={() => returnTags("Animated")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            Animated
          </button>
          <button
            onClick={() => returnTags("Design")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            Design
          </button>
          <button
            onClick={() => returnTags("Games")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            Games
          </button>
          <button
            onClick={() => returnTags("Illustration")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            Illustration
          </button>
          <button
            onClick={() => returnTags("Meme")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            Meme
          </button>

          <button
            onClick={() => returnTags("Music")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            Music
          </button>
          <button
            onClick={() => returnTags("Painting")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            Painting
          </button>
          <button
            onClick={() => returnTags("Photo")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            Photo
          </button>
          <button
            onClick={() => returnTags("Trash")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            Trash
          </button>
          <button
            onClick={() => returnTags("Other")}
            className="bg-white border border-opacity-80	 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5"
          >
            Other...
          </button>
        </div>
      </div>{" "}
      <div className="flex mx-auto">
        <div className="max-w-7xl px-4 pb-4 flex mx-auto">
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2 pb-4 mt-2">
            {" "}
            {nfts.map((nft, i) => (
              <div
                key={i}
                className=" shadow-sm max-w-sm border border-opacity-50 rounded-lg "
              >
                <span class="invisible absolute -top-2 right-2 inline-flex  rounded h-5 w-5 bg-purple-500"></span>

                <span class="invisible absolute -top-2 right-5 inline-flex  rounded h-5 w-5 bg-purple-500"></span>
                <div className="w-full">
                  <a href={`/item/${encodeURIComponent(nft.itemId)}`}>
                    <img
                      src={nft.image}
                      className="h-80 w-80 rounded object-cover"
                    />
                  </a>
                </div>
                <div className="p-2 mt-1">
                  <ul>
                    <li className="flex justify-center">
                      <a href={`/item/${encodeURIComponent(nft.itemId)}`}>
                        <li className="flex mx-auto justify-center w-60 ">
                          <p className="tracking-tight mt-1 text-2xl w-auto truncate">
                            {nft.name}
                          </p>
                        </li>
                      </a>
                    </li>
                    <div className="flex justify-center">
                      <li className="flex justify-between  mt-1.5 w-full px-3 ">
                        <a href={`/user/${encodeURIComponent(nft.minter)}`}>
                          <p className="w-28 mb-2 ml-4 text-sm bottom-1 mt-2 text-gray-300 truncate ">
                            by {nft.minter}
                          </p>
                        </a>
                        <p className="text-lg mr-4 mb-2  font-normal text-gray-300">
                          {nft.price} XTO
                        </p>
                      </li>
                    </div>

                    <li className="flex justify-center mb-2 mt-3 ">
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
          <div className="hidden flex mx-auto max-w-6xl w-full flex-row justify-center absolute border transform -translate-y-12">
            <Menu as="div" className="relative z-9999 inline-block text-left ">
              <div>
                <Menu.Button className="inline-flex justify-center w-full pl-3 pr-4 pt-1.5 pb-0.5 text-xs font-medium text-white bg-gradient-to-br from-gray-300 to-gray-400 rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <ChevronDownIcon
                    className="w-5 h-5 -ml-1 mr-0 pb-1 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
                  Filters
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="rounded-lg border z-9999 absolute flex flex-col justify-end -left-0 w-36 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 w-full">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          All
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Featured
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Following
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Unsold
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <Menu as="div" className="relative z-9999 inline-block text-left ">
              <div>
                <Menu.Button className="inline-flex justify-center w-full pl-3 pr-4 pt-1.5 pb-0.5 text-xs font-medium text-white bg-gradient-to-br from-gray-300 to-gray-400 rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <ChevronDownIcon
                    className="w-5 h-5 -ml-1 mr-0 pb-1 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
                  Tags
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="rounded-lg border z-9999 absolute flex flex-col justify-end -left-0 w-36 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 w-full">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          All
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          3D
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Abstract
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Animated
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Design
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Games
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Illustration
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Meme
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Music
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Painting
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Photo
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Trash
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          Other
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <Menu as="div" className="relative z-9999 inline-block text-left ">
              <div>
                <Menu.Button className="inline-flex justify-center w-full pl-3 pr-4 pt-1.5 pb-0.5 text-xs font-medium text-white bg-gradient-to-br from-gray-300 to-gray-400 rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  <ChevronDownIcon
                    className="w-5 h-5 -ml-1 mr-0 pb-1 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
                  Sorting
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="rounded-lg border z-9999 absolute flex flex-col justify-end -left-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 w-full">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          By Newest
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          By Oldest
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          By Price (Low to High)
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          By Price (High to Low)
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          By Price (Range)
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          By Likes (Low to High)
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-blue-100 text-white" : "text-gray-500"
                          } group flex justify-start rounded-md items-center w-full px-2 py-1 text-sm`}
                        >
                          By Likes (High to Low)
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
