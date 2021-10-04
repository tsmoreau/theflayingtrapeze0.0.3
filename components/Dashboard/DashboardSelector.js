/* pages/creator-dashboard.js */
import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Create from "../ModalCreateBox";
import { nftmarketaddress, nftaddress, IPFSgateway } from "../../config";

import ItemsOwned from "./DashboardItemsOwned";
import ItemsCreated from "./DashboardItemsCreated";

import Market from "../../abis/NFTMarket.json";
import NFT from "../../abis/NFT.json";

import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([]);
  const [mynfts, setMyNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
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
    const data = await marketContract.fetchMyMintedItems();

    const myItems = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const finalURI = IPFSgateway + tokenUri.substring(7);
        const meta = await axios.get(finalURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          minter: i.minter,
          owner: i.owner,
          image: IPFSgateway + meta.data.image.substring(7),
          name: meta.data.name,
          description: meta.data.description,
          tags: meta.data.tags,
          tag1: meta.data.tags[0],
          tag2: meta.data.tags[1]
        };

        return item;
      })
    );

    /* create a filtered array of items that have been sold */
    const soldItems = myItems.filter((i) => i.sold);
    setSold(soldItems);
    setNfts(myItems);
    setLoadingState("loaded");
  }
  return (
    <div className="">
      <div className="flex flex-col">
        <Tab.Group>
          <Tab.List className="flex mx-auto mt-1">
            <div>
              <Tab className={({ selected }) => (selected ? "" : "")}>
                <button
                  className="bg-white border border-opacity-80 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-3 py-1 mr-0.5
              
                
              "
                >
                  Owned
                </button>
              </Tab>
              <Tab className={({ selected }) => (selected ? "" : "")}>
                <button
                  className="
                "
                >
                  Created
                </button>
              </Tab>
            </div>
            <span></span>
            <div className="">
              <Create />
            </div>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel className="">
              <ItemsOwned />
            </Tab.Panel>
            <Tab.Panel>
              <ItemsCreated />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
